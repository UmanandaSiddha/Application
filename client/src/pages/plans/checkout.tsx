import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Plan } from "@/types/plan_types";
import { SinglePlanResponse, UserResponse } from "@/types/api-types";
import { userExist } from "@/redux/reducer/userReducer";

function loadScript(src: any) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const Checkout = () => {

    const [search] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = search.get("id");
    const [plan, setPlan] = useState<Plan | null>();
    const [open, setOpen] = useState<boolean>(false);
    const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>("Waiting For Confirmation");
    const [dialogData, setDialogData] = useState({
        subscriptionStatus: "hold on",
        paymentStatus: "hold on",
    });
    const { user } = useSelector((state: RootState) => state.userReducer);

    const [updateData, setUpdateData] = useState({
        phone: user?.phone,
        street: user?.billingAddress?.street,
        state: user?.billingAddress?.state,
        city: user?.billingAddress?.city,
        postalCode: user?.billingAddress?.postalCode,
        country: user?.billingAddress?.country,
    });
    
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [sdkLoading, setSdkLoading] = useState<boolean>(false);

    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const fetchPlan = async () => {
        try {
            const { data }: { data: SinglePlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/details/${id}`, { withCredentials: true });
            setPlan(data.plan);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        const plansData = window.sessionStorage.getItem("all_plans");
        if (plansData) {
            if (JSON.parse(plansData)?.created < Date.now()) {
                window.localStorage.removeItem("all_plans");
                fetchPlan();
            } else {
                const currentPlan: Plan[] = JSON.parse(plansData).data.filter((cPlan: Plan) => cPlan._id === id);
                if (currentPlan.length > 0) {
                    setPlan(currentPlan[0]);
                } else {
                    fetchPlan();
                }
            }
        } else {
            fetchPlan();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { phone, billingAddress } = user || {};
        const { street, state, city, postalCode, country } = billingAddress || {};
        const isDataSame =
            phone === updateData.phone &&
            street === updateData.street &&
            state === updateData.state &&
            city === updateData.city &&
            postalCode === updateData.postalCode &&
            country === updateData.country;

        if (isDataSame) {
            toast.warning("Make changes to update");
            return;
        }

        for (const [field, value] of Object.entries(updateData)) {
            if (!value) {
                toast.warning(`${field} is required`);
                return;
            }
        }
        setUpdateLoading(true);
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/billing/update`, updateData, { withCredentials: true });
            dispatch(userExist(data.user));
            toast.success("Billing details updated");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        setUpdateLoading(false);
    }

    const handlePayment = async (razId: string) => {
        setSdkLoading(true);
        if (!id || plan?._id !== id) {
            setSdkLoading(false);
            toast.error("This is a broken link");
            return;
        }

        const { phone, billingAddress } = user || {};
        if (!phone || !billingAddress) {
            setSdkLoading(false);
            toast.warning("Please update your billing details");
            return;
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            setSdkLoading(false);
            toast.warning("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setCheckoutLoading(true);

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new`, { id: razId }, config);
            if (!data) {
                setSdkLoading(false);
                toast.error("Failed to Execute Payment");
                return;
            }
            const options = {
                key: data.key,
                currency: "INR",
                name: "VCards App",
                description: "just fine",
                subscription_id: data.subscriptions_id,
                handler: async function (response: any) {
                    try {
                        setOpen(true);
                        const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/capture`, response, config);
                        if (["active", "created", "authenticated"].includes(data.subscriptionStatus) && ["authorized", "captured", "created"].includes(data.paymentStatus)) {
                            setDialogHeader("Redirecting to Dashboard...");
                            setDialogData({
                                subscriptionStatus: data.subscriptionStatus,
                                paymentStatus: data.paymentStatus,
                            });
                            toast.success("All set");
                            setTimeout(() => {
                                setOpen(false);
                                navigate(from, { replace: true });
                            }, 3000);
                        } else {
                            setDialogHeader("An Error Occured");
                            setDialogData({
                                subscriptionStatus: "pending",
                                paymentStatus: "pending",
                            });
                            toast.error("If the amount was debited from your account, please don't pay again. We are looking into this matter");
                            setTimeout(() => {
                                setOpen(false);
                            }, 3000);
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                timeout: 120,
                readonly: {
                    email: user?.email,
                    name: user?.name,
                },
                remember_customer: true,
                // customer_id: "cust_NZH06k5bvcDzUE",
                theme: {
                    color: "#3399cc",
                },
            };
            const razor = new (window as any).Razorpay(options);
            razor.on("payment.failed", function (response: any) {
                setSdkLoading(false);
                // send error message to server
                console.log(response.error.description);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
                console.log(response);
                toast.info(response.error.description);
            });
            razor.open();
        } catch (error: any) {
            setSdkLoading(false);
            toast.error(error.response.data.message);
        }

        setSdkLoading(false);
        setCheckoutLoading(false);
    };

    return (
        <div className="w-[80%] mx-auto mt-8 mb-12">
            <div className="flex justify-center items-center gap-4">
                {sdkLoading && (
                    <div className="font-Kanit">
                    <div
                        className="fixed inset-0 bg-opacity-30 backdrop-blur lg flex justify-center items-center z-10"
                        id="popupform"
                    >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </div>
                </div>
                )}
                {open && (
                    <div className="font-Kanit">
                        <div
                            className="fixed inset-0 bg-opacity-30 backdrop-blur lg flex justify-center items-center z-10"
                            id="popupform"
                        >
                            <div className="bg-white p-8 rounded shadow-lg w-[425px]">
                                <h2 className="text-lg font-bold mb-4 flex justify-center underline">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {dialogHeader}
                                </h2>
                                <div>
                                    <p>Payment Status: {dialogData.paymentStatus}</p>
                                    <p>Subscription Status: {dialogData.subscriptionStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                <div className="px-4 pt-2">
                    <p className="text-xl font-medium">User Details</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input type="text" readOnly id="name" value={user?.name} name="name" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input type="email" readOnly id="email" value={user?.email} name="email" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@example.com" />
                        </div>
                        <form onSubmit={handleUpdate} className="mt-8 space-y-2">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="123-456-7890"
                                    value={updateData.phone}
                                    onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="billing-address" className="block text-sm font-medium">Billing Address</label>
                                <input
                                    type="text"
                                    id="billing-address"
                                    name="billing-address"
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Street Address"
                                    value={updateData.street}
                                    onChange={(e) => setUpdateData({ ...updateData, street: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    name="city"
                                    className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="City"
                                    value={updateData.city}
                                    onChange={(e) => setUpdateData({ ...updateData, city: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="state"
                                    className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="State"
                                    value={updateData.state}
                                    onChange={(e) => setUpdateData({ ...updateData, state: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    name="zip"
                                    className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Postal Code"
                                    value={updateData.postalCode}
                                    onChange={(e) => setUpdateData({ ...updateData, postalCode: e.target.value })}
                                />
                                <input
                                    type="text"
                                    name="country"
                                    className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Country"
                                    value={updateData.country}
                                    onChange={(e) => setUpdateData({ ...updateData, country: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sdkLoading || updateLoading}
                                className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm"
                            >
                                {sdkLoading || updateLoading ? "Hold on..." : "Update Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <p className="text-xl font-medium">Plan Details</p>
                    <div className="mt-4 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                        <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                            <div className="flex w-full flex-col px-4 py-4">
                                <span className="font-semibold">{plan?.name}</span>
                                <p className="text-sm text-gray-400">Description: {plan?.description}</p>
                                <p className="text-sm text-gray-400">Cards: {plan?.cards}</p>
                                <p className="text-sm text-gray-400">Price: Rs {plan?.amount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-b py-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Billing Amount</p>
                            <p className="font-semibold text-gray-900">Rs {plan?.amount}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Billing Period</p>
                            <p className="font-semibold text-gray-900">1 Year</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-lg font-medium text-gray-900">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">Rs {plan?.amount}</p>
                        </div>
                    </div>

                    <button
                        disabled={!user || !id || plan?._id !== id || checkoutLoading}
                        onClick={() => handlePayment(plan?.razorPlanId!)}
                        className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm"
                    >
                        {checkoutLoading ? "Hold on..." : "Buy Now"}
                    </button>

                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <img src="./upi.svg" alt="UPI" className="h-6" />
                        <img src="./visa.svg" alt="Visa" className="h-8" />
                        <img src="./mastercard.svg" alt="Mastercard" className="h-6" />
                        <img src="./google-pay.svg" alt="GooglePay" className="h-10" />
                        <img src="./paytm.svg" alt="Paytm" className="h-4" />
                        <img src="./rupay.svg" alt="Rupay" className="h-4" />
                    </div>

                    <p className="mt-4 text-center italic text-md text-bold text-gray-700 flex items-center justify-center">
                        Powered by <img src="./razorpay.svg" alt="Razorpay" className="h-5 ml-2" />
                    </p>
                </div>
            </div>
        </div>
    )
};

export default Checkout;

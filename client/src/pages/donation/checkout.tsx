import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { DonatorResponse } from "@/types/api-types";
import { donatorExist } from "@/redux/reducer/donatorReducer";

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

const DonationCheckout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>("Waiting for Confirmation");
    const [dialogData, setDialogData] = useState({
        subscriptionStatus: "hold on",
        paymentStatus: "hold on",
    });
    const [isRecurring, setIsRecurring] = useState<boolean>(true);
    const { donator } = useSelector((state: RootState) => state.donatorReducer);

    const [paymentData, sePaymentData] = useState({
        amount: '',
        period: '',
        currency: ''
    });

    const [updateData, setUpdateData] = useState({
        name: donator?.name,
        phone: donator?.phone,
        pan: donator?.pan,
        street: donator?.address?.street,
        state: donator?.address?.state,
        city: donator?.address?.city,
        postalCode: donator?.address?.postalCode,
        country: donator?.address?.country,
    });

    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [sdkLoading, setSdkLoading] = useState<boolean>(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, phone, address } = donator || {};
        const { street, state, city, postalCode, country } = address || {};
        const isDataSame =
            name === updateData.name &&
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
            if (field !== 'pan' && !value) {
                toast.warning(`${field} is required`);
                return;
            }
        }

        setUpdateLoading(true);
        try {
            const { data }: { data: DonatorResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new`, updateData, { withCredentials: true });
            dispatch(donatorExist(data.donator));
            toast.success("Succssfully updated");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        setUpdateLoading(false);
    }


    const handlePayment = async () => {
        setSdkLoading(true);

        const { name, phone, address } = donator || {};
        if (!name || !phone || !address) {
            setSdkLoading(false);
            toast.warning("Please update your billing details");
            return;
        }

        const { amount, period, currency } = paymentData;
        if (isRecurring) {
            if (!amount || !period) {
                toast.warning("All fields are required");
                setSdkLoading(false);
                return;
            }
        } else {
            if (!amount || !currency) {
                toast.warning("All fields are required");
                setSdkLoading(false);
                return;
            }
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            setSdkLoading(true);
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setCheckoutLoading(true);

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };

            let options;

            if (isRecurring) {
                const { planData }: { planData: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/plan`, { paymentData }, config);
                if (!planData) {
                    toast.error("Failed to Create Plan");
                }
                toast.success("Successfully creaeted plan");

                const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/subscription`, { id: planData.plan.id }, config);
                if (!data) {
                    toast.error("Failed to Execute Payment");
                }

                options = {
                    key: data.key,
                    currency: "INR",
                    name: "VCards App",
                    description: "just fine",
                    subscription_id: data.subscriptions_id,
                    handler: async function (response: any) {
                        setOpen(true);
                        const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/capture`, response, config);
                        if (["active", "created", "authenticated", "activated"].includes(data.subscriptionStatus) && ["authorized", "captured", "created"].includes(data.paymentStatus)) {
                            setDialogHeader("Redirecting to Dashboard...");
                            setDialogData({
                                subscriptionStatus: data.subscriptionStatus,
                                paymentStatus: data.paymentStatus,
                            });
                            toast.success("All set");
                            setTimeout(() => {
                                setOpen(false);
                                navigate("/dashboard");
                            }, 3000);
                        } else {
                            setDialogHeader("An Error Occurred");
                            setDialogData({
                                subscriptionStatus: "pending",
                                paymentStatus: "pending",
                            });
                            toast.error("Error occurred, please try again");
                            setTimeout(() => {
                                setOpen(false);
                            }, 3000);
                        }
                    },
                    prefill: {
                        email: donator?.email,
                    },
                    timeout: 120,
                    readonly: {
                        email: donator?.email,
                        name: donator?.name,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
            } else {
                const { donationData }: { donationData: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/pay`, { paymentData }, config);
                if (!donationData) {
                    toast.error("Failed to Execute Payment");
                }

                options = {
                    key: donationData.key,
                    currency: donationData.order.currency,
                    amount: donationData.order.amount,
                    name: "VCards App",
                    description: "just fine",
                    order_id: donationData.order._id,
                    handler: async function (response: any) {
                        setOpen(true);
                        const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/verify/pay`, response, config);
                        if (["authorized", "captured", "created"].includes(data.paymentStatus)) {
                            setDialogHeader("Redirecting to Dashboard...");
                            setDialogData({
                                subscriptionStatus: "",
                                paymentStatus: data.paymentStatus,
                            });
                            toast.success("All set");
                            setTimeout(() => {
                                setOpen(false);
                                navigate("/dashboard");
                            }, 3000);
                        } else {
                            setDialogHeader("An Error Occurred");
                            setDialogData({
                                subscriptionStatus: "pending",
                                paymentStatus: "pending",
                            });
                            toast.error("Error occurred, please try again");
                            setTimeout(() => {
                                setOpen(false);
                            }, 3000);
                        }
                    },
                    prefill: {
                        email: donator?.email,
                    },
                    timeout: 120,
                    readonly: {
                        email: donator?.email,
                        name: donator?.name,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
            }

            const razor = new (window as any).Razorpay(options);
            razor.on("payment.failed", function (response: any) {
                console.log(response.error.description);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
                toast.info(response.error.description);
            });
            razor.open();
            console.log("clicked");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const handleDonationTypeChange = () => {
        setIsRecurring(!isRecurring);
    };

    return (
        <div className="w-[80%] mx-auto mt-6 mb-12">
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
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                {/* User Details Section */}
                <div className="px-4 pt-4">
                    <p className="text-xl font-medium">Donator Details</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input type="email" id="email" readOnly value={donator?.email} name="email" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@example.com" />
                        </div>
                        <form onSubmit={handleUpdate} className="mt-8 space-y-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" 
                                    placeholder="Your Name" 
                                    value={updateData.name}
                                    onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                                />
                            </div>
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
                                <label htmlFor="pan" className="block text-sm font-medium">PAN Card Number</label>
                                <input 
                                    type="text" 
                                    id="pan" 
                                    name="pan" 
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" 
                                    placeholder="PAN Card Number" 
                                    value={updateData.pan}
                                    onChange={(e) => setUpdateData({ ...updateData, pan: e.target.value })}
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

                {/* Donation Details Section */}
                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-medium">Donation Details</p>
                        <label htmlFor="toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input id="toggle" type="checkbox" className="sr-only" onChange={handleDonationTypeChange} />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                                {isRecurring ? 'Recurring' : 'One-Time'}
                            </div>
                        </label>
                    </div>

                    <div className="mt-4 space-y-3 rounded-lg px-2 py-4 sm:px-6">
                        {isRecurring ? (
                            <>
                                <div>
                                    <label htmlFor="recurring-amount" className="block text-sm font-medium">Amount</label>
                                    <input type="number" id="recurring-amount" name="recurring-amount" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Amount" />
                                </div>
                                <div>
                                    <label htmlFor="recurring-period" className="block text-sm font-medium">Period</label>
                                    <select id="recurring-period" name="recurring-period" className="w-full rounded-md border border-gray-200 px-3 py-2 text-md shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500">
                                        <option className="m-2" value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label htmlFor="one-time-amount" className="block text-sm font-medium">Amount</label>
                                <input type="number" id="one-time-amount" name="one-time-amount" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Amount" />
                            </div>
                        )}
                    </div>

                    {/* Billing Information */}
                    <div className="mt-8 border-t border-b py-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Billing Amount</p>
                            <p className="font-semibold text-gray-900">$120</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Billing Period</p>
                            <p className="font-semibold text-gray-900">1 Year</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-lg font-medium text-gray-900">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">$120</p>
                        </div>
                    </div>

                    <button className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm">Place Order</button>

                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <img src="/upi.svg" alt="UPI" className="h-6" />
                        <img src="/visa.svg" alt="Visa" className="h-8" />
                        <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                        <img src="/google-pay.svg" alt="GooglePay" className="h-10" />
                        <img src="/paytm.svg" alt="Paytm" className="h-4" />
                        <img src="/rupay.svg" alt="Rupay" className="h-4" />
                    </div>

                    <p className="mt-4 text-center italic text-md text-bold text-gray-700 flex items-center justify-center">
                        Powered by <img src="/razorpay.svg" alt="Razorpay" className="h-5 ml-2" />
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DonationCheckout;
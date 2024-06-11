import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Plan } from "@/types/plan_types";
import { SinglePlanResponse } from "@/types/api-types";

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
    const navigate = useNavigate();
    const id = search.get("id");
    const [plan, setPlan] = useState<Plan | null>();
    const [open, setOpen] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>(
        "Waiting for Confirmation"
    );
    const [dialogData, setDialogData] = useState({
        subscriptionStatus: "hold on",
        paymentStatus: "hold on",
    });
    const { user } = useSelector((state: RootState) => state.userReducer);

    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const fetchPlan = async () => {
        try {
            const { data }: { data: SinglePlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/details/${id}`, { withCredentials: true });
            setPlan(data.plan);
        } catch (error: any) {
            // toast.error(error.response.data.message);
            console.log(error);
        }
    }

    useEffect(() => {
        const plansData = window.sessionStorage.getItem("all_plans");
        if (plansData) {
            const currentPlan: Plan[] = JSON.parse(plansData).filter((cPlan: Plan) => cPlan._id === id);
            if (currentPlan.length > 0) {
                setPlan(currentPlan[0]);
            } else {
                fetchPlan();
            }
        } else {
            fetchPlan();
        }
    }, [id]);

    const handlePayment = async (razId: string) => {
        if (!id || plan?._id !== id) {
            toast.error("This is a broken link");
            return;
        }

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new`, { id: razId }, config);
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: data.key,
                currency: "INR",
                name: "VCards App",
                description: "just fine",
                subscription_id: data.subscriptions_id,
                handler: async function (response: any) {
                    setOpen(true);
                    // add try catch here
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
                        // send error message to server
                        setTimeout(() => {
                            setOpen(false);
                        }, 3000);
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
                // send error message to server
                console.log(response.error.description);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
                console.log(response);
                toast.info(response.error.description);
            });
            console.log(razor);
            razor.open();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            {(id && plan?._id === id) ? (
                <div className="">
                    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
                        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col md:flex-row">
                            {/* Left Side */}
                            <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r">
                                {/* User Details */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold mb-4">User Details</h2>
                                    {user ? (
                                        <>
                                            <div>
                                                <label className="block mb-2">Name</label>
                                                <input type="text" value={user?.name} readOnly className="w-full p-2 border rounded" />
                                            </div>
                                            <div className="mt-4">
                                                <label className="block mb-2">Email</label>
                                                <input type="email" value={user?.email} readOnly className="w-full p-2 border rounded" />
                                            </div>
                                        </>
                                    ) : <Link to="/login">Login to Continue</Link>}
                                </div>
                                {/* Plan Details */}

                                {id && plan?._id === id && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-4">Plan Details</h2>
                                        <div className="p-4 bg-gray-50 border rounded-lg shadow-md">
                                            <p className="mb-2"><span className="font-semibold">Plan:</span> {plan?.name}</p>
                                            <p className="mb-2"><span className="font-semibold">Description:</span> {plan?.description}</p>
                                            <p className="mb-2"><span className="font-semibold">Cards:</span> {plan?.cards}</p>
                                            <p className="mb-2"><span className="font-semibold">Price:</span> Rs {plan?.amount}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center items-center gap-4">
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

                            {/* Right Side */}
                            <div className="w-full md:w-1/2 p-8">
                                <h2 className="text-2xl font-semibold mb-4">Billing</h2>
                                <div className="mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Billing Amount:</span>
                                        <span>$120</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Billing Period:</span>
                                        <span>1 Year</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Total Amount:</span>
                                        <span>$120</span>
                                    </div>
                                </div>
                                <button disabled={!user || !id || plan?._id !== id} onClick={() => handlePayment(plan?.razorPlanId!)} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Buy Now</button>
                                <p className="text-gray-500 text-center mt-4">Powered by Razorpay</p>
                                <div className="flex justify-center mt-4 space-x-4">
                                    <img src="./UPI.webp" alt="UPI" className="h-12" />
                                    <img src="./Visa-Mastercard-Rupay.jpg" alt="CARDS" className="h-12" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Broken link</p>
            )}
        </>
    )
};

export default Checkout;

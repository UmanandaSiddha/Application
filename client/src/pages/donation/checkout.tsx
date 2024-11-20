import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { DonatorResponse } from "@/types/api-types";
import { donatorExist } from "@/redux/reducer/donatorReducer";
import { FaCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

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

interface SubscriptionCatpureResponse {
    success: boolean;
    subscriptionStatus: string;
    paymentStatus: string;
}

interface PaymentCatpureResponse {
    success: boolean;
    paymentStatus: string;
}

interface LoadingStateType {
    id: number;
    loading: string;
    data: string;
}

const DonationCheckout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isRecurring, setIsRecurring] = useState(true);
    const { donator } = useSelector((state: RootState) => state.donatorReducer);
    const [loadingStates, setLoadingStates] = useState<LoadingStateType[]>([]);
    const [paymentData, setPaymentData] = useState<{
        amount: number | null;
        period: string;
        currency: string;
    }>({
        amount: null,
        period: 'monthly',
        currency: 'INR'
    });

    const [updateData, setUpdateData] = useState({
        name: donator?.name || "",
        phone: donator?.phone || "",
        pan: donator?.pan || "",
        street: donator?.address?.street || "",
        state: donator?.address?.state || "",
        city: donator?.address?.city || "",
        postalCode: donator?.address?.postalCode || "",
        country: donator?.address?.country || "",
    });

    const location = useLocation();
    const from = location.state?.from?.pathname || "/donation/dashboard";

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, phone, address, pan } = donator || {};
        const { street, state, city, postalCode, country } = address || {};
        const isDataSame =
            name === updateData.name &&
            phone === updateData.phone &&
            street === updateData.street &&
            state === updateData.state &&
            city === updateData.city &&
            postalCode === updateData.postalCode &&
            country === updateData.country && 
            pan === updateData.pan

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
            toast.error(error.response.data.message);
        }
        setUpdateLoading(false);
    }

    const handlePaymentVerification = async (response: string, count: number) => {
        try {
            if (count === 0) {
                setOpen(true);
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 3, loading: "started", data: "Verifying Payment..." }]);
            }
            const { data }: { data: PaymentCatpureResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/verify/pay`, response, { withCredentials: true });
            if (!data) {
                setOpen(false);
                setLoadingStates([]);
                toast.error("Failed to Verify Payment");
                return;
            }
            if (["captured"].includes(data.paymentStatus)) {
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === count ? { ...state, loading: "success", data: "Payment verification success" } : state));
                // toast.success("All set");
                setTimeout(() => {
                    setOpen(false);
                    navigate(from, { replace: true });
                }, 3000);
            } else if (count < 3) {
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 3 + count ? { ...state, loading: "failed", data: "Payment verification failed" } : state));
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 3 + count + 1, loading: "started", data: `Verifying Payment... ${count + 1}` }]);
                setTimeout(async () => {
                    await handlePaymentVerification(response, count + 1);
                }, 3000);
            } else {
                toast.info("If the amount was debited from your account, please don't pay again. We are looking into this matter");
                setLoadingStates([]);
                setTimeout(() => {
                    setOpen(false);
                    navigate(from, { replace: true });
                }, 3000);
            }
        } catch (error: any) {
            setOpen(false);
            setLoadingStates([]);
            toast.error(error.response.data.message);
        }
    }

    const handleSubscriptionVerification = async (response: string, count: number) => {
        try {
            if (count === 0) {
                setOpen(true);
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 4, loading: "started", data: "Verifying Payment..." }]);
            }
            const { data }: { data: SubscriptionCatpureResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/capture`, response, { withCredentials: true });
            if (!data) {
                setOpen(false);
                setLoadingStates([]);
                toast.error("Failed to Verify Payment");
                return;
            }
            if (["active"].includes(data.subscriptionStatus) && ["captured"].includes(data.paymentStatus)) {
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === count ? { ...state, loading: "success", data: "Payment verification success" } : state));
                // toast.success("All set");
                setTimeout(() => {
                    setOpen(false);
                    navigate(from, { replace: true });
                }, 3000);
            } else if (count < 3) {
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 3 + count ? { ...state, loading: "failed", data: "Payment verification failed" } : state));
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 3 + count + 1, loading: "started", data: `Verifying Payment... ${count + 1}` }]);
                setTimeout(async () => {
                    await handleSubscriptionVerification(response, count + 1);
                }, 3000);
            } else {
                toast.info("If the amount was debited from your account, please don't pay again. We are looking into this matter");
                setLoadingStates([]);
                setTimeout(() => {
                    setOpen(false);
                    navigate(from, { replace: true });
                }, 3000);
            }
        } catch (error: any) {
            setOpen(false);
            setLoadingStates([]);
            toast.error(error.response.data.message);
        }
    }

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setOpen(true);
        setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 1, loading: "started", data: "SDK Loading..." }]);

        const { name, phone, address } = donator || {};
        if (!name || !phone || !address) {
            setOpen(false);
            setLoadingStates([]);
            toast.warning("Please update your billing details");
            return;
        }

        const { amount, period, currency } = paymentData;
        if (isRecurring) {
            if (!amount || !period || !currency) {
                setOpen(false);
                setLoadingStates([]);
                toast.warning("All fields are required");
                return;
            }
        } else {
            if (!amount || !currency) {
                setOpen(false);
                setLoadingStates([]);
                toast.warning("All fields are required");
                return;
            }
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            setOpen(false);
            setLoadingStates([]);
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 1 ? { ...state, loading: "success", data: "SDK successfully loaded" } : state));

        try {
            let options;

            if (isRecurring) {
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 2, loading: "started", data: "Creating new plan..." }]);
                const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
                const planData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/plan`, paymentData, config);
                if (!planData) {
                    setOpen(false);
                    setLoadingStates([]);
                    toast.error("Failed to Create Plan");
                    return;
                }
                
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 2 ? { ...state, loading: "success", data: "Plan created successfuly" } : state));
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 3, loading: "started", data: "Creating new subscription..." }]);

                const subData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/subscription`, { id: planData.data.plan.razorPlanId }, config);
                if (!subData) {
                    setOpen(false);
                    setLoadingStates([]);
                    toast.error("Failed to Execute Payment");
                    return;
                }

                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 3 ? { ...state, loading: "success", data: "Subscription created successfuly" } : state));

                options = {
                    key: subData.data.key,
                    currency: "INR",
                    name: "VCards App",
                    description: "just fine",
                    subscription_id: subData.data.subscriptions_id,
                    handler: async function (response: any) {
                        await handleSubscriptionVerification(response, 0);
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
                setLoadingStates(prevLoadingStates => [...prevLoadingStates, { id: 2, loading: "started", data: "Creating new order..." }]);
                const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
                const donationData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/pay`, paymentData, config);
                if (!donationData) {
                    setOpen(false);
                    setLoadingStates([]);
                    toast.error("Failed to Execute Payment");
                    return;
                }
                setLoadingStates(prevLoadingStates => prevLoadingStates.map((state) => state.id === 2 ? { ...state, loading: "success", data: "Order created successfuly" } : state));

                options = {
                    key: donationData.data.key,
                    currency: donationData.data.order.currency,
                    amount: donationData.data.order.amount,
                    name: "VCards App",
                    description: "just fine",
                    order_id: donationData.data.order.id,
                    handler: async function (response: any) {
                        await handlePaymentVerification(response, 0);
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
                setOpen(false);
                setLoadingStates([]);
                toast.info(response.error.description);
            });
            razor.open();
        } catch (error: any) {
            setOpen(false);
            setLoadingStates([]);
            toast.error(error.response.data.message);
        }

        setOpen(false);
        setLoadingStates([]);
    };

    const handleDonationTypeChange = () => {
        setIsRecurring(isRecurring => !isRecurring);
    };

    return (
        <div className="w-[80%] mx-auto mt-6 mb-12">
            <div className="flex justify-center items-center gap-4">
                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex flex-col justify-center items-center z-10">
                        {loadingStates && loadingStates.map(state => (
                            <div className="flex items-center gap-2">
                                {state.loading === "started" ? (
                                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                ) : state.loading === "success" ? (
                                    <FaCheckCircle size={20} className="text-green-500" />
                                ) : (
                                    <RxCrossCircled size={20} className="text-red-500" />
                                )}
                                <p>{state.data}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                {/* User Details Section */}
                <div className="px-4 pt-2">
                    <p className="text-xl font-medium">Donator Details</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                readOnly
                                value={donator?.email}
                                name="email"
                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                placeholder="your.email@example.com"
                            />
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
                                disabled={open || updateLoading}
                                className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm"
                            >
                                {open || updateLoading ? "Hold on..." : "Update Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Donation Details Section */}
                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-xl font-medium">Donation</p>
                        <label htmlFor="toggle" className="flex items-center cursor-pointer">
                            <div className="mr-3 text-gray-700 font-medium">Recurring</div>
                            <div className="relative">
                                <input id="toggle" type="checkbox" className="sr-only toggle-checkbox" onChange={handleDonationTypeChange} />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full toggle-bg"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition toggle-dot"></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">One-Time</div>
                        </label>
                    </div>

                    <form onSubmit={handleCheckout}>
                        <div className="mt-4 space-y-3 rounded-lg px-2 py-4 sm:px-6">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
                                <div className="flex space-x-2 w-full">
                                    <select
                                        value={paymentData.currency}
                                        onChange={(e) => setPaymentData({ ...paymentData, currency: e.target.value })}
                                        name="currency"
                                        className="md:w-[20%] w-[30%] rounded-md border border-gray-200 px-1.5 py-2 text-md shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option className="m-2" value="INR">INR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={paymentData.amount || ''}
                                        onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || null })}
                                        className="md:w-[80%] w-[70%] rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Amount"
                                    />
                                </div>
                            </div>
                            {isRecurring && (
                                <div>
                                    <label htmlFor="period" className="block text-sm font-medium">Period</label>
                                    <select id="period" value={paymentData.period} onChange={(e) => setPaymentData({ ...paymentData, period: e.target.value })} name="period" className="w-full rounded-md border border-gray-200 px-3 py-2 text-md shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500">
                                        <option className="m-2" value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Billing Information */}
                        <div className="mt-8 border-t border-b py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Billing Amount</p>
                                <p className="font-semibold text-gray-900">{paymentData.currency === "INR" ? "₹" : "$"} {paymentData.amount ? paymentData.amount : "00.00"}</p>
                            </div>
                            {isRecurring && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">Billing Period</p>
                                    <p className="font-semibold text-gray-900">{paymentData.period}</p>
                                </div>
                            )}
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-lg font-medium text-gray-900">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900">{paymentData.currency === "INR" ? "₹" : "$"} {paymentData.amount ? paymentData.amount : "00.00"}</p>
                            </div>
                        </div>

                        <button type="submit" className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm">Donate Now</button>
                    </form>

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
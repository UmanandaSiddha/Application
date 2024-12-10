import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DonatorResponse } from "@/types/api-types";
import { donatorExist } from "@/redux/reducer/donatorReducer";
import { Helmet } from "react-helmet-async";

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

interface SubscriptionCaptureResponse {
    success: boolean;
    subscriptionStatus: string;
    paymentStatus: string;
}

interface PaymentCaptureResponse {
    success: boolean;
    paymentStatus: string;
}

const DonationCheckout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isRecurring, setIsRecurring] = useState(true);
    const { donator } = useSelector((state: RootState) => state.donatorReducer);
    const [paymentData, setPaymentData] = useState<{
        amount: number | null;
        period: string;
        currency: string;
    }>({
        amount: null,
        period: 'monthly',
        currency: 'INR'
    });
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [updateData, setUpdateData] = useState({
        name: donator?.name || "",
        phone: donator?.phone || "",
        street: donator?.address?.street || "",
        state: donator?.address?.state || "",
        city: donator?.address?.city || "",
        postalCode: donator?.address?.postalCode || "",
        country: donator?.address?.country || "",
    });
    const [message, setMessage] = useState("");
    const location = useLocation();
    const from = location.state?.from?.pathname || "/donation/dashboard";

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
            country === updateData.country
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
        } finally {
            setUpdateLoading(false);
        }
    }

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, phone, address } = donator || {};
        if (!name || !phone || !address) {
            toast.warning("Please update your billing details");
            return;
        }
        const { amount, period, currency } = paymentData;
        if (isRecurring) {
            if (!amount || !period || !currency) {
                toast.warning("All fields are required");
                return;
            }
        } else {
            if (!amount || !currency) {
                toast.warning("All fields are required");
                return;
            }
        }
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }
        try {
            let options;
            if (isRecurring) {
                const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
                const planData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/plan`, paymentData, config);
                if (!planData) {
                    toast.error("Failed to Create Plan");
                    return;
                }
                const subData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/subscription`, { id: planData.data.plan.razorPlanId }, config);
                if (!subData) {
                    toast.error("Failed to Execute Payment");
                    return;
                }
                options = {
                    key: subData.data.key,
                    currency: "INR",
                    name: "VCards App",
                    description: "just fine",
                    subscription_id: subData.data.subscriptions_id,
                    handler: async function (response: any) {
                        setMessage("Processing Payment");
                        setCheckoutLoading(true);
                        setTimeout(async () => {
                            try {
                                const { data }: { data: SubscriptionCaptureResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/capture`, response, config);
                                if (data.subscriptionStatus === "active" && data.paymentStatus === "captured") {
                                    toast.success("Payment Successful! Subscription Activated.");
                                } else {
                                    toast.info("Payment is being processed. Please wait.");
                                }
                                setMessage("Redirecting");
                                setTimeout(() => {
                                    navigate(from, { replace: true });
                                }, 3000);
                            } catch (error: any) {
                                toast.error("Error verifying payment. Please contact support.");
                            }
                        }, 5000);
                        setCheckoutLoading(false);
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
                const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
                const donationData: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/pay`, paymentData, config);
                if (!donationData) {
                    toast.error("Failed to Execute Payment");
                    return;
                }
                options = {
                    key: donationData.data.key,
                    currency: donationData.data.order.currency,
                    amount: donationData.data.order.amount,
                    name: "VCards App",
                    description: "just fine",
                    order_id: donationData.data.order.id,
                    handler: async function (response: any) {
                        setMessage("Processing Payment");
                        setCheckoutLoading(true);
                        setTimeout(async () => {
                            try {
                                const { data }: { data: PaymentCaptureResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/verify/pay`, response, config);
                                if (data.paymentStatus === "captured") {
                                    toast.success("Payment Successful!");
                                } else {
                                    toast.info("Payment is being processed. Please wait.");
                                }
                                setMessage("Redirecting");
                                setTimeout(() => {
                                    navigate(from, { replace: true });
                                }, 3000);
                            } catch (error: any) {
                                toast.error("Error verifying payment. Please contact support.");
                            }
                        }, 5000);
                        setCheckoutLoading(false);
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
                toast.info(response.error.description);
            });
            razor.open();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
        <Helmet>
                <title>Voolata | Donation Checkout</title>
                <meta name="description" content={`This is the donation checkout page of Voolata`} />
                <meta name="keywords" content="donation, checkout, voolata" />
            </Helmet>
            <div className="w-[80%] mx-auto mt-6 mb-12">
                <div className="flex justify-center items-center gap-4">
                    {checkoutLoading && (
                        <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex flex-col justify-center items-center z-10">
                            <div className="bg-white p-8 rounded-lg shadow-lg h-24 w-[95%] md:w-[70%] lg:w-[50%]">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold text-gray-900">{message}...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
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
                                    disabled={updateLoading}
                                    className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm"
                                >
                                    {updateLoading ? "Hold on..." : "Update Changes"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <p className="text-xl font-medium">Donation</p>
                            <label htmlFor="toggle" className="flex items-center cursor-pointer">
                                <div className="mr-3 text-gray-700 font-medium">Recurring</div>
                                <div className="relative">
                                    <input id="toggle" type="checkbox" className="sr-only toggle-checkbox" onChange={() => setIsRecurring(isRecurring => !isRecurring)} />
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
        </>
    )
}

export default DonationCheckout;
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

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

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [plan, setPlan] = useState<any>({});
    const [open, setOpen] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>(
        "Waiting htmlFor Confirmation"
    );
    const [dialogData, setDialogData] = useState({
        subscriptionStatus: "hold on",
        paymentStatus: "hold on",
    });
    const [isRecurring, setIsRecurring] = useState<boolean>(true);
    const { user } = useSelector((state: RootState) => state.userReducer);
    const [panCard, setPanCard] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    // useEffect(() => {
    //     const fetchPlan = async () => {
    //         try {
    //             const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/details/${id}`, { withCredentials: true });
    //             setPlan(data.plan);
    //         } catch (error: any) {
    //             console.log(error);
    //             toast.error(error.response.data.message);
    //         }
    //     }
    //     fetchPlan();
    // }, [id]);

    const handlePayment = async (id: string) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new`, { id, isRecurring }, config);
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
                    const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/capture`, response, config);
                    console.log(data);
                    console.log(response);
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
                    email: user?.email,
                },
                timeout: 120,
                readonly: {
                    email: user?.email,
                    name: user?.name,
                },
                theme: {
                    color: "#3399cc",
                },
            };
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
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                {/* User Details Section */}
                <div className="px-4 pt-4">
                    <p className="text-xl font-medium">User Details</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <input type="text" id="name" name="name" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input type="email" id="email" name="email" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@example.com" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                            <input type="tel" id="phone" name="phone" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="123-456-7890" />
                        </div>
                        <div>
                            <label htmlFor="pan" className="block text-sm font-medium">PAN Card Number</label>
                            <input type="text" id="pan" name="pan" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="PAN Card Number" />
                        </div>
                        <div>
                            <label htmlFor="billing-address" className="block text-sm font-medium">Billing Address</label>
                            <input type="text" id="billing-address" name="billing-address" className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Street Address" />
                        </div>
                        <div className="flex space-x-4">
                            <input type="text" name="city" className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="City" />
                            <input type="text" name="state" className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="State" />
                        </div>
                        <div className="flex space-x-4">
                            <input type="text" name="zip" className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Postal Code" />
                            <input type="text" name="country" className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500" placeholder="Country" />
                        </div>
                        <button className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm">Update Changes</button>
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
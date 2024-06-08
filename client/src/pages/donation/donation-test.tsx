import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

const currencyEnum = {
    INR: "INR",
    USD: "USD"
}

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

const DonationPage = () => {

    const navigate = useNavigate();

    const [donateData, setDonateData] = useState({
        name: "",
        email: "",
        phone: "",
        amount: "",
        address: "",
        pan: ""
    });
    const [donateLoading, setDonateLoading] = useState<boolean>(false);
    const [currency, setCurrency] = useState(currencyEnum.INR);
    const [open, setOpen] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>("Waiting for Confirmation");
    const [dialogData, setDialogData] = useState<string>("hold on");

    const handlePayment = async () => {
        setDonateLoading(true);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const donationPayload = {
            name: donateData.name,
            email: donateData.email,
            phone: Number(donateData.phone),
            amount: Number(donateData.amount),
            pan: Number(donateData.pan),
            address: donateData.address,
            currency,
        }

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donator/new/pay`, donationPayload, config);
            console.log(data)
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "VCards App",
                description: "donations are here man",
                order_id: data.order.id,
                handler: async function (response: any) {
                    setOpen(true);
                    const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/verify/pay`, response, config);
                    if (data.paymentStatus === "captured") {
                        setDialogHeader("Redirecting to Dashboard...");
                        setDialogData("captured");
                        toast.success("All set");
                        setTimeout(() => {
                            setOpen(false);
                            navigate("/");
                        }, 3000);
                    } else {
                        setDialogHeader("An Error Occured");
                        setDialogData("pending")
                        toast.error("Error hain bhai, tu baith hum dekh lenge");
                        setTimeout(() => {
                            setOpen(false);
                        }, 3000);
                    }
                },
                prefill: {
                    name: data.donator.name,
                    email: data.donator.email,
                    contact: data.donator.contact
                },
                timeout: 120,
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
            setDonateLoading(false);
            razor.open();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            {donateLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    Hold On <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col items-center min-h-screen py-12 bg-gray-50">
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>Donation Page</h1>
                    <p className='text-xl text-gray-600 mb-8'>Your small donation can help many lives</p>
                    <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={donateData.name}
                                    onChange={(e) => setDonateData({ ...donateData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={donateData.email}
                                    onChange={(e) => setDonateData({ ...donateData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    name="phone"
                                    type="number"
                                    value={donateData.phone}
                                    onChange={(e) => setDonateData({ ...donateData, phone: e.target.value })}
                                    placeholder="Enter your phone"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <div className="flex items-center">
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="block w-1/4 px-3 py-2 border border-gray-300 bg-white rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value={currencyEnum.INR}>{currencyEnum.INR}</option>
                                        <option value={currencyEnum.USD}>{currencyEnum.USD}</option>
                                    </select>
                                    <input
                                        name="amount"
                                        type="number"
                                        value={donateData.amount}
                                        onChange={(e) => setDonateData({ ...donateData, amount: e.target.value })}
                                        placeholder="Enter amount"
                                        className="block w-3/4 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    name="address"
                                    type="text"
                                    value={donateData.address}
                                    onChange={(e) => setDonateData({ ...donateData, address: e.target.value })}
                                    placeholder="Enter address"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pan Details</label>
                                <input
                                    name="pan"
                                    type="number"
                                    value={donateData.pan}
                                    onChange={(e) => setDonateData({ ...donateData, pan: e.target.value })}
                                    placeholder="Enter Pan Details"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handlePayment}
                                disabled={donateLoading}
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {donateLoading ? "Please wait..." : "Donate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DonationPage;
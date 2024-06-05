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
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/new/pay`, donationPayload, config);
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
            {donateLoading ? 
            <div>Hold On <Loader2 className="mr-2 h-4 w-4 animate-spin" /></div> 
            : (
                <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
                    <h1 className='text-4xl font-bold'>Donation Page</h1>
                    <p className='text-xl'>Your small donation can help many lives</p>
                    {/* <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle><Loader2 className="mr-2 h-4 w-4 animate-spin" />{dialogHeader}</DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                                <p>Payment Status: {dialogData}</p>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label>Name</label>
                            <input
                                name="name"
                                type="text"
                                value={donateData.name}
                                onChange={(e) => setDonateData({ ...donateData, name: e.target.value })}
                                placeholder="Enter your name"
                                className="w-[350px] gap-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={donateData.email}
                                onChange={(e) => setDonateData({ ...donateData, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-[350px] gap-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Phone</label>
                            <input
                                name="phone"
                                type="number"
                                value={donateData.phone}
                                onChange={(e) => setDonateData({ ...donateData, phone: e.target.value })}
                                placeholder="Enter your phone"
                                className="w-[350px] gap-2"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <label>Amount</label>
                            <div className='flex '>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
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
                                    className="w-[300px] gap-2"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label>Address</label>
                            <input
                                name="address"
                                type="text"
                                value={donateData.address}
                                onChange={(e) => setDonateData({ ...donateData, address: e.target.value })}
                                placeholder="Enter address"
                                className="w-[350px] gap-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Pan Details</label>
                            <input
                                name="pan"
                                type="number"
                                value={donateData.pan}
                                onChange={(e) => setDonateData({ ...donateData, pan: e.target.value })}
                                placeholder="Enter Pan Details"
                                className="w-[350px] gap-2"
                            />
                        </div>
                        <button className="w-[350px]" onClick={handlePayment} disabled={donateLoading}>{donateLoading ? "wait..." : "Pay"}</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default DonationPage;
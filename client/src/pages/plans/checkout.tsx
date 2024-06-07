import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import cardsLogo from '../../../public/Visa-Mastercard-Rupay.jpg'; 
import upiLogo from '../../../public/UPI.webp';

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
    const [plan, setPlan] = useState<any>({});
    const [open, setOpen] = useState<boolean>(false);
    const [dialogHeader, setDialogHeader] = useState<string>(
        "Waiting for Confirmation"
    );
    const [dialogData, setDialogData] = useState({
        subscriptionStatus: "hold on",
        paymentStatus: "hold on",
    });
    const { user } = useSelector((state: RootState) => state.userReducer);

    useEffect(() => {
        const fetcPlan = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/details/${id}`, { withCredentials: true });
                setPlan(data.plan);
            } catch (error: any) {
                console.log(error);
                toast.error(error.response.data.message);
            }
        }
        fetcPlan();
    }, [id]);

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
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new`, { id }, config);
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
                        setDialogHeader("An Error Occured");
                        setDialogData({
                            subscriptionStatus: "pending",
                            paymentStatus: "pending",
                        });
                        toast.error("Error hain bhai, tu baith hum dekh lenge");
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

    return (
        <>
            {(id && plan._id === id) ? (
                <div className="">
                    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r">
          {/* User Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div>
              <label className="block mb-2">Name</label>
              <input type="text" value={user?.name} readOnly className="w-full p-2 border rounded" />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Email</label>
              <input type="email" value={user?.email} readOnly className="w-full p-2 border rounded" />
            </div>
          </div>
          {/* Plan Details */}


          <div>
            <h2 className="text-2xl font-semibold mb-4">Plan Details</h2>
            <div className="p-4 bg-gray-50 border rounded-lg shadow-md">
              <p className="mb-2"><span className="font-semibold">Plan:</span> {plan?.name}</p>
              <p className="mb-2"><span className="font-semibold">Description:</span> {plan?.description}</p>
              <p className="mb-2"><span className="font-semibold">Cards:</span> {plan?.cards}</p>
              <p className="mb-2"><span className="font-semibold">Price:</span> Rs {plan?.amount}</p>
            </div>
        </div>


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
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Buy Now</button>
          <p className="text-gray-500 text-center mt-4">Powered by Razorpay</p>
          <div className="flex justify-center mt-4 space-x-4">
            <img src={upiLogo} alt="UPI" className="h-12" />
            <img src={cardsLogo} alt="CARDS" className="h-12" />
            {/* <img src={mastercardLogo} alt="MasterCard" className="h-8" /> */}
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

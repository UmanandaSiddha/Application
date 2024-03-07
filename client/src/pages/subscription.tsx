import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from "../redux/store";

function loadScript(src: any) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    });
}

const Subscription = () => {

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handlePayment = async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
            const { data }: { data: any } = await axios.get(`${import.meta.env.VITE_BASE_URL}/pay/sub`, config);
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: data.key,
                amount: 100,
                currency: "INR",
                name: "VCards App",
                description: "just fine",
                subscription_id: data.subscriptions_id,
                handler: async function (response: any) {
                    console.log(response.razorpay_payment_id),
					console.log(response.razorpay_subscription_id),
					console.log(response.razorpay_signature);
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
                    "color": "#3399cc"
                }
            }
            const razor = new (window as any).Razorpay(options);
            razor.on("payment.failed", function (response: any) {
                console.log(response.error.code);
                console.log(response.error.description);
                console.log(response.error.source);
                console.log(response.error.step);
                console.log(response.error.reason);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
                toast.info(response.error.description);
            });
            razor.open();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            Subscription
            <button onClick={handlePayment}>BUY</button>
        </div>
    )
}

export default Subscription;
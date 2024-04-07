import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from "../../redux/store";
import { useEffect, useState } from 'react';

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

    const [plans, setPlans] = useState<any>([]);

    useEffect(() => {
        const getPlans = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/all`, { withCredentials: true });
                setPlans(data.plans);
            } catch (error) {
                console.log(error);
            }
        }
        getPlans();
    }, []);

    const handlePayment = async (id: string) => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new`, { id },config);
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
        <div className='flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-semibold'>Subscription</h1>
            {plans.map((plan: any, index: number) => (
                <div className='border-2 border-black p-2 rounded-md space-y-4' key={index}>
                    <p>Plan ID: {plan?.razorPlanId}</p>
                    <p>Plan Name: {plan?.name}</p>
                    <p>Price: {plan?.amount}</p>
                    <p>Period: {plan?.period}</p>
                    <p>Interval: {plan?.interval}</p>
                    <p>Vcards Allowed: {plan?.cards}</p>
                    <p>Description: {plan?.description}</p>
                    <button className='bg-green-600 w-full rounded-lg text-white' onClick={() => handlePayment(plan?.razorPlanId)}>BUY</button>
                </div>
            ))}
        </div>
    )
}

export default Subscription;
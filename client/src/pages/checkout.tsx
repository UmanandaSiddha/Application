import { Button } from '@/components/ui/button';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51J8sXESGhBJ7KgqpF4kn84ivFdh2ncDMKBxtLWqssyo2cz9vdx8ivzozmM3Tqa1KyUmnASya2jyoGCpZps29fHyC00G7ZNY4wT');

const CheckoutForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { paymentIntent, error } = await stripe.confirmPayment({ 
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required"
        });

        if (error) {
            setIsProcessing(false)
            return console.log(error);
        }

        if (paymentIntent.status === "succeeded") {
            console.log("placing order")
            navigate("/dashboard")
        }
        setIsProcessing(false);
    }

    return (
        <div className=''>
            <form className='flex flex-col justify-center items-center space-y-4' onSubmit={handleSubmit}>
                <PaymentElement />
                {elements && (
                    <Button className='max-w-[300px] w-full bg-green-600 hover:bg-green-700' disabled={isProcessing} type='submit'>{isProcessing ? "Processing..." : "Pay"}</Button>
                )}
            </form>
        </div>
    )
}

const Checkout = () => {

    const location = useLocation();
    const clientSecret: string | undefined = location.state;

    if (!clientSecret) return <Navigate to={"/plans"} />

    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}

export default Checkout;
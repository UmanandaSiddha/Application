import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { togglePaid } from "@/redux/reducer/userReducer";
import { RootState } from "../../redux/store";
import { checkoutPayments } from "@/redux/api/paymentApi";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function PlansCard({ plan } : any) {

    const dispatch = useDispatch();
    const navigate =  useNavigate();

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handlePayment = async () => {
        try {
            const data = await checkoutPayments({ amount: plan.price });
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Shivaji",
                description: "just fine",
                order_id: data.order.id,
                // callback_url: `${import.meta.env.VITE_BASE_URL}/pay/verify/${data.razInfo.validity}/${data.razInfo.amount}/${data.razInfo.planName}`,
                // callback_url: `${import.meta.env.VITE_BASE_URL}/pay/verify`,
                handler: async function (response: any){
                    const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/pay/verify`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        amount: plan.price,
                        planName: plan.name,
                        validity: plan.validity
                    }, {withCredentials: true});
                    console.log(data);
                    dispatch(togglePaid(data.user));
                    toast.success("Payment Successful");
                    navigate("/")
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: "9000090000"
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#3399cc"
                }
            }
            const razor = new (window as any).Razorpay(options);
            razor.open();
            // dispatch(togglePaid(data.user));
            // toast.success("Payment Successful");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleStripePayment = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/stripe/new`, { amount: plan.price }, { withCredentials: true });
            navigate("/pay", {
                state: data.clientSecret
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card className="w-[300px]">
            <CardHeader className="items-center">
                <CardTitle>{isPaid? plan.planName : plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-4">
                    <p>Plan Validity: {isPaid? plan.planValidity : plan.validity} minutes</p>
                    <p>Plan Price: {isPaid? plan.planPrice : plan.price}</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
                <p>Gateway Testing Under Work</p>
                <Button onClick={handlePayment} className="w-full" disabled={isPaid}>Buy Plan</Button>
                <Button onClick={handleStripePayment} className="w-full" disabled={isPaid}>Stripe</Button>
            </CardFooter>
        </Card>
    )
}

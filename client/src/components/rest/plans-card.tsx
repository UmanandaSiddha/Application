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

export function PlansCard({ plan } : any) {

    const dispatch = useDispatch();

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handlePayment = async () => {
        try {
            const paymentInfo = {
                amount: plan.price,
                planName: plan.name,
                validity: plan.validity
            }
            const data = await checkoutPayments(paymentInfo);
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: "rzp_test_XEchPNMaUE5wVC",
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Shivaji",
                description: "just fine",
                order_id: data.order.id,
                callback_url: `https://api.umanandasiddha.site/api/v1/pay/verify/${data.razInfo.validity}/${data.razInfo.amount}/${data.razInfo.planName}`,
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
            dispatch(togglePaid(data.user));
            toast.success("Payment Successful");
        } catch (error: any) {
            toast.error(error.response.data.message);
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
            <CardFooter>
                <Button onClick={handlePayment} className="w-full" disabled={isPaid}>Buy Plan</Button>
            </CardFooter>
        </Card>
    )
}

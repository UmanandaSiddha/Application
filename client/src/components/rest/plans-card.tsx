import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { checkoutPayments } from "@/redux/api/paymentApi";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export function PlansCard({ plan, value, onChange }: any) {

    const navigate = useNavigate();

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handlePayment = async () => {
        try {
            const checkoutData = {
                amount: plan.price,
                planName: plan.name,
                validity: plan.validity
            }
            const data = await checkoutPayments(checkoutData);
            if (!data) {
                toast.error("Failed to Execute Payment");
            }
            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "VCards App",
                description: "just fine",
                // image: "",
                order_id: data.order.id,
                handler: async function (response: any) {
                    navigate("/dashboard");
                    toast.success(`Payment Successful with Payment Id ${response.razorpay_payment_id}`);
                },
                prefill: {
                    email: user?.email,
                },
                // customer_id: "data.customer_id",
                // remember_customer: true,
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

    // const handleStripePayment = async () => {
    //     try {
    //         const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/stripe/new`, { amount: plan.price }, { withCredentials: true });
    //         navigate("/pay", {
    //             state: data.clientSecret
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <Card className="w-[300px]">
            <CardHeader className="items-center">
                <CardTitle>{isPaid ? plan.planName : plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-4">
                    <p>Plan Validity: {isPaid ? plan.planValidity : plan.validity} days</p>
                    <p>Plan Price: {isPaid ? plan.planPrice : plan.price}</p>
                </div>

                {isPaid && (
                    <div>
                        <p>Started on: {String(new Date(user?.currentPlan.startDate).toLocaleString())}</p>
                        <p className="text-red-500">Expires on: {String(new Date(user?.currentPlan.endDate).toLocaleString())}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
                <Button onClick={handlePayment} className="w-full" disabled={isPaid}>Buy Plan</Button>
                {/* <Button onClick={handleStripePayment} className="w-full" disabled={isPaid}>Stripe</Button> */}
            </CardFooter>
        </Card>
    )
}

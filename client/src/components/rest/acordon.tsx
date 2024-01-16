import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function AccordionDemo() {

    const { payments } = useSelector(
        (state: RootState) => state.paymentReducer
    );

    return (
        <Accordion type="single" collapsible className="w-full">
            {payments.map((payment, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{String(new Date(payment.paymentDate).toLocaleString())}</AccordionTrigger>
                    <AccordionContent>
                        <p><span className="font-semibold">Id:</span> {payment._id}</p>
                        <p><span className="font-semibold">Amount:</span> {payment.amount}</p>
                        <p><span className="font-semibold">Plan:</span> {payment.plan}</p>
                        <p><span className="font-semibold">RazorpayOrderId:</span> {payment.razorpayOrderId}</p>
                        <p><span className="font-semibold">RazorpayPaymentId:</span> {payment.razorpayPaymentId}</p>
                        <p><span className="font-semibold">RazorpaySignature:</span> {payment.razorpaySignature}</p>
                    </AccordionContent>
                </AccordionItem>
            )).reverse()}
        </Accordion>
    )
}

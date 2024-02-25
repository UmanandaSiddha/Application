import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import QrCode from "qrcode";
import { useEffect, useState } from "react";
import { Personal } from "@/types/types";

interface PropsType {
    personal: Personal | null;
    isPaid: boolean;
}

const PersonalCard = ({ personal, isPaid }: PropsType) => {

    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/personal?personalId=${personal?._id!}`;
                const qre = await QrCode.toDataURL(link, {width: 200, margin: 2})
                setQr(qre)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        generateCode();
    }, []);

    return (
        <Card onClick={() => navigate(`/dashboard/personal/view?personalId=${personal?._id}`)} className="w-[300px] flex flex-col justify-center items-center">
            <CardHeader className="text-center">
                <CardTitle>{personal?.name}</CardTitle>
                <CardDescription>{personal?.aboutMe.aboutme}</CardDescription>
            </CardHeader>
            <CardContent>
                {isPaid ? (
                    <img src={qr} alt={personal?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </CardContent>
        </Card>
    )
}

export default PersonalCard;
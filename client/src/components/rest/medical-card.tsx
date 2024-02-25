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
import { MedicalType } from "@/types/types";

interface PropsType {
    medical: MedicalType | null;
    isPaid: boolean;
}

const MedicalCard = ({ medical, isPaid }: PropsType) => {

    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/medical?medicalId=${medical?._id!}`;
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
        <Card onClick={() => navigate(`/dashboard/medical/view?medicalId=${medical?._id}`)} className="w-[300px] flex flex-col justify-center items-center">
            <CardHeader className="text-center">
                <CardTitle>{medical?.personalInfo.name}</CardTitle>
                <CardDescription>{medical?.personalInfo.gender}</CardDescription>
            </CardHeader>
            <CardContent>
                {isPaid ? (
                    <img src={qr} alt={medical?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </CardContent>
        </Card>
    )
}

export default MedicalCard;
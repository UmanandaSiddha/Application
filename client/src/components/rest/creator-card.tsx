import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import QrCode from "qrcode";
import { useEffect, useState } from "react";
import { Creator } from "@/types/types";

interface PropsType {
    creator: Creator | null;
    isPaid: boolean;
}

const CreatorCard = ({ creator, isPaid }: PropsType) => {

    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/creator?creatorId=${creator?._id!}`;
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
        <Card onClick={() => navigate(`/dashboard/creator/view?creatorId=${creator?._id}`)} className="w-[300px] flex flex-col justify-center items-center">
            <CardHeader className="text-center">
                <CardTitle>{creator?.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {isPaid ? (
                    <img src={qr} alt={creator?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </CardContent>
        </Card>
    )
}

export default CreatorCard;
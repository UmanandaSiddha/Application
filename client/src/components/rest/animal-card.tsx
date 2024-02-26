import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Animal } from "../../types/types";
import { useNavigate } from "react-router-dom";
import QrCode from "qrcode";
import { useEffect, useState } from "react";

interface PropsType {
    animal: Animal | null;
    isPaid: boolean;
}

export function AnimalCard({ animal, isPaid }: PropsType) {

    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/animal?animalId=${animal?._id!}`;
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
        <Card onClick={() => navigate(`/dashboard/animal/view?animalId=${animal?._id}`)} className="w-[300px] flex flex-col justify-center items-center">
            <CardHeader className="text-center">
                <CardTitle>{animal?.species}</CardTitle>
                <CardDescription>{animal?.gender}</CardDescription>
            </CardHeader>
            <CardContent>
                {isPaid ? (
                    <img src={qr} alt={animal?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </CardContent>
        </Card>
    )
}

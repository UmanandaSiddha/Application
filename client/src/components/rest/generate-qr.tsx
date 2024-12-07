import { createQRCode } from "@/lib/helper";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const GenerateQRCode = ({ type, card, way }: {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
    way?: string;
}) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
        const qrCode = createQRCode(type, card.shortCode);

        qrCode.getRawData("png").then((data) => {
            if (data) {
                const dataUrl = URL.createObjectURL(new Blob([data], { type: "image/png" }));
                setQrCodeDataUrl(dataUrl);
            }
        });
    }, [type, card]);

    if (way && way === "qr-group") {
        return (
            <div className="h-full w-full">
                <div className="bg-white rounded-xl">
                    {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt={card._id} className="rounded-lg object-cover" />
                    ) : (
                        <Loader2 className="text-center animate-spin" />
                    )}
                </div>
                <div className="flex items-center justify-center mt-3 text-lg text-black font-medium">
                    {card.name}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center p-4 rounded-xl bg-white shadow-lg border gap-2">
            {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt={card.name} className="h-40 w-40 rounded-lg" />
            ) : (
                <Loader2 className="text-center animate-spin" />
            )}
            <p>{card.name}</p>
        </div>
    );
};
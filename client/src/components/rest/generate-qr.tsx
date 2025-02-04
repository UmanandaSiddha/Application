import { createQRCode } from "@/lib/helper";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const GenerateQRCode = ({ type, card, way, switchTab, styles }: {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
    way?: string;
    switchTab: boolean;
    styles?: any
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
            switchTab ?
                <div className={`flex flex-col justify-evenly mx-auto items-center h-[400px] sm:h-[450px] sm:w-72 rounded-xl space-x-6 px-4 ${styles} bg-cover bg-center`}>
                    <div className="sm:gap-10 gap-5 mx-auto flex justify-center pt-2 pb-12">
                        <img src="/voolata_long_r.png" alt="" className="w-24" />
                        <p className="text-white text-base font-medium">{type && type.charAt(0).toUpperCase() + type.slice(1)} Card</p>
                    </div>
                    <div className="flex justify-center items-center bg-white rounded-xl w-40 mb-10">
                        {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt={card._id} className="rounded-lg object-cover" />
                        ) : (
                            <Loader2 className="text-center animate-spin" />
                        )}
                    </div>
                    <div className="flex flex-col items-center text-white justify-center mt-3 text-lg font-medium">
                        <p>{card.name}</p>
                        <p>Doctor</p>
                        <p>ID gdghdg</p>
                    </div>
                </div>
                :
                <div className="h-full w-full flex flex-col">
                    <div className="bg-white rounded-xl ">
                        {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt={card._id} className="rounded-lg object-cover" />
                        ) : (
                            <Loader2 className="text-center animate-spin" />
                        )}
                    </div>
                    <div className="flex flex-col items-center text-white justify-center mt-3 text-lg font-medium">
                        <p>{card.name}</p>
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
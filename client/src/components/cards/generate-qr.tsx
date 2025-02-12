import { createQRCode } from '@/lib/helper';
import { Animal, Creator, MedicalType, Personal, Tree } from '@/types/card_types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropTypes {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
}

const GenerateQRCode = ({ type, card }: PropTypes) => {

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

    if (!qrCodeDataUrl) {
        return <Loader2 className="text-center animate-spin" />
    }

    return (
        <img
            src={qrCodeDataUrl}
            alt={card.name}
            className="rounded-lg object-cover"
        />
    )
}

export default GenerateQRCode
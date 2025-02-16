import { createQRCode } from '@/lib/helper';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropTypes {
    type: string;
    shortCode: string;
}

const GenerateQRCode = ({ shortCode, type }: PropTypes) => {

    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
        const qrCode = createQRCode(type, shortCode);

        qrCode.getRawData("png").then((data) => {
            if (data) {
                const dataUrl = URL.createObjectURL(new Blob([data], { type: "image/png" }));
                setQrCodeDataUrl(dataUrl);
                console.log(dataUrl);
            }
        });
    }, [type, shortCode]);

    if (!qrCodeDataUrl) {
        return <Loader2 className="text-center animate-spin" />
    }

    return (
        <img
            src={qrCodeDataUrl}
            alt={shortCode}
            className="rounded-lg object-cover"
        />
    )
}

export default GenerateQRCode
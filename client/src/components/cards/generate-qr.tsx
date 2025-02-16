import { createQRCode } from '@/lib/helper';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropTypes {
    type: string;
    shortCode: string;
}

const GenerateQRCode = ({ shortCode, type }: PropTypes) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const qrCode = createQRCode(type, shortCode);

        qrCode.getRawData("png").then(async (data) => {
            if (data) {
                const base64Data = await blobToBase64(new Blob([data], { type: "image/png" }));
                setQrCodeDataUrl(base64Data);
            }
        });
    }, [type, shortCode]);

    // Helper function to convert Blob to Base64
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        qrCodeDataUrl ? (
            <img
                src={qrCodeDataUrl}
                alt={shortCode}
                className="rounded-lg object-cover"
                onLoad={() => setIsLoaded(true)} // Ensure the image is fully loaded before capturing
            />
        ) : (
            <Loader2 className="text-center animate-spin" />
        )
    );
};

export default GenerateQRCode;

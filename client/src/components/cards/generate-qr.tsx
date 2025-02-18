import { createQRCode } from '@/lib/helper';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { openDB } from "idb";

interface PropTypes {
    type: string;
    shortCode: string;
}

const GenerateQRCode = ({ shortCode, type }: PropTypes) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
        const storageKey = `qrCodeDataUrl_${type}_${shortCode}`;

        const getQrFromDB = async () => {
            const db = await openDB("QRCodeDB", 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains("qrCodes")) {
                        db.createObjectStore("qrCodes");
                    }
                },
            });

            const storedQr = await db.get("qrCodes", storageKey);
            if (storedQr) {
                setQrCodeDataUrl(storedQr);
                return;
            }

            try {
                const qrCode = createQRCode(type, shortCode);
                const data = await qrCode.getRawData("png");

                if (data) {
                    const base64Data = await blobToBase64(new Blob([data], { type: "image/png" }));
                    setQrCodeDataUrl(base64Data);
                    await db.put("qrCodes", base64Data, storageKey);
                }
            } catch (error) {
                console.error("QR Code Generation Error:", error);
            }
        };

        getQrFromDB();
    }, [type, shortCode]);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return qrCodeDataUrl ? (
        <img src={qrCodeDataUrl} alt={shortCode} className="rounded-lg object-cover" />
    ) : (
        <Loader2 className="text-center animate-spin" />
    );
};

export default GenerateQRCode;
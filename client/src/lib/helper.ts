import QRCodeStyling from 'qr-code-styling';
import * as icons from 'simple-icons';

export const generateDefaultValues = (arrays: { name: string }[][]) => {
    return arrays.reduce((acc, array) => {
        array.forEach(field => {
            acc[field.name] = "";
        });
        return acc;
    }, {} as Record<string, string>);
};

export const generateSimpleDefaultValues = (fields: { name: string }[]) => {
    return fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {} as Record<string, string>);
};

export const convertToStrings = (data: any) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
        return acc;
    }, {} as Record<string, string>);
};

export const setSvg = (input: string) => {
    const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
    const icon = icons[platformKey as keyof typeof icons];
    if (icon) {
        return icon.path;
    } else {
        return "";
    }
}

export const qrStyles: Record<string, { qrColor: string; dotColor: string }> = {
    botanical: { qrColor: "#4ade80", dotColor: "#22c55e" },
    individual: { qrColor: "#60a5fa", dotColor: "#3b82f6" },
    medical: { qrColor: "#818cf8", dotColor: "#6366f1" },
    creator: { qrColor: "#22d3ee", dotColor: "#06b6d4" },
    animal: { qrColor: "#f87171", dotColor: "#ef4444" },
    default: { qrColor: "#9ca3af", dotColor: "#6b7280" },
};

export const createQRCode = (type: string, cardId: string) => {
    const styles = type && qrStyles[type] ? qrStyles[type] : qrStyles.default;
    let baseUrl;
    if (import.meta.env.VITE_ENV === "development") {
        baseUrl = "http://localhost:5173";
    } else {
        baseUrl = `https//voolata.com`;
    }
    return new QRCodeStyling({
        width: 1000,
        height: 1000,
        margin: 50,
        data: `${window.location.protocol}//${window.location.host}/d/${cardId}`,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "H",
        },
        image: `${baseUrl}/${type}.png`,
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 20,
        },
        dotsOptions: {
            type: "extra-rounded",
            color: styles.qrColor,
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: styles.dotColor,
        },
        cornersDotOptions: {
            color: styles.qrColor,
        },
    });
};

export const typeStyles: Record<string, { backgroundColor: string, textColor: string, mdBackgroundColor: string, iconColor: string }> = {
    botanical: { backgroundColor: "bg-green-200", textColor: "bg-green-500", mdBackgroundColor: "md:bg-green-500", iconColor: "text-green-500" },
    individual: { backgroundColor: "bg-blue-200", textColor: "bg-blue-500", mdBackgroundColor: "md:bg-blue-500", iconColor: "text-blue-500" },
    animal: { backgroundColor: "bg-red-200", textColor: "bg-red-500", mdBackgroundColor: "md:bg-red-500", iconColor: "text-red-500" },
    creator: { backgroundColor: "bg-cyan-200", textColor: "bg-cyan-500", mdBackgroundColor: "md:bg-cyan-500", iconColor: "text-cyan-500" },
    medical: { backgroundColor: "bg-indigo-200", textColor: "bg-indigo-500", mdBackgroundColor: "md:bg-indigo-500", iconColor: "text-indigo-500" },
    default: { backgroundColor: "bg-gray-200", textColor: "bg-gray-500", mdBackgroundColor: "md:bg-gray-500", iconColor: "text-gray-500" }
};
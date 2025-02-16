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
        return (icon as any).path as string;
    } else {
        return "";
    }
}

export const qrStyles: Record<string, { qrColor: string; dotColor: string; bgColor: string; textColor: string }> = {
    botanical: { qrColor: "#4ade80", dotColor: "#22c55e", bgColor: "bg-[#22c55e]", textColor: "text-[#22c55e]" },
    individual: { qrColor: "#60a5fa", dotColor: "#3b82f6", bgColor: "bg-[#3b82f6]", textColor: "text-[#3b82f6]" },
    medical: { qrColor: "#818cf8", dotColor: "#6366f1", bgColor: "bg-[#6366f1]", textColor: "text-[#6366f1]" },
    creator: { qrColor: "#22d3ee", dotColor: "#06b6d4", bgColor: "bg-[#06b6d4]", textColor: "text-[#06b6d4]" },
    animal: { qrColor: "#f87171", dotColor: "#ef4444", bgColor: "bg-[#ef4444]", textColor: "text-[#ef4444]" },
    default: { qrColor: "#9ca3af", dotColor: "#6b7280", bgColor: "bg-[#6b7280]", textColor: "text-[#6b7280]" },
};

export const createQRCode = (type: string, cardId: string) => {
    type = type.toLowerCase();
    const styles = type && qrStyles[type] ? qrStyles[type] : qrStyles.default;
    let baseUrl = `${window.location.protocol}//${window.location.host}`;
    if (!baseUrl) {
        if (import.meta.env.VITE_ENV === "development") {
            baseUrl = "http://localhost:5173";
        } else {
            baseUrl = `https://voolata.com`;
        }
    }
    return new QRCodeStyling({
        width: 2000,
        height: 2000,
        margin: 20,
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

export const typeStyles: Record<string, { backgroundColor: string, textColor: string, mdBackgroundColor: string, iconColor: string, cardBg: string }> = {
    botanical: { backgroundColor: "bg-[#4BA197]", textColor: "bg-green-500", mdBackgroundColor: "md:bg-green-500", iconColor: "text-green-500",cardBg:"bg-[url('/botany_card.png')]"},
    individual: { backgroundColor: "bg-[rgb(19,94,242,0.44)]", textColor: "bg-blue-500", mdBackgroundColor: "md:bg-blue-500", iconColor: "text-blue-500" ,cardBg:"bg-[url('/individual_card.png')]"},
    animal: { backgroundColor: "bg-[#E5ACAD]", textColor: "bg-red-500", mdBackgroundColor: "md:bg-red-500", iconColor: "text-red-500",cardBg:"bg-[url('/animal_card.png')]" },
    creator: { backgroundColor: "bg-[#66B1DF]", textColor: "bg-cyan-500", mdBackgroundColor: "md:bg-cyan-500", iconColor: "text-cyan-500" ,cardBg:"bg-[url('/creator_card.png')]"},
    medical: { backgroundColor: "bg-[#92C6BD]", textColor: "bg-indigo-500", mdBackgroundColor: "md:bg-indigo-500", iconColor: "text-indigo-500",cardBg:"bg-[url('/medical_card.png')]" },
    default: { backgroundColor: "bg-gray-200", textColor: "bg-gray-500", mdBackgroundColor: "md:bg-gray-500", iconColor: "text-gray-500",cardBg:"bg-[url('/individual_card.png')]" }
};
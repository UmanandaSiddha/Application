import GenerateQRCode from "./generate-qr";

interface PropTypes {
    type: string;
    shortCode: string;
}

const QRCode = ({ shortCode, type }: PropTypes) => {
    return (
        <div className="flex flex-col justify-center items-center p-2 rounded-xl bg-white shadow-lg border gap-2">
            <GenerateQRCode shortCode={shortCode} type={type} />
        </div>
    )
}

export default QRCode;
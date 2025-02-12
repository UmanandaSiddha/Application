import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import GenerateQRCode from "./generate-qr";

interface PropTypes {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
}

const QRCode = ({ card, type }: PropTypes) => {
    return (
        <div className="flex flex-col justify-center items-center p-2 rounded-xl bg-white shadow-lg border gap-2">
            <GenerateQRCode card={card} type={type} />
        </div>
    )
}

export default QRCode;
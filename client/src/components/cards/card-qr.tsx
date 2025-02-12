import { CardBase, CardBottom } from "@/constants/cards/id-card";
import GenerateQRCode from "./generate-qr";
import { forwardRef } from "react";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";

interface PropTypes {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
}

const CardQR = forwardRef<HTMLDivElement, PropTypes>(({ card, type }, ref) => {
    return (
        <div ref={ref} className="relative h-[329.66px] w-[208px] rounded-lg bg-gray-400">
            <img src={CardBase} alt="Top Background" className="absolute top-0 left-0 w-full" />
            <img src={CardBottom} alt="Bottom Background" className="absolute bottom-0 left-0 w-full" />
            <div className="flex flex-col justify-center items-center mt-2">
                <div className="flex flex-row justify-between items-center gap-12 z-10">
                    <img src="/voolata_long_r.png" alt="Voolata Logo" className="h-4 w-auto" />
                    <p className="text-white text-xs">Individual Card</p>
                </div>
                <div className="mt-8 bg-white p-1 rounded-md h-32 w-32 z-10">
                    <GenerateQRCode card={card} type={type} />
                </div>
                <div className="text-center mt-12 text-white relative z-10">
                    <p className="text-lg font-bold">LOUIS STORM</p>
                    <p className="text-sm">Doctor</p>
                    <p className="text-sm">ID- 1234567890</p>
                </div>
            </div>
        </div>
    )
});

export default CardQR;
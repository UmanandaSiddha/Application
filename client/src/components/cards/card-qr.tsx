import { CardBase, CardBottom } from "@/constants/cards/id-card";
import GenerateQRCode from "./generate-qr";
import { forwardRef } from "react";
import Backdrop from "@/components/cards/backdrop";

interface PropTypes {
    type: string;
    shortCode: string;
}

const CardQR = forwardRef<HTMLDivElement, PropTypes>(({ shortCode, type }, ref) => {

    return (
        <div>
            <Backdrop />
            <div id="cardDiv" ref={ref} className="relative h-[340px] w-[220px] bg-gray-400 overflow-hidden">
                <img src="/card_base_test.png" alt="" className="absolute w-full" />
                <div className="flex flex-col justify-center items-center mt-2 px-1">
                    <div className="flex flex-row justify-center items-center gap-12 z-10 ">
                        <div className="flex flex-col justify-center gap-[3px] ">
                            <img src="/voolata_long_r.png" alt="Voolata Logo" className="h-4 w-auto" />
                            <h1 className="text-[6px] font-medium">An Evol foundation product</h1>
                        </div>
                        <p className="text-white text-xs">Individual Card</p>
                    </div>
                    <div className="mt-8 bg-white p-1 rounded-md h-32 w-32 z-10">
                        <GenerateQRCode shortCode={shortCode} type={type} />
                    </div>
                    <div className="text-center mt-12 text-white relative z-10">
                        <p className="text-lg font-bold">LOUIS STORM</p>
                        <p className="text-sm">Doctor</p>
                        <p className="text-sm">ID- 1234567890</p>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default CardQR;
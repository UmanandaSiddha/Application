import GenerateQRCode from "./generate-qr";
import { forwardRef } from "react";
import Backdrop from "@/components/cards/backdrop";

interface PropTypes {
    type: string;
    shortCode: string;
    name: string;
}

const CardQR = forwardRef<HTMLDivElement, PropTypes>(({ shortCode, type, name }, ref) => {
    return (
        <div>
            <Backdrop />
            <div id="cardDiv" ref={ref} className="relative h-[340px] w-[220px] bg-gray-400 overflow-hidden">
                <img src="/card_base_test.png" alt="" className="absolute w-full" />
                <div className="flex flex-col justify-center items-center mt-2 px-1">
                    <div className="flex flex-row justify-center items-center gap-12 z-10 ">
                        <div className="flex flex-col justify-center gap-[3px] ">
                            <img src="/voolata_long_r.png" alt="Voolata Logo" className="h-4 w-auto" />
                            <h1 className="text-[5px] font-medium">An Initiative Evool Foundation</h1>
                        </div>
                        <p className={`text-xs capitalize text-[#135EF2]`}>{type.toLowerCase()} Card</p>
                    </div>
                    <div className="mt-8 bg-white p-1 rounded-md h-32 w-32 z-10">
                        <GenerateQRCode shortCode={shortCode} type={type} />
                    </div>
                    <div className="text-center mt-12 text-white relative z-10">
                        <p className="text-lg font-bold">{name.toUpperCase()}</p>
                        {/* <p className="text-sm">Doctor</p> */}
                        <p className="text-sm">ID - {shortCode}</p>
                    </div>
                </div>
            </div>
        </div>
    )
});

export default CardQR;
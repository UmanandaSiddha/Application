import { qrStyles } from "@/lib/helper";
import { CardCategory } from "@/pages/card/dashboard";
import { BsQrCodeScan } from "react-icons/bs";

interface PropTypes {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    placeholder: string;
    type: CardCategory;
}

const CardHeaderSwitchButton = ({ isActive, setIsActive, placeholder, type }: PropTypes) => {
    const styles = type && qrStyles[type.toLowerCase()] ? qrStyles[type.toLowerCase()] : qrStyles.default;
    return (
        <button
            onClick={() => setIsActive(true)}
            className='w-72 md:w-auto flex flex-col items-center justify-center pt-4 space-y-3'
        >
            <div
                className={`flex truncate flex-row justify-center items-center rounded-2xl gap-2 py-3 px-4 font-semibold ${
                    isActive
                        ? `${styles.bgColor} text-white`
                        : `${styles.textColor}`
                }`}
            >
                <BsQrCodeScan size={24} />
                <p className='text-lg font-bold'>{placeholder} QR</p>
            </div>
        </button>
    )
}

export default CardHeaderSwitchButton;
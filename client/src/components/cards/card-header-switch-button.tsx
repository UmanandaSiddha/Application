import { BsQrCodeScan } from "react-icons/bs";

interface PropTypes {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    placeholder: string;
}

const CardHeaderSwitchButton = ({ isActive, setIsActive, placeholder }: PropTypes) => {
    return (
        <button
            onClick={() => setIsActive(true)}
            className='w-72 md:w-auto flex flex-col items-center justify-center pt-4 space-y-3'
        >
            <div
                className={`flex truncate flex-row justify-center items-center rounded-2xl gap-2 py-3 px-4 font-semibold ${
                    isActive
                        ? `bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] text-white`
                        : `text-[#135EF2]`
                }`}
            >
                <BsQrCodeScan size={24} />
                <p className='text-lg font-bold'>{placeholder} QR</p>
            </div>
        </button>
    )
}

export default CardHeaderSwitchButton;
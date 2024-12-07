import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "react-toastify";

interface OtpInputProps {
    length?: number;
    onOtpSubmit?: (otp: string) => void;
    disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 4, onOtpSubmit = () => { }, disabled = true }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleClick = (index: number) => {
        // inputRefs.current[index]?.setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]) {
            const emptyIndex = otp.indexOf("");
            if (emptyIndex !== -1) {
                inputRefs.current[emptyIndex]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        const combinedOtp = otp.join("");
        if (combinedOtp.length === length) onOtpSubmit(combinedOtp)
        else toast.warning("Complete OTP");
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                {otp.map((value, index) => (
                    <input
                        key={index}
                        type="number"
                        ref={(input) => (inputRefs.current[index] = input)}
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={disabled}
                        className="w-8 h-8 border border-purple-500 rounded-md text-center text-sm lg:w-10 lg:h-10 lg:text-lg"
                    />
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={disabled}
                className="flex items-center justify-center gap-2 mt-2 text-white tracking-wide text-md lg:text-md font-bold px-5 py-3 capitalize transition-colors duration-300 transform bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50 rounded-md"
            >
                {disabled && (<Loader2 className="animate-spin" />)}Submit
            </button>
        </div>
    );
};

export default OtpInput;
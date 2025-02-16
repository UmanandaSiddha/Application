import { FC, ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface TextInputProps {
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    isPassword?: boolean;
}

const TextInput: FC<TextInputProps> = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder = "", 
    isPassword = false 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-200">{label}</label>
            <div className="relative flex items-center mt-2">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 focus:ring-purple-400 focus:border-purple-400"
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3"
                    >
                        {showPassword ? <FaEyeSlash className="w-5 h-5 text-gray-500" /> : <FaEye className="w-5 h-5 text-gray-500" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TextInput;
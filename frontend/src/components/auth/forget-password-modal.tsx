import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import TextInput from "./text-input";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    loading: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10" onClick={onClose}>
            <div className="bg-white shadow-md rounded-lg px-6 py-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-500">Request Reset Password</h2>
                    <button onClick={onClose}><RxCross2 size={24} /></button>
                </div>
                <TextInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button
                    className={`mt-4 w-full px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-500 transition ${
                        loading && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => onSubmit(email)}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
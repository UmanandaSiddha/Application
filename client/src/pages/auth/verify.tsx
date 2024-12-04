import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { UserResponse } from "@/types/api-types";
import OtpInput from "@/components/rest/otp-input";

const Verify = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [resendLoading, setResendLoading] = useState<boolean>(false);

    const onOtpSubmit = async (otp: string) => {
        setVerifyLoading(true);
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, { otp }, { withCredentials: true });
            dispatch(userExist(data.user));
            toast.success("User Verified!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setVerifyLoading(false);
        }
    };

    const resendOtp = async () => {
        setResendLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/request/verification`, { withCredentials: true });
            toast.success("OTP has been resent!");
        } catch (error: any) {
            toast.error("Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="pt-6 pb-12 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
            <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-2 rounded-lg bg-white shadow-xl">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch rounded-2xl p-6">
                    <img
                        src="./otp_img.jpg"
                        alt="OTP Verification"
                        className="hidden lg:block lg:w-[500px] xl:w-[600px]"
                    />
                    <div className="w-full lg:w-1/2 text-center flex flex-col justify-center items-center space-y-4 lg:text-left p-4">
                        <h1 className="text-2xl lg:text-3xl font-semibold">Verify your <span className="text-purple-600">Email</span></h1>
                        <h2 className="text-md lg:text-lg text-gray-500 mb-4">Enter the OTP code sent to your email</h2>

                        <OtpInput length={6} disabled={verifyLoading} onOtpSubmit={onOtpSubmit} />
                        <div className="mt-4">
                            <button
                                onClick={resendOtp}
                                disabled={resendLoading}
                                className={`text-purple-600 font-semibold hover:underline ${resendLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {resendLoading ? "Resending OTP..." : "Resend OTP"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify;
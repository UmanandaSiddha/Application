import OtpInput from "@/components/rest/otp-input";
import { donatorExist, donatorNotExist } from "@/redux/reducer/donatorReducer";
import { DonatorResponse } from "@/types/api-types";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DonationLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/donation/dashboard";
    const [email, setEmail] = useState<string>("");
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [emailLoading, setEmailLoading] = useState<boolean>(false);

    const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailLoading(true);
        if (!email) {
            toast.warning("Email is required");
            setEmailLoading(false);
            return;
        };
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/donate/send/otp`, { email }, { withCredentials: true });
            toast.success("Email sent successfully");
            setEmailSent(true);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setEmailLoading(false);
    }

    const onOtpSubmit = async (otp: string) => {
        if (!email) {
            toast.warning("Email is required");
            return;
        };
        if (!emailSent) {
            toast.warning("Send the email first");
            return;
        }
        try {
            const { data }: { data: DonatorResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/donate/login`, { email, otp }, { withCredentials: true });
            dispatch(donatorExist(data.donator));
            toast.success("Logged in successfully");
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.response.data.message);
            dispatch(donatorNotExist());
        }
    };

    return (
        <div className="pt-6 pb-12 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
            <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-2 rounded-lg bg-white shadow-xl">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch rounded-2xl p-6">
                    <img
                        src="/otp_img.jpg"
                        alt="OTP Verification"
                        className="hidden lg:block lg:w-[500px] xl:w-[600px]"
                    />
                    <div className="w-full lg:w-1/2 text-center flex flex-col justify-center items-center space-y-4 lg:text-left p-4">
                        <h1 className="text-2xl lg:text-3xl font-semibold">Login to your account</h1>
                        <h2 className="text-sm lg:text-md text-gray-500 mb-4">An OTP will be sent to your email</h2>

                        <form onSubmit={handleEmail} className="w-full flex flex-col justify-center items-center space-y-4 pb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-2 text-gray-700 w-full md:w-[80%] bg-white border rounded-lg px-4 focus:border-purple-400 dark:focus:border-purple-300 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Email address"
                            />

                            <button
                                type="submit"
                                disabled={emailLoading}
                                className="px-6 py-3 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-500 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50"
                            >
                                {emailLoading ? "Hold on..." : "Send Email"}
                            </button>
                        </form>

                        <hr className="w-full border border-gray-400" />

                        <h1 className="text-2xl lg:text-3xl text-purple-600 font-semibold pb-4">Enter OTP here</h1>
                        {/* <h2 className="text-md lg:text-lg text-black mb-4">Enter OTP here</h2> */}

                        <OtpInput length={6} disabled={emailLoading} onOtpSubmit={onOtpSubmit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonationLogin;
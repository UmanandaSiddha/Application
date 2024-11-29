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
        <div className="flex flex-col justify-center items-center">
            <div className="bg-white w-fit m-6 flex max-lg:flex-col justify-center items-center rounded-2xl ">
                <img src="/otp_img.jpg" alt="" className="xl:w-[800px] lg:w-[700px] sm:w-[400px]" />
                <div className="flex flex-col shadow-[2px_4px_100px_0px_rgba(0,_0,_0,_0.2)] lg:h-[600px]  p-10 gap-10 justify-center items-center rounded-2xl max-sm:w-96 ">
                    <div className="mt-8 lg:mt-0 ">
                        <form onSubmit={handleEmail} className="w-full lg:max-w-xl">
                            <div className="relative flex items-center">
                                <span className="absolute">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block py-3 text-gray-700 w-96 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="mt-8 md:flex md:items-center">
                                <button
                                    type="submit"
                                    disabled={emailLoading}
                                    className="w-1/2 mx-auto px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 "
                                >
                                    {emailLoading ? "Hold on..." : "Send Email"}
                                </button>
                            </div>
                        </form>

                        {emailSent && (
                            <p className="italic text-center text-gray-400">OTP sent to your email</p>
                        )}
                    </div>
                    <h1 className="lg:text-5xl text-3xl font-bold lg:font-semibold">OTP Verification</h1>
                    <h2 className="text-lg">Enter the OTP code sent to your email</h2>
                    <OtpInput length={6} disabled={emailLoading} onOtpSubmit={onOtpSubmit} />
                </div>
            </div>
        </div >
    )
}

export default DonationLogin;
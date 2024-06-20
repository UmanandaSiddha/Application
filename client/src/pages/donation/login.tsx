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
        <section className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-24 mx-auto lg:py-32">
                <div className="lg:flex">
                    <div className="lg:w-1/2">
                        <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />

                        <h1 className="mt-4 text-gray-600 dark:text-gray-300 md:text-lg">Welcome back</h1>

                        <h1 className="mt-4 text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">
                            login to your account
                        </h1>
                    </div>

                    <div className="mt-8 lg:w-1/2 lg:mt-0">
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
                                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="mt-8 md:flex md:items-center">
                                <button
                                    type="submit"
                                    disabled={emailLoading}
                                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                >
                                    {emailLoading ? "Hold on..." : "Send Email"}
                                </button>
                            </div>
                        </form>

                        {emailSent && (
                            <p className="italic text-center text-gray-400">OTP sent to your email</p>
                        )}

                        <div className="mt-16">
                            <p className="text-2xl font-semibold text-center my-4">Enter OTP here</p>
                            <OtpInput length={6} disabled={!email || !emailSent} onOtpSubmit={onOtpSubmit} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default DonationLogin;
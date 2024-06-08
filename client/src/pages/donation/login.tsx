import { userExist } from "@/redux/reducer/userReducer";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let currentOTPIndex: number = 0;

const DonationLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [emailLoading, setEmailLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = target;
        const newOTP: string[] = [...otp];
        newOTP[currentOTPIndex] = value.substring(value.length - 1);

        if (!value) setActiveOTPIndex(currentOTPIndex - 1);
        else setActiveOTPIndex(currentOTPIndex + 1);

        setOtp(newOTP);
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        currentOTPIndex = index;
        if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    const handleVerify = async () => {
        setVerifyLoading(true);
        if (email) {
            const otpString = Number(otp.join(''));
            console.log(otpString);
        }
        // try {
        //     const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, {otp: otpString}, {withCredentials: true});
        //     dispatch(userExist(data.user));
        //     toast.success("User Verified!");
        //     navigate("/dashboard");
        // } catch (error: any) {
        //     toast.error(error.response.data.message);
        // }
        setVerifyLoading(false);
    }

    const handleEmail = async () => {
        setEmailLoading(true);
        console.log(email);
        // try {
        //     const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, {email}, {withCredentials: true});
        //     dispatch(userExist(data.user));
        //     toast.success("User Verified!");
        //     navigate("/dashboard");
        // } catch (error: any) {
        //     toast.error(error.response.data.message);
        // }
    }

    const resetForm = () => {
        setEmail("");
        setOtp(new Array(6).fill(""));
        setEmailLoading(false);
        setActiveOTPIndex(0);
        inputRef.current?.focus();
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailLoading}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 w-full mb-4"
                    onClick={handleEmail}
                    disabled={emailLoading || !email}
                >
                    {emailLoading ? "Email Sent" : "Send Email"}
                </button>

                {emailLoading && (
                    <>
                        <p className="text-red-500 text-lg mb-4 text-center">OTP was sent to your Email</p>
                        <div className="flex justify-center items-center space-x-2 mb-4">
                            {otp.map((_, index) => (
                                <React.Fragment key={index}>
                                    <input
                                        ref={activeOTPIndex === index ? inputRef : null}
                                        type="number"
                                        className="w-10 h-10 border-2 rounded-xl bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition sm:w-10 sm:h-10"
                                        onChange={handleOnChange}
                                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                                        value={otp[index]}
                                    />
                                    {index === otp.length - 1 ? null : (
                                        <span className="w-2 py-0.5" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 w-full mb-4"
                            onClick={handleVerify}
                            disabled={verifyLoading}
                        >
                            {verifyLoading ? "Verifying..." : "Click here to verify"}
                        </button>
                    </>
                )}

                {emailLoading && (
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 w-full"
                        onClick={resetForm}
                    >
                        Reset the form
                    </button>
                )}
            </div>
        </div>
    )
}

export default DonationLogin;
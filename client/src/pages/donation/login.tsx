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

    return (
        <div>
            <div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={emailLoading} />
                </div>
                <button className="bg-red-500 p-2 m-2 text-white rounded-lg" onClick={handleEmail} disabled={emailLoading}>Send Email</button>
            </div>
            {emailLoading && (
                <p className="text-red-500 text-lg">Otp was send to your Email</p>
            )}
            <div>
                <div className={"max-h-screen flex justify-center items-center space-x-2"}>
                    {otp.map((_, index) => {
                        return (
                            <React.Fragment key={index}>
                                <input
                                    ref={activeOTPIndex === index ? inputRef : null}
                                    type="number"
                                    className={
                                        "w-12 h-12 border-2 rounded-xl bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                                    }
                                    onChange={handleOnChange}
                                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                                    value={otp[index]}
                                />
                                {index === otp.length - 1 ? null : (
                                    <span className={"w-2 py-0.5"} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
                <button className="bg-red-500 p-2 m-2 text-white rounded-lg" onClick={handleVerify} disabled={verifyLoading}>{verifyLoading ? "Verifying..." : "Click here to verify"}</button>
            </div>
            <div>
                <button className="bg-green-500 p-2 m-2 text-white rounded-lg" onClick={() => setEmailLoading(false)} disabled={!emailLoading}>Reset the form</button>
            </div>
        </div>
    )
}

export default DonationLogin;
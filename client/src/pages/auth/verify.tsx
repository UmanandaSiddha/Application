import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserResponse } from "@/types/api-types";

let currentOTPIndex: number = 0;

const Verify = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);

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

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,index: number) => {
        currentOTPIndex = index;
        if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    const handleVerify = async () => {
        setVerifyLoading(true);
        const otpString = Number(otp.join(''));
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, {otp: otpString}, {withCredentials: true});
            dispatch(userExist(data.user));
            toast.success("User Verified!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setVerifyLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-8">
            <h1>Otp sent to your Email</h1>
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
    )
}

export default Verify;
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

    const onOtpSubmit = async (otp: string) => {
        setVerifyLoading(true);
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, { otp }, { withCredentials: true });
            dispatch(userExist(data.user));
            toast.success("User Verified!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setVerifyLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="bg-white w-fit m-6 flex max-lg:flex-col justify-center items-center rounded-2xl ">
                <img src="otp_img.jpg" alt="" className="xl:w-[800px] lg:w-[700px] sm:w-[400px]" />
                <div className="flex flex-col shadow-[2px_4px_100px_0px_rgba(0,_0,_0,_0.2)] lg:h-[600px]  p-10 gap-10 justify-center items-center rounded-2xl max-sm:w-96 ">
                    <h1 className="lg:text-5xl text-3xl font-bold lg:font-semibold">OTP Verification</h1>
                    <h2 className="text-lg">Enter the OTP code sent to your email</h2>
                    <OtpInput length={6} disabled={verifyLoading} onOtpSubmit={onOtpSubmit} />
                </div>
            </div>
        </div>
    )
}

export default Verify;
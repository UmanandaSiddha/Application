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
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify`, {otp}, {withCredentials: true});
            dispatch(userExist(data.user));
            toast.success("User Verified!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setVerifyLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-8">
            <h1>Otp sent to your Email</h1>
            <div className="max-h-screen flex justify-center items-center space-x-2">
                <OtpInput length={6} disabled={verifyLoading} onOtpSubmit={onOtpSubmit} />
            </div>
        </div>
    )
}

export default Verify;
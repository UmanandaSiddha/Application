import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userReducer";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { UserResponse } from "@/types/api-types";

const Verify = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState<string | number>();

    const handleVerify = async () => {
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
    }

    return (
        <div className="flex justify-center items-center mt-8">
            <input type="number" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button onClick={handleVerify} disabled={verifyLoading}>{verifyLoading ? "Verifying..." : "Click here to verify"}</Button>
        </div>
    )
}

export default Verify;
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userReducer";
import { verifyUser } from "@/redux/api/userApi";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Loader from "@/components/rest/loader";
import { useState } from "react";

const Verify = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const token = search.get("token");
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);

    const handleVerify = async () => {
        setVerifyLoading(true);
        if (token) {
            try {
                const data = await verifyUser(token!)
                dispatch(userExist(data.user));
                toast.success("User Verified!");
                navigate("/dashboard");
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        setVerifyLoading(false);
    }

    return (
        <>
            {token ? (
                <div className="flex justify-center items-center mt-8">
                    <Button onClick={handleVerify} disabled={verifyLoading}>{verifyLoading ? "Verifying..." : "Click here to verify"}</Button>
                </div>
            ) : (
                <Loader />
            )}
        </>
    )
}

export default Verify;
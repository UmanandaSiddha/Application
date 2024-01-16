import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userReducer";
import { verifyUser } from "@/redux/api/userApi";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const Verify = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const token = search.get("token");

    const handleVerify = async () => {
        try {
            const data = await verifyUser(token!)
            dispatch(userExist(data.user));
            toast.success("User Verified!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="flex justify-center items-center mt-8">
            <Button onClick={handleVerify}>Click here to verify</Button>
        </div>
    )
}

export default Verify;
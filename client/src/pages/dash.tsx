import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loader from "@/components/rest/loader";
import { requestVerifyUser } from "@/redux/api/userApi";

import { toast } from 'react-toastify';

const Dashboard = () => {

    const navigate = useNavigate();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handleRequestVerify = async () => {
        try {
            await requestVerifyUser();
            toast.success("Email Sent!")
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col justify-center gap-8 items-center mt-8'>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1 className="text-3xl">Dashboard Page</h1>
                    {!user?.isVerified && (
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <p className="text-red-600 font-semibold">You are not verified</p>
                            <Button onClick={handleRequestVerify}>Verify Email</Button>
                        </div>
                    )}
                    <div className="flex flex-wrap justify-center">
                        <Button variant="link" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/tree")}>Tree VCard</Button>
                        <Button variant="link" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/personal/view")}>Personal VCard</Button>
                        <Button variant="link" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/medical/view")}>Medical VCard</Button>
                        <Button variant="link" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/creator/view")}>Creator VCard</Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard;
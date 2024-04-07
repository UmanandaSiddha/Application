import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { requestVerifyUser } from "@/redux/api/userApi";


import { toast } from 'react-toastify';
import { useCallback } from "react";

const Dashboard = () => {

    const navigate = useNavigate();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handleRequestVerify = useCallback(async () => {
        try {
            await requestVerifyUser();
            toast.success("Email Sent!")
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }, [navigate]);

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
                        <button className="p-4 hover:underline hover:font-semibold" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/cards?type=tree")}>Tree VCard</button>
                        <button className="p-4 hover:underline hover:font-semibold" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/cards?type=personal")}>Personal VCard</button>
                        <button className="p-4 hover:underline hover:font-semibold" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/cards?type=medical")}>Medical VCard</button>
                        <button className="p-4 hover:underline hover:font-semibold" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/cards?type=creator")}>Creator VCard</button>
                        <button className="p-4 hover:underline hover:font-semibold" disabled={!user?.isVerified} onClick={() => navigate("/dashboard/cards?type=animal")}>Animal VCard</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard;
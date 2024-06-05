import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";

import { toast } from "react-toastify";
import { useState } from "react";
import { UserResponse } from "@/types/api-types";
import axios from "axios";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const token = search.get("token");
    const user = search.get("user");
    const [resetLoading, setResetLoading] = useState<boolean>(false);

    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResetLoading(true);
        const resetData = {
            ...password,
            user,
        }
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/password/reset/${token}`, resetData, config);
            dispatch(userExist(data.user));
            toast.success("Password Reset Successfully");
            navigate("/dashboard");
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setResetLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center mt-8">
           
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="newPassword">Password</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline font-Kanit"
                            name="newPassword"
                            type="text"
                            placeholder="Enter New Password"
                            value={password.newPassword}
                            onChange={(e) => setPassword({ ...password, newPassword: e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline font-Kanit"
                            name="confirmPassword"
                            type="text"
                            placeholder="Enter Password Again"
                            value={password.confirmPassword}
                            onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value})}
                        />
                    </div>
                    <button className="w-[350px] bg-red-500 p-2 m-2 text-white rounded-lg" disabled={resetLoading} type="submit">
                        {resetLoading ? "Hold on" : "Reset"}
                    </button>
                </form>
        </div>
    )
}

export default ResetPassword;
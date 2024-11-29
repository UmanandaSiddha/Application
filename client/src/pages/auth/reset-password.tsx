import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";

import { toast } from "react-toastify";
import { useState } from "react";
import { UserResponse } from "@/types/api-types";
import axios from "axios";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useParams();
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
        <section className="pt-6 pb-16 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
            <div className="container flex flex-col items-center justify-center mt-12 px-6 mx-auto">
                <div className="flex justify-center mx-auto">
                    <img src="/voolata_long_r.png" alt="" className="w-36 pb-5" />
                </div>

                <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-purple-800 capitalize md:text-3xl">
                    Reset Password
                </h1>

                <div className="w-full max-w-md mx-auto mt-6">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block my-2 text-lg text-gray-600 dark:text-gray-200">Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40" 
                                value={password.newPassword}
                                onChange={(e) => setPassword({ ...password, newPassword: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block my-2 text-lg text-gray-600 dark:text-gray-200">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter your password again" 
                                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40" 
                                value={password.confirmPassword}
                                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value})}
                            />
                        </div>

                        <button disabled={resetLoading} type="submit" className="w-full px-6 py-3 mt-4 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-500 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50">
                            {resetLoading ? "Hold on" : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;
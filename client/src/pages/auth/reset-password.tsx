import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";

import { toast } from "react-toastify";
import { useState } from "react";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useParams();
    const [resetLoading, setResetLoading] = useState<boolean>(false);
    const [passwordType, setPasswordType] = useState<string>("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState<string>("password");
    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password.newPassword)) {
            toast.warning("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            return;
        }
        if (password.newPassword.length < 8) {
            toast.warning("Password must be at least 8 characters long");
            return;
        }
        if (password.newPassword !== password.confirmPassword) {
            toast.warning("Passwords doesn't match");
            return;
        }
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
        } finally {
            setResetLoading(false);
        }
    }

    return (
        <section className="pt-6 pb-16 h-screen bg-white">
            <div className="container flex flex-col items-center justify-center mt-12 px-6 mx-auto">
                <div className="flex justify-center mx-auto">
                    <img src="/voolata_long_r.png" alt="" className="w-36 pb-5" />
                </div>

                <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-500 capitalize md:text-3xl">
                    Reset Password
                </h1>

                <div className="w-full max-w-md mx-auto mt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-6">
                            <div className="flex justify-between mb-2">
                                <label htmlFor="password" className="text-md font-semibold text-gray-600 dark:text-gray-200">
                                    New Password
                                </label>
                            </div>

                            <div className="relative flex items-center mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        passwordType === "password" ? setPasswordType("text") : setPasswordType("password");
                                    }}
                                    className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto"
                                >
                                    {passwordType === "password" ? (
                                        <FaEyeSlash className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
                                    ) : (
                                        <FaEye className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
                                    )}
                                </button>
                                <input
                                    type={passwordType}
                                    name="password"
                                    id="cnfpassword"
                                    placeholder="Your Password"
                                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={password.newPassword}
                                    onChange={(e) =>
                                        setPassword({ ...password, newPassword: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between mb-2">
                                <label htmlFor="password" className="text-md font-semibold text-gray-600 dark:text-gray-200">
                                    Confirm Password
                                </label>
                            </div>

                            <div className="relative flex items-center mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        confirmPasswordType === "password" ? setConfirmPasswordType("text") : setConfirmPasswordType("password");
                                    }}
                                    className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto"
                                >
                                    {confirmPasswordType === "password" ? (
                                        <FaEyeSlash className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
                                    ) : (
                                        <FaEye className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
                                    )}
                                </button>
                                <input
                                    type={confirmPasswordType}
                                    name="password"
                                    id="cnfpassword"
                                    placeholder="Your Password"
                                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={password.confirmPassword}
                                    onChange={(e) =>
                                        setPassword({ ...password, confirmPassword: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <button disabled={resetLoading} type="submit" className="flex items-center justify-center gap-2 w-full px-6 py-3 mt-6 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-500 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50">
                            {resetLoading ? (
                                <><Loader2 className="animate-spin" />Hold on...</>
                            ) : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { getGoogleAuthUrl } from "@/lib/google";
import { useState } from "react";
import axios from "axios";
import { UserResponse } from "@/types/api-types";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [forgotEmail, setForgotEmail] = useState<string>("");
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);
    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/login`,
                userData,
                config
            );
            dispatch(userExist(data.user));
            toast.success("Logged In!");
            navigate(from, { replace: true });
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setLoginLoading(false);
    };

    const onForgot = async () => {
        setForgotLoading(true);
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: any } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/password/forgot`,
                { email: forgotEmail },
                config
            );
            setIsOpen(false);
            toast.success(data.message);
        } catch (error: any) {
            setIsOpen(false);
            toast.error(error.response.data.message);
        }
        setForgotLoading(false);
    };

    function handleOnClose(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setIsOpen(false);
        }
    }

    return (
        <>
            {isOpen ? (
                <div
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
                    id="popupform"
                    onClick={handleOnClose}
                >
                    <div className="w-full max-w-md">
                        <div className="">
                            <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                <div className="flex justify-center py-2">
                                    <p className="font-Kanit text-lg">Forgot Password</p>
                                </div>
                                <div className="mb-6">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2 font-Kanit"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline font-Kanit"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        className="bg-black hover:cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                        onClick={onForgot}
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? "Sending..." : "Send Email"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="flex justify-center items-center md:max-h-screen min-h-screen w-full md:bg-blue-300">
                <div className="md:w-[30%] w-[80%]">
                    <form onSubmit={handleSubmit} className="space-y-8 md:w-full md:border md:p-10 md:-mt-[2rem] md:rounded-xl md:bg-white">
                        <div className="mb-2 mt-2 w-[90%]">
                            <label className="block text-black text-lg font-bold mb-2 w-[90%] font-Philosopher">
                                Email
                            </label>
                            <input
                                className="shadow border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline font-Kanit"
                                name="email"
                                type="email"
                                placeholder="Enter your Email"
                                value={userData.email}
                                onChange={(e) =>
                                    setUserData({ ...userData, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="w-[90%]">
                            <label className="block text-black text-lg font-bold mb-2 w-[90%] font-Philosopher">
                                Password
                            </label>
                            <input
                                className="shadow rounded border w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none font-Kanit focus:shadow-outline"
                                name="password"
                                type="text"
                                placeholder="Enter Your Password"
                                value={userData.password}
                                onChange={(e) =>
                                    setUserData({ ...userData, password: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex justify-center">
                                <button
                                    className="bg-green-400 hover:bg-green-500 text-teal-950 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline font-Philosopher w-[40%]"
                                    type="submit"
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                            <p
                                className="flex justify-center text-sm hover:underline hover:cursor-pointer mt-2 font-Philosopher"
                                onClick={() => setIsOpen(true)}
                            >
                                Forgot Password?
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <div className="mt-4 flex justify-center">
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:cursor-pointer font-Philosopher">
                                    <a href={getGoogleAuthUrl()}>Sign in with Google</a>
                                </button>
                            </div>
                            <div className="flex flex-row justify-center font-Philosopher">
                                <p className="basis-2/3 flex justify-end pr-1">Don't have an account?</p>
                                <p className="basis-1/3 flex justify-start hover:cursor-pointer hover:underline underline">
                                    <Link to="/onboarding">Register</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default Login;

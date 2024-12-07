import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { getGoogleAuthUrl } from "@/lib/google";
import { useState } from "react";
import axios from "axios";
import { UserResponse } from "@/types/api-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { RxCross2 } from "react-icons/rx";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);
    const from = location.state?.from?.pathname || "/dashboard";
    const [passwordType, setPasswordType] = useState<string>("password");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData.email ||!userData.password) {
            toast.warning("All fields are required");
            return;
        }
        setLoginLoading(true);
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData, config);
            dispatch(userExist(data.user));
            toast.success("Logged In!");
            navigate(from, { replace: true });
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const onForgot = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData.email) {
            toast.warning("Enter your email");
            return;
        }
        setForgotLoading(true);
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/password/forgot`, { email: userData.email }, config);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setIsOpen(false);
            setForgotLoading(false);
        }
    };

    function handleOnClose(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setIsOpen(false);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div
                    className="hidden bg-cover lg:block lg:w-1/2"
                    style={{
                        backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"
                    }}
                >
                    <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                        <div>
                            <img src="/voolata_long_w_r.png" loading="lazy" alt="" className="w-36 pb-5" />
                            <p className="max-w-xl mt-3 text-gray-300">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                                autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus
                                molestiae
                            </p>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div
                        className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
                        id="popupform"
                        onClick={handleOnClose}
                    >
                        <div className="w-full max-w-md">
                            <form onSubmit={onForgot} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-500">Request Reset Password</h2>
                                    <button onClick={() => setIsOpen(false)}><RxCross2 size={24} /></button>
                                </div>
                                <div className="mt-6 mb-8">
                                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@example.com"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={userData.email}
                                        onChange={(e) =>
                                            setUserData({ ...userData, email: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform ${forgotLoading ? "bg-purple-400" : "bg-purple-700"} rounded-lg hover:bg-purple-400 focus:outline-none focus:bg-purple-400 focus:ring focus:ring-purple-300 focus:ring-opacity-50`}
                                        type="submit"
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? (
                                            <><Loader2 className="animate-spin" />Hold on...</>
                                        ) : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-1/2">
                    <div className="flex-1">
                        <div className="text-center">
                            <div className="flex justify-center mx-auto">
                                <img src="/voolata_long_r.png" loading="lazy" alt="" className="w-36 mx-auto pb-5" />
                            </div>

                            <p className="mt-3 text-gray-700 dark:text-gray-300">Sign in to access your account</p>
                        </div>

                        <div className="mt-8 px-4">
                            <form onSubmit={handleSubmit}>
                                
                                <div className="mt-6">
                                    <label htmlFor="email" className="block font-semibold mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@example.com"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={userData.email}
                                        onChange={(e) =>
                                            setUserData({ ...userData, email: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm font-semibold text-gray-600 dark:text-gray-200">
                                            Password
                                        </label>
                                        <p onClick={() => setIsOpen(true)} className="text-sm cursor-pointer text-gray-500 focus:text-purple-500 hover:text-purple-500 hover:underline">
                                            Forgot password?
                                        </p>
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
                                            id="password"
                                            placeholder="**********"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                            value={userData.password}
                                            onChange={(e) =>
                                                setUserData({ ...userData, password: e.target.value })
                                            }
                                        />
                                    </div>

                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform ${loginLoading ? "bg-purple-500" : "bg-purple-700"} rounded-lg hover:bg-purple-500 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-purple-300 focus:ring-opacity-50`}
                                        disabled={loginLoading}
                                    >
                                        {loginLoading ? (
                                            <><Loader2 className="animate-spin" />Signing in...</>
                                        ) : "Sign in"}
                                    </button>


                                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">or sign in with</p>

                                    <a href={getGoogleAuthUrl()} className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                                            <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                                            <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                                        </svg>

                                        <span className="mx-2">Sign in with Google</span>
                                    </a>
                                </div>

                            </form>

                            <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <Link to="/onboarding" className="text-purple-500 focus:outline-none focus:underline hover:underline">Sign up</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { getGoogleAuthUrl } from "@/lib/google";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordType, setPasswordType] = useState<string>("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState<string>("password");
    const [checked, setChecked] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData.name || !userData.email || !userData.password || !userData.confirmPassword) {
            toast.warning("All fields are required");
            return;
        }
        if (!checked) {
            toast.warning("Please agree to the terms&conditions and privacy policy");
            return;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)) {
            toast.warning("Invalid email format");
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(userData.password)) {
            toast.warning("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            return;
        }
        if (userData.password.length < 8) {
            toast.warning("Password must be at least 8 characters long");
            return;
        }
        if (userData.password !== userData.confirmPassword) {
            toast.warning("Passwords doesn't match");
            return;
        }
        setRegisterLoading(true);
        const registerData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
        };
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/register`,
                registerData,
                config
            );
            dispatch(userExist(data.user));
            toast.success(`OTP sent ${userData.email}, please verify yourself`);
            navigate("/verify")
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        } finally {
            setRegisterLoading(false);
        }
    };

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

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-1/2">
                    <div className="flex-1 hide-scrollbar overflow-auto h-full">
                        <div className="text-center mt-5">
                            <div className="flex justify-center mx-auto">
                                <img src="/voolata_long_r.png" loading="lazy" alt="" className="w-36 mx-auto pb-5" />
                            </div>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign up to access your account</p>
                        </div>

                        <div className="mt-8 px-4">
                            <form onSubmit={handleSubmit}>

                                <div className="mt-6">
                                    <label htmlFor="name" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Example Simple"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={userData.name}
                                        onChange={(e) =>
                                            setUserData({ ...userData, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="text"
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
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">
                                            Password
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
                                            id="password"
                                            placeholder="Your Password"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                            value={userData.password}
                                            onChange={(e) =>
                                                setUserData({ ...userData, password: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">
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
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                            value={userData.confirmPassword}
                                            onChange={(e) =>
                                                setUserData({ ...userData, confirmPassword: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => setChecked(ch => !ch)}
                                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded"
                                        />
                                        <label
                                            className="ms-2 text-sm font-medium text-gray-900"
                                        >
                                            I agree with the{" "}
                                            <Link to="/terms-conditions" className="text-purple-600 hover:underline">
                                                terms and conditions
                                            </Link>
                                            {" "}and{" "}
                                            <Link to="/privacy-policy" className="text-purple-600 hover:underline">
                                                privacy policy
                                            </Link>
                                            .
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={!checked || registerLoading}
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform ${!checked || registerLoading ? "bg-purple-400" : "bg-purple-700"} rounded-lg hover:bg-purple-400 focus:outline-none focus:bg-purple-400 focus:ring focus:ring-purple-300 focus:ring-opacity-50`}
                                    >
                                        {registerLoading ? (
                                            <><Loader2 className="animate-spin" />Hold on...</>
                                        ) : "Sign up"}
                                    </button>


                                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">or sign up with</p>

                                    <a href={getGoogleAuthUrl()} className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                                            <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                                            <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                                        </svg>

                                        <span className="mx-2">Sign up with Google</span>
                                    </a>
                                </div>

                            </form>

                            <p className="mt-3 mb-8 text-sm text-center text-gray-400">Already have an account? <Link to="/login" className="text-purple-500 focus:outline-none focus:underline hover:underline">Sign in</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

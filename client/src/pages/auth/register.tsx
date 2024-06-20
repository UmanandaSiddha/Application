import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { getGoogleAuthUrl } from "@/lib/google";
import Compressor from "compressorjs";
import { UserResponse } from "@/types/api-types";
import axios from "axios";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState<any>();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files![0];
        if (file instanceof Blob) {
            const compressImage = async (file: File) => {
                try {
                    return await new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.6,
                            maxWidth: 800,
                            maxHeight: 600,
                            success(result) {
                                resolve(result);
                            },
                            error(err) {
                                reject(err);
                            },
                        });
                    });
                } catch (error) {
                    console.error("Error compressing image:", error);
                    throw error;
                }
            };

            try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onload = () => {
                    if (typeof reader.result === "string") {
                        setAvatar(reader.result);
                    } else {
                        console.error("Failed to read the compressed file.");
                    }
                };
                reader.readAsDataURL(compressedFile as Blob);
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        } else {
            console.error("The selected file is not a Blob.");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userData.name || !userData.email || !userData.password) {
            toast.warning("All fields are required");
            return;
        }
        setRegisterLoading(true);
        const registerData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            image: avatar,
        };
        try {
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/register`,
                registerData,
                config
            );
            dispatch(userExist(data.user));
            navigate("/verify")
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setRegisterLoading(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div
                    className="hidden bg-cover lg:block lg:w-2/3"
                    style={{
                        backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"
                    }}
                >
                    <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                        <div>
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">VCARDS APP</h2>
                            <p className="max-w-xl mt-3 text-gray-300">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                                autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus
                                molestiae
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">
                            <div className="flex justify-center mx-auto">
                                <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
                            </div>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign up to access your account</p>
                        </div>

                        <div className="mt-8">
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
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@example.com"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={userData.email}
                                        onChange={(e) =>
                                            setUserData({ ...userData, email: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="avatar" className="text-sm text-gray-600 dark:text-gray-200">
                                            Profile Photo
                                        </label>
                                    </div>

                                    <input
                                        id="avatar"
                                        className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">
                                            Password
                                        </label>
                                    </div>

                                    <input
                                        type="text"
                                        name="password"
                                        id="password"
                                        placeholder="Your Password"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        value={userData.password}
                                        onChange={(e) =>
                                            setUserData({ ...userData, password: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                        disabled={registerLoading}
                                    >
                                        {registerLoading ? "Signing up..." : "Sign up"}
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

                            <p className="mt-6 text-sm text-center text-gray-400">Already have an account? <Link to="/login" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign in</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

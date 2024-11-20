import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import Compressor from "compressorjs";

const OrgRegister = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registerLoading, setRegisterLoading] = useState(false);
    const [avatar, setAvatar] = useState<any>();
    const [organisationInfo, setOrganisationInfo] = useState({
        name: "",
        website: "",
        email: "",
        phone: "",
        password: "",
        cfmPassword: "",
        street: "",
        state: "",
        city: "",
        postalCode: "",
        country: "",
    });


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
        for (const [field, value] of Object.entries(organisationInfo)) {
            if (field !== 'website' && !value) {
                toast.warning(`${field} is required`);
                return;
            }
        }

        if (organisationInfo.password != organisationInfo.cfmPassword) {
            toast.warning(`Password doesn't match!!`);
            return;
        }

        setRegisterLoading(true);
        const registerData = {
            ...organisationInfo,
            avatar
        };
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
            const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register?type=org`, registerData, config);
            dispatch(userExist(data.user));
            toast.success("User Registered!");
            navigate("/verify");
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setRegisterLoading(false);
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div
                    className="hidden bg-cover lg:block lg:w-2/5"
                    style={{
                        backgroundImage: "url(https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80)"
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

                <div className="flex items-center w-full max-w-3xl py-1 px-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full overflow-auto h-full hide-scrollbar">
                        {/* <h1 className="text-4xl font-bold tracking-wider text-gray-800 capitalize dark:text-white">
                            Organistion Registration
                        </h1> */}

                        <div className="text-center mt-5">
                            <div className="flex justify-center mx-auto">
                                <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
                            </div>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign up as an Organisation</p>
                        </div>

                        <div className="px-4 pt-4">
                            <div className="mt-4 space-y-2">
                                <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Name
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                name="name"
                                                type="text"
                                                placeholder="Orgabisation Name"
                                                value={organisationInfo.name}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Website
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                name="website"
                                                type="text"
                                                placeholder="Orgabisation Website"
                                                value={organisationInfo.website}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, website: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Email
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                name="email"
                                                type="email"
                                                placeholder="Orgabisation Email"
                                                value={organisationInfo.email}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Contact Number
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                type="tel"
                                                name="phone"
                                                placeholder="Orgabisation Contact Number"
                                                value={organisationInfo.phone}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Password
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                type="password"
                                                name="password"
                                                placeholder="Enter your Password"
                                                value={organisationInfo.password}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Confirm Password
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                                type="password"
                                                name="password"
                                                placeholder="Enter your Password Again"
                                                value={organisationInfo.cfmPassword}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, cfmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                            Logo
                                        </label>
                                        <input
                                            className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full focus:border-blue-500 focus:ring-blue-500 dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 dark:border-gray-600 dark:bg-gray-900"
                                            id="avatar"
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-semibold text-md text-gray-600 dark:text-gray-200">
                                            Address
                                        </label>
                                        <input
                                            className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                            type="text"
                                            name="address"
                                            placeholder="Street address"
                                            value={organisationInfo.street}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <input
                                            className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={organisationInfo.state}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, state: e.target.value })}
                                        />
                                        <input
                                            className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={organisationInfo.city}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <input
                                            className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                            type="number"
                                            name="zip"
                                            placeholder="Postal Code"
                                            value={organisationInfo.postalCode}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, postalCode: e.target.value })}
                                        />
                                        <input
                                            className="w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                                            type="text"
                                            name="country"
                                            placeholder="Country"
                                            value={organisationInfo.country}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, country: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={registerLoading}
                                        className="mt-4 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white shadow-sm"
                                    >
                                        {registerLoading ? "Loading..." : "Sign Up"}
                                    </button>
                                </form>

                                <p className="mt-4 pb-8 text-md text-center text-black">Already have an account? <Link to="/login" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign in</Link>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrgRegister;
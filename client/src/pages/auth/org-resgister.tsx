import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { UserResponse } from "@/types/api-types";
import axios from "axios";

const OrgRegister = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordType, setPasswordType] = useState<string>("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState<string>("password");
    const [registerLoading, setRegisterLoading] = useState(false);
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
        };
        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
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
                            <img src="/voolata_long_w_r.png" alt="" className="w-36 pb-5" />
                            <p className="max-w-xl mt-3 text-gray-300">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                                autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus
                                molestiae
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full max-w-3xl py-1 px-2 md:px-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full overflow-auto h-full hide-scrollbar">

                        <div className="text-center mt-5">
                            <div className="flex justify-center mx-auto">
                                <img src="/voolata_long_r.png" alt="" className="w-36 mx-auto pb-5" />
                            </div>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign up as an Organisation</p>
                        </div>

                        <div className="px-4 pt-4">
                            <div className="mt-4 space-y-2">
                                <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Name
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                                name="name"
                                                type="text"
                                                placeholder="Orgabisation Name"
                                                value={organisationInfo.name}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Website
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                                name="website"
                                                type="text"
                                                placeholder="Orgabisation Website"
                                                value={organisationInfo.website}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, website: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Email
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                                name="email"
                                                type="email"
                                                placeholder="Orgabisation Email"
                                                value={organisationInfo.email}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                Contact Number
                                            </label>
                                            <input
                                                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                                type="tel"
                                                name="phone"
                                                placeholder="Orgabisation Contact Number"
                                                value={organisationInfo.phone}
                                                onChange={(e) => setOrganisationInfo({ ...organisationInfo, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="w-full md:w-1/2">
                                            <div className="flex justify-between mb-2">
                                                <label htmlFor="password" className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                                    Password
                                                </label>
                                            </div>
                                            <div className="relative flex items-center mt-2 ">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        passwordType === "password" ? setPasswordType("text") : setPasswordType("password");
                                                    }}
                                                    className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <input
                                                    type={passwordType}
                                                    name="password"
                                                    id="password"
                                                    placeholder="Your Password"
                                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                                    value={organisationInfo.password}
                                                    onChange={(e) =>
                                                        setOrganisationInfo({ ...organisationInfo, password: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <div className="flex justify-between mb-2">
                                                <label htmlFor="password" className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <input
                                                    type={confirmPasswordType}
                                                    name="password"
                                                    id="cnfpassword"
                                                    placeholder="Your Password"
                                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                                    value={organisationInfo.cfmPassword}
                                                    onChange={(e) =>
                                                        setOrganisationInfo({ ...organisationInfo, cfmPassword: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-semibold text-md text-gray-600 dark:text-gray-200">
                                            Address
                                        </label>
                                        <input
                                            className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                            type="text"
                                            name="address"
                                            placeholder="Street address"
                                            value={organisationInfo.street}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <input
                                            className="w-full md:w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={organisationInfo.state}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, state: e.target.value })}
                                        />
                                        <input
                                            className="w-full md:w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={organisationInfo.city}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <input
                                            className="w-full md:w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
                                            type="number"
                                            name="zip"
                                            placeholder="Postal Code"
                                            value={organisationInfo.postalCode}
                                            onChange={(e) => setOrganisationInfo({ ...organisationInfo, postalCode: e.target.value })}
                                        />
                                        <input
                                            className="w-full md:w-1/2 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-purple-500"
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
                                        className="mt-4 w-full rounded-md bg-purple-700 px-6 py-3 font-medium text-white shadow-sm"
                                    >
                                        {registerLoading ? "Loading..." : "Sign Up"}
                                    </button>
                                </form>

                                <p className="mt-4 pb-8 text-md text-center text-black">Already have an account? <Link to="/login" className="text-purple-500 focus:outline-none focus:underline hover:underline">Sign in</Link>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrgRegister;
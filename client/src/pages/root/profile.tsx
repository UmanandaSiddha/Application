import { userExist, userNotExist } from "@/redux/reducer/userReducer";
import { RootState } from "@/redux/store";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {

    const dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<any>();
    const [openSep, setOpenSep] = useState<boolean>(false);

    const [openReset, setOpenReset] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    const [openProfile, setOpenProfile] = useState(false);
    const [openBilling, setOpenBilling] = useState(false);
    const [openOrg, setOpenOrg] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        image: ""
    });
    const [billingAddress, setBillingAddress] = useState({
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: ""
    });
    const [orgDetails, setOrgDetails] = useState({
        website: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            postalCode: ""
        }
    });

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOpen(true);
        const updateData = {

        };
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/me/update`, updateData, { withCredentials: true });
            dispatch(userExist(data.user));
            setOpen(false);
            toast.success("Profile Updated Successfully");
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    };

    const handleUpdateBillingAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

        } catch (error) {

        }
    }

    const handleUpdateOrgDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

        } catch (error) {

        }
    }

    const handleDeleteAccount = useCallback(async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/user/delete/account`, { withCredentials: true });
            dispatch(userNotExist());
            toast.success("Account Deleted Successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setDeleteLoading(false);
    }, [dispatch]);

    const handleResetPassword = useCallback(async () => {
        const resetDate = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        setOpenSep(true);
        try {
            if (user?.accountType === "google") {
                const config = {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                };
                const { data }: { data: UserResponse } = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/user/set/password`,
                    resetDate,
                    config
                );
                dispatch(userExist(data.user));
            } else {
                const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/password/reset/:token`, resetDate, { withCredentials: true });
                dispatch(userExist(data.user));
            }
            setOpenSep(false);
            toast.success("Password Updated Successfully");
            setOpenReset(false);
        } catch (error: any) {
            setOpenSep(false);
            toast.error(error.response.data.message);
        }
    },
        [dispatch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(reader.result);
                } else {
                    console.log("Failed to read the file.");
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };

    return (
        <div className="w-[80%] mx-auto">
            {openProfile && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update Profile</h2>
                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenProfile(false)}>Close</button>
                        </div>
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <label htmlFor="avatar" className="text-lg font-semibold">Avatar</label>
                                <input type="file" placeholder="Enter you avatar" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="name" className="text-lg font-semibold">Name</label>
                                <input type="text" placeholder="Enter you Name" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="phone" className="text-lg font-semibold">Phone</label>
                                <input type="number" placeholder="Enter you Phone" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <button className="w-full mt-4 px-3 py-2 text-lg text-white bg-gray-700 rounded-lg" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            {openBilling && (
                <div className="fixed mt-8 inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%] max-h-[95%] overflow-auto hide-scrollbar">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update Billing Address</h2>
                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenBilling(false)}>Close</button>
                        </div>
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <label htmlFor="street" className="text-lg font-semibold">Street</label>
                                <input type="text" placeholder="Enter you street" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2">
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="city" className="text-lg font-semibold">City</label>
                                    <input type="text" placeholder="Enter you city" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="state" className="text-lg font-semibold">State</label>
                                    <input type="text" placeholder="Enter you state" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2">
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="country" className="text-lg font-semibold">Country</label>
                                    <input type="text" placeholder="Enter you country" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="postal code" className="text-lg font-semibold">Postal Code</label>
                                    <input type="text" placeholder="Enter you postal code" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                            </div>
                            <button className="w-full mt-4 px-3 py-2 text-lg text-white bg-gray-700 rounded-lg" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            {openOrg && (
                <div className="fixed mt-8 inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%] max-h-[95%] overflow-auto hide-scrollbar">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update Organisation Details</h2>
                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenOrg(false)}>Close</button>
                        </div>
                        <form className="flex flex-col gap-4">
                            <div className="w-full flex flex-col md:flex-row gap-2">
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="phone" className="text-lg font-semibold">Phone</label>
                                    <input type="number" placeholder="Enter you phone" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <label htmlFor="website" className="text-lg font-semibold">Website</label>
                                    <input type="text" placeholder="Enter website link" className="border-2 px-3 py-2 rounded-lg" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="address" className="text-lg font-semibold">Address</label>
                                <input type="text" placeholder="Enter you street" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2">
                                <input type="text" placeholder="Enter you city" className="w-1/2 border-2 px-3 py-2 rounded-lg" />
                                <input type="text" placeholder="Enter you state" className="w-1/2 border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="w-full flex flex-col md:flex-row gap-2">
                                <input type="text" placeholder="Enter you country" className="w-1/2 border-2 px-3 py-2 rounded-lg" />
                                <input type="text" placeholder="Enter you postal code" className="w-1/2 border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <button className="w-full mt-4 px-3 py-2 text-lg text-white bg-gray-700 rounded-lg" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            {openPassword && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update Password</h2>
                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenPassword(false)}>Close</button>
                        </div>
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <label htmlFor="oldPassword" className="text-lg font-semibold">Old Passowrd</label>
                                <input type="text" placeholder="Enter your old password" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="newPassword" className="text-lg font-semibold">New Passowrd</label>
                                <input type="text" placeholder="Enter your new password" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="confirmPassword" className="text-lg font-semibold">Confirm Passowrd</label>
                                <input type="number" placeholder="Again enter your new password" className="border-2 px-3 py-2 rounded-lg" />
                            </div>
                            <button className="w-full mt-4 px-3 py-2 text-lg text-white bg-gray-700 rounded-lg" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            {openDelete && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update Password</h2>
                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenDelete(false)}>Close</button>
                        </div>
                        <p className="text-lg italic text-gray-500">This will deactivate your account and delete all your cards. You may Reactivate by contacting the admin</p>
                        <div className="w-full flex gap-2">
                            <button className="w-1/2 mt-4 px-3 py-2 text-lg text-white bg-red-500 rounded-lg">Yes I am sure</button>
                            <button className="w-1/2 mt-4 px-3 py-2 text-lg text-black border-2 border-gray-700 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center gap-6">
                <div className="sidebar basis-1/4 hidden lg:block">
                    <div className="flex w-full min-h-[80vh] px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                        <div className="flex w-full flex-col justify-between mt-6">
                            <nav className="flex flex-col justify-center gap-4">
                                <h1 className="mx-4 text-2xl font-bold capitalize">Welcome {user?.name}</h1>

                                <hr className="my-2 border-gray-400 " />

                                <Link
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    to="/dashboard"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                    <span className="mx-4 font-medium">Dashboard</span>
                                </Link>
                                <Link
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    to="/billing"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                                    </svg>
                                    <span className="mx-4 font-medium">Billing</span>
                                </Link>
                                <Link
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    to="/report"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                    <span className="mx-4 font-medium">Report</span>
                                </Link>
                                <Link
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    to="/donation"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" stroke="currentColor">
                                        <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="mx-4 font-medium">Donate</span>
                                </Link>
                            </nav>
                            <button onClick={() => { }} className='flex justify-center items-center gap-4 px-4 py-2 bg-black hover:bg-gray-700 rounded-md'>
                                <p className="text-white text-md">Log Out</p>
                                <span><IoIosLogOut className="object-cover text-white mx-2 rounded-full h-5 w-5" /></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="main basis-full md:basis-3/4">
                    <div className="max-h-[85vh] overflow-auto hide-scrollbar pt-24 pb-12">
                        <div className="w-full px-8 py-4 lg:mt-2 bg-white rounded-lg shadow-lg">
                            <div className="flex -mt-16 justify-end">
                                <img
                                    className="object-cover w-20 h-20 border-4 border-blue-400 rounded-full"
                                    alt={user?.name}
                                    src={user?.image}
                                />
                            </div>
                            <h2 className="mt-2 text-xl font-semibold text-gray-800 md:mt-0">
                                {user?.name}
                            </h2>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p className="mt-2 text-md font-semibold">Email: <span className="mt-2 text-sm text-gray-600">{user?.email}</span></p>
                                    <p className="mt-2 text-md font-semibold">Phone: <span className="mt-2 text-sm text-gray-600">{user?.phone}</span></p>
                                </div>
                                <button className="text-md bg-white underline">Edit Profile</button>
                            </div>
                        </div>
                        <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                            <div className="flex justify-between">
                                <h1 className="text-lg font-semibold">Billing Address</h1>
                                <button className="text-md bg-white underline">Edit</button>
                            </div>
                            <p className="mt-2 text-md font-semibold">Street: <span className="mt-2 text-sm text-gray-600">{user?.billingAddress.street}</span></p>
                            <p className="mt-2 text-md font-semibold">City: <span className="mt-2 text-sm text-gray-600">{user?.billingAddress.city}</span></p>
                            <p className="mt-2 text-md font-semibold">State: <span className="mt-2 text-sm text-gray-600">{user?.billingAddress.state}</span></p>
                            <p className="mt-2 text-md font-semibold">Postal Code: <span className="mt-2 text-sm text-gray-600">{user?.billingAddress.postalCode}</span></p>
                            <p className="mt-2 text-md font-semibold">Country: <span className="mt-2 text-sm text-gray-600">{user?.billingAddress.country}</span></p>
                        </div>
                        {user?.role === "org" && (
                            <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">Organisation Details</h1>
                                    <button className="text-md bg-white underline">Edit</button>
                                </div>
                                <p className="mt-2 text-md font-semibold">website: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.website}</span></p>
                                <p className="mt-2 text-md font-semibold">Phone: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.phone}</span></p>
                                <h2 className="text-md font-semibold">Address</h2>
                                <p className="mt-2 text-md font-semibold">Street: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.address.street}</span></p>
                                <p className="mt-2 text-md font-semibold">City: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.address.city}</span></p>
                                <p className="mt-2 text-md font-semibold">State: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.address.state}</span></p>
                                <p className="mt-2 text-md font-semibold">Postal Code: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.address.postalCode}</span></p>
                                <p className="mt-2 text-md font-semibold">Country: <span className="mt-2 text-sm text-gray-600">{user?.orgDetails.address.country}</span></p>
                            </div>
                        )}
                        <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                            <h1 className="text-lg font-semibold">Privacy Settings</h1>
                            <p className="mt-2 text-gray-500 italic">You can reset your password here</p>
                            <button className="mt-2 border-2 border-gray-500 text-md text-gray-500 bg-white px-3 py-2 rounded-lg">Reset Password</button>
                        </div>
                        <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                            <h1 className="text-lg font-semibold">Account Actions</h1>
                            <p className="mt-2 text-gray-500 italic">Caution: Account deactictivation will lead to deletion of all cards with no further recovery</p>
                            <button className="mt-2 border-2 border-red-500 text-center px-3 py-2 rounded-lg text-white bg-red-500">Deactivate Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
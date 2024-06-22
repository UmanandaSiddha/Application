import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { User } from "../../types/types";
import axios from "axios";
import { AllUsersResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>();

    const gotUsers = async () => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/users/all`, { withCredentials: true });
            setUsers(data.users);
            const localUsers = {
                created: Date.now() + 30 * 1000,
                data: data.users,
            }
            window.localStorage.setItem("all_users", JSON.stringify(localUsers));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const userData = window.localStorage.getItem("all_users");
        if (userData) {
            if (JSON.parse(userData)?.created < Date.now()) {
                window.localStorage.removeItem("all_users");
                gotUsers();
            } else {
                setUsers(JSON.parse(userData).data);
            }
        } else {
            gotUsers();
        }
    }, []);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Users
                        </h4>
                            <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="Search User..."
                                    className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                                />
                                <button className="border-2 rounded-md px-3 py-2 border-black dark:border-white">
                                    <svg
                                        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                            fill=""
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                            </div>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => { }} className="bg-slate-600 text-white py-2 px-4 rounded-md">Prev</button>
                            <p className="text-md font-semibold">1 / 10</p>
                            <button onClick={() => { }} className="bg-slate-600 text-white py-2 px-4 rounded-md">Next</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-3 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Role</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Account</p>
                        </div>
                    </div>

                    {users?.map((user, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/user-details?id=${user._id}`)}
                        >
                            <div className="col-span-3 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="h-12.5 w-15 rounded-md hidden items-center sm:flex">
                                        {user.image ? (
                                            <img className="h-15 w-15 rounded-full" src={user.image} alt={user.name} />
                                        ) : (
                                            <p className="h-15 w-15 rounded-full flex items-center text-2xl font-semibold bg-slate-300 dark:bg-slate-500 justify-center">
                                                {user.name.charAt(0).toUpperCase()}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm text-black dark:text-white">
                                        {user.name}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-3 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {user.email}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.role.toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-meta-3">{user.accountType.toUpperCase()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Users;
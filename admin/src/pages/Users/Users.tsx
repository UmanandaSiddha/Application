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
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState("");
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredUsers: 1,
        totalUsers: 1
    });

    const gotUsers = async (url: string) => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(url, { withCredentials: true });
            setUsers(data.users);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredUsers: data.filteredUsersCount,
                totalUsers: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        let link = `${import.meta.env.VITE_BASE_URL}/admin/users/all?keyword=${keyword}&page=${counts.currentPage}`;
        if (role) {
            link += `&role=${role}`;
        }
        gotUsers(link);
    }, [keyword, counts.currentPage, role]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Users
                        </h4>
                        <div className="flex items-center justify-center">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                                placeholder="Search User..."
                                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                            />
                        </div>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredUsers / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredUsers / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-evenly items-center py-6 px-4 md:px-6 xl:px-7.5">
                        <div>
                            <select
                                className="text-black px-3 py-2 rounded-md"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                            >
                                <option value="">All</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="org">Org</option>
                            </select>
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
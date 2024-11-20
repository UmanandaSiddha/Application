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
    const [filter, setFilter] = useState({
        keyword: "",
        role: "",
        verified: true,
        blocked: false,
        deactivated: false,
        accountType: "",
    });
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredUsers: 1,
        totalUsers: 1
    });
    const [loading, setLoading] = useState(false);

    const gotUsers = async (url: string) => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(url, { withCredentials: true });
            setUsers(data.users);
            setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredUsers: data.filteredUsersCount,
                totalUsers: data.count
            }));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setUsers([]);
        }
    }

    useEffect(() => {
        const queryParams = [
            `keyword=${filter.keyword}`,
            `page=${counts.currentPage}`,
            filter.role && `role=${filter.role}`,
            filter.accountType && `accountType=${filter.accountType}`,
            `isVerified=${filter.verified}`,
            `isBlocked=${filter.blocked}`,
            `isDeactivated=${filter.deactivated}`
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/admin/users/all?${queryParams}`;
            gotUsers(link);
            setLoading(false);
        }, 1000);


        return () => clearTimeout(delayDebounce);

    }, [filter, counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Users ( {filter ? counts.filteredUsers : counts.totalUsers} )
                        </h4>
                        <div className="flex items-center justify-center">
                            <input
                                type="text"
                                value={filter.keyword}
                                onChange={(e) => {
                                    setFilter({ ...filter, keyword: e.target.value });
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

                    <div className="flex flex-wrap justify-evenly items-center space-y-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <div className="inline-flex items-center cursor-pointer gap-4">
                            <select
                                className="text-black px-3 py-2 rounded-md border-2"
                                value={filter.role}
                                onChange={(e) => {
                                    setFilter({ ...filter, role: e.target.value });
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                            >
                                <option value="">ALL</option>
                                <option value="admin">ADMIN</option>
                                <option value="user">USER</option>
                                <option value="org">ORG</option>
                            </select>
                            <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Role</label>
                        </div>

                        <div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filter.verified}
                                    className="sr-only peer"
                                    onChange={() => {
                                        setFilter(prev => ({
                                            ...prev,
                                            verified: !prev.verified
                                        }));
                                        setCounts({ ...counts, currentPage: 1 });
                                    }}
                                />
                                <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Verified</span>
                            </label>
                        </div>

                        <div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filter.blocked}
                                    className="sr-only peer"
                                    onChange={() => {
                                        setFilter(prev => ({
                                            ...prev,
                                            blocked: !prev.blocked
                                        }));
                                        setCounts({ ...counts, currentPage: 1 });
                                    }}
                                />
                                <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Blocked</span>
                            </label>
                        </div>

                        <div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filter.deactivated}
                                    className="sr-only peer"
                                    onChange={() => {
                                        setFilter(prev => ({
                                            ...prev,
                                            deactivated: !prev.deactivated
                                        }));
                                        setCounts({ ...counts, currentPage: 1 });
                                    }}
                                />
                                <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Deactivated</span>
                            </label>
                        </div>

                        <div className="inline-flex items-center cursor-pointer gap-4">
                            <select
                                className="text-black px-3 py-2 rounded-md border-2"
                                value={filter.accountType}
                                onChange={(e) => {
                                    setFilter({ ...filter, accountType: e.target.value });
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                            >
                                <option value="">ALL</option>
                                <option value="email">EMAIL</option>
                                <option value="google">GOOGLE</option>
                                <option value="hybrid">HYBRID</option>
                            </select>
                            <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Account</label>
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

                    {loading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                            <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : (
                        <>
                            {users?.map((user, key) => (
                                <div
                                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                    key={key}
                                    onClick={() => navigate(`/users/details?id=${user._id}`)}
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
                        </>
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Users;
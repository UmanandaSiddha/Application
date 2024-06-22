import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AllTransactionsResponse, UserResponse } from "../../types/api-types";
import axios from "axios";
import { Transaction, User } from "../../types/types";
import CardsChart from "../../components/Charts/CardsChart";

const UserDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [user, setUser] = useState<User>();
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [total, setTotal] = useState<number | null>(0);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/users/${id}`, { withCredentials: true });
            setUser(data.user);
            const localUser = {
                created: Date.now() + 30 * 1000,
                data: data.user,
            }
            window.localStorage.setItem("current_user", JSON.stringify(localUser));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchTrsanctions = async () => {
        try {
            const { data }: { data: AllTransactionsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/transactions/user/${id}`, { withCredentials: true });
            setTransactions(data.transactions);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleRoleChange = async () => {
        if (selectedOption === "") {
            toast.warning("Select a Role");
            return;
        }
        if (selectedOption === user?.role) {
            toast.warning("Selecetd Role already exists");
            return;
        }
        try {
            const { data }: { data: { message: string }} = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/${id}`, {role: selectedOption}, { withCredentials: true });
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleCardsChange = async () => {
        if (!total || total === 0) {
            toast.warning("Enter Cards Number");
            return;
        }
        try {
            const { data }: { data: { message: string }} = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/card/${id}`, {total}, { withCredentials: true });
            toast.success(data.message);
            window.localStorage.removeItem("current_user");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleFreeAccess = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/free/access/${id}`, {data: "random"}, { withCredentials: true });
            setUser(data.user);
            window.localStorage.removeItem("current_user");
            const localUser = {
                created: Date.now() + 30 * 1000,
                data: data.user,
            }
            window.localStorage.setItem("current_user", JSON.stringify(localUser));
            toast.success("Free Access granted");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const userData = window.localStorage.getItem("current_user");
        if (userData) {
            if (JSON.parse(userData)?.created < Date.now()) {
                window.localStorage.removeItem("current_user");
                gotUser();
            } else {
                setUser(JSON.parse(userData).data);
                if (JSON.parse(userData).data?._id !== id) {
                    gotUser();
                }
            }
        } else {
            gotUser();
        }
        fetchTrsanctions();
    }, [id]);

    return (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-3">
                <div className="flex flex-col gap-1">
                    {user?.image ? (
                        <img className="h-15 w-15 rounded-full mb-4" src={user.image} alt={user.name} />
                    ) : (
                        <p className="h-15 w-15 mb-4 rounded-full flex items-center text-2xl font-semibold bg-slate-300 dark:bg-slate-500 justify-center">
                            {user?.name.charAt(0).toUpperCase()}
                        </p>
                    )}
                    <p>Id: {user?._id}</p>
                    <p className="text-2xl">billing address and org details later</p>
                    <p>Name - {user?.name}</p>
                    <p>Email - {user?.email}</p>
                    <p>Cards - {user?.cards.created} / {user?.cards.total}</p>
                    <p>Role - {user?.role.toUpperCase()}</p>
                    <p>Account Type - {user?.accountType.toUpperCase()}</p>
                    <p>Free Plan - {user?.freePlan?.status.toString().toUpperCase()}</p>
                    <p>Verified - {String(user?.isVerified).toUpperCase()}</p>
                    <p>Blocked - {String(user?.isBlocked).toUpperCase()}</p>
                    <p>Deactivated - {String(user?.isDeactivated).toUpperCase()}</p>
                    <p>Login Attempts - {user?.loginAttempt.count}</p>
                    <p>Last Attempt - {user?.loginAttempt.time ? String(new Date(user?.loginAttempt.time).toDateString()) : "Not Available"}</p>
                    <p>Active Plan - {user?.activePlan?._id}</p>
                    <p>Plan Status - {user?.activePlan?.status}</p>
                    <p>{(user?.activePlan?.status === "cancelled" && (new Date(user?.activePlan?.currentEnd) > new Date(Date.now()))) ? "Valid Till" : "Next Billing"}
                        - {user?.activePlan?.currentEnd ? String(new Date(user?.activePlan?.currentEnd).toDateString()) : "Not Available"}</p>
                    <p>Google Id - {user?.googleId === "GoogleID" ? "Not Set Yet" : user?.googleId}</p>
                    <p>Account Created - {String(new Date(user?.createdAt!).toDateString())}</p>
                    <p>Account Upadated - {String(new Date(user?.updatedAt!).toDateString())}</p>
                </div>
                <div className="flex flex-col gap-4">

                    <CardsChart />

                    <div className="flex flex-row gap-2 bg-transparent dark:bg-form-input">
                        <select
                            value={selectedOption}
                            onChange={(e) => {
                                setSelectedOption(e.target.value);
                                changeTextColor();
                            }}
                            className={`w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                                }`}
                        >
                            <option value="" disabled className="text-body dark:text-bodydark">SELECT ROLE</option>
                            <option value="admin" className="text-body dark:text-bodydark">ADMIN</option>
                            <option value="user" className="text-body dark:text-bodydark">USER</option>
                            <option value="org" className="text-body dark:text-bodydark"> ORG</option>
                        </select>

                        <button onClick={handleRoleChange} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Update Role
                        </button>
                    </div>

                    <div className="flex flex-row gap-2">
                        <input
                            type="number"
                            value={total === null ? '' : total}
                            onChange={(e) => setTotal(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                            placeholder="Enter Cards"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button type="button" onClick={handleCardsChange} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Update Cards
                        </button>
                    </div>

                    <button onClick={handleFreeAccess} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Give Free Access
                    </button>
                </div>
            </div>

            {(transactions?.length! > 0) ? (
                <div className="flex flex-col gap-10 my-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                Transactions
                            </h4>
                            <div className="flex justify-center items-center space-x-4">
                                <button onClick={() => { }} className="bg-slate-600 text-white py-2 px-4 rounded-md">Prev</button>
                                <p className="text-md font-semibold">1 / 10</p>
                                <button onClick={() => { }} className="bg-slate-600 text-white py-2 px-4 rounded-md">Next</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="font-medium">Payment Id</p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="font-medium">Amount</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Period</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Status</p>
                            </div>
                        </div>

                        {transactions?.map((transaction, key) => (
                            <div
                                className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                key={key}
                            >
                                <div className="col-span-2 flex items-center">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-sm text-black dark:text-white">
                                            {transaction?.razorpayPaymentId}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-sm text-black dark:text-white">
                                            {transaction?.amount}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-sm text-black dark:text-white">
                                            {String(new Date(transaction.end).toDateString())} - {String(new Date(transaction.start).toDateString())}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-sm text-black dark:text-white">
                                            {transaction.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-semibold my-10 text-center">No Transactions yet!</p>
            )}
        </DefaultLayout>
    )
}

export default UserDetails;
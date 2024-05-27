import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserResponse } from "../../types/api-types";
import axios from "axios";
import { User } from "../../types/types";
import CardsChart from "../../components/Charts/CardsChart";

const UserDetails = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const [user, setUser] = useState<User>();

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/user/${id}`, { withCredentials: true });
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
    }, [id]);

    return (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-3">
                <div className="flex flex-col gap-1">
                    <img className="h-15 w-15 rounded-full mb-4" src={user?.image} alt={user?.name} />
                    <p>Id: {user?._id}</p>
                    <p className="text-2xl">billing address and org details later</p>
                    <p>Name - {user?.name}</p>
                    <p>Email - {user?.email}</p>
                    <p>Cards - {user?.cards.created} / {user?.cards.total}</p>
                    <p>Role - {user?.role.toUpperCase()}</p>
                    <p>Account Type - {user?.accountType.toUpperCase()}</p>
                    <p>Verified - {String(user?.isVerified).toUpperCase()}</p>
                    <p>Blocked - {String(user?.isBlocked).toUpperCase()}</p>
                    <p>Deactivated - {String(user?.isDeactivated).toUpperCase()}</p>
                    <p>Donator - {String(user?.donator).toUpperCase()}</p>
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
                            <option value="ADMIN" className="text-body dark:text-bodydark">ADMIN</option>
                            <option value="USER" className="text-body dark:text-bodydark">USER</option>
                            <option value="ORG" className="text-body dark:text-bodydark"> ORG</option>
                        </select>

                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Update Role
                        </button>
                    </div>

                    <div className="flex flex-row gap-2">
                        <input
                            type="number"
                            placeholder="Enter Cards"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Update Cards
                        </button>
                    </div>

                    <div className="flex flex-row gap-2">
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Subscription
                        </button>
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Transaction
                        </button>
                    </div>

                </div>
            </div>
        </DefaultLayout>
    )
}

export default UserDetails;
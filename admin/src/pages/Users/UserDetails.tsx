import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AllCardsResponse, AllSubscriptionResponse, AllTransactionsResponse, UserResponse } from "../../types/api-types";
import axios from "axios";
import { Animal, Creator, Medical, Personal, Subscription, Transaction, Tree, User } from "../../types/types";
import CardsChart from "../../components/Charts/CardsChart";
import Loader from "../../components/Loader";
import { Loader2 } from "lucide-react";

interface CardStatsResponse {
    success: boolean;
    count: {
        botanical: number;
        individual: number;
        creator: number;
        medical: number;
        animal: number;
    }
}

type TypeOptions = "botanical" | "individual" | "medical" | "creator" | "animal";

const validTypes: TypeOptions[] = ["botanical", "individual", "medical", "creator", "animal"];

const UserDetails = () => {

    const [search, setSearch] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const typeParams = search.get('type');
    const [user, setUser] = useState<User>();
    const [type, setType] = useState<TypeOptions>(
        validTypes.includes(typeParams as TypeOptions) ? (typeParams as TypeOptions) : "botanical"
    );
    // const [type, setType] = useState<"botanical" | "individual" | "medical" | "creator" | "animal">((typeParams as "botanical" | "individual" | "medical" | "creator" | "animal") || "botanical");
    const [cards, setCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [stats, setStats] = useState({
        botanical: 0,
        individual: 0,
        creator: 0,
        medical: 0,
        animal: 0,
    });
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [total, setTotal] = useState<number | null>(0);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [cardsCount, setCardsCount] = useState({
        currentPage: 1,
        resultPerPage: 1,
        totalCards: 1
    });
    const [subscriptionCount, setSubscriptionCount] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredSubscriptions: 1,
        totalSubscriptions: 1
    });
    const [transactionCount, setTransactionCount] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredTransactions: 1,
        totalTransactions: 1
    });
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);
    const [transacLoading, setTransacLoading] = useState(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const gotUser = async () => {
        setLoading(true);

        const cachedUserById = window.sessionStorage.getItem('user_byId');
        if (cachedUserById) {
            const { data: cachedUser, expires, id: cachedId } = JSON.parse(cachedUserById);

            if (Date.now() < expires && cachedId === id) {
                setUser(cachedUser);
                setTotal(cachedUser.cards.total);
                setSelectedOption(cachedUser.role);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('user_byId');

        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/users/byId/${id}`, { withCredentials: true });
            setUser(data.user);
            setTotal(data.user.cards.total);
            setSelectedOption(data.user.role);
            const payload = {
                id,
                data: data.user,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem("user_byId", JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    }

    const fetchSubscriptions = async (url: string) => {
        try {
            const { data }: { data: AllSubscriptionResponse } = await axios.get(url, { withCredentials: true });
            setSubscriptions(data.subscriptions);
            setSubscriptionCount({
                ...subscriptionCount,
                resultPerPage: data.resultPerPage,
                filteredSubscriptions: data.filteredSubscriptionsCount,
                totalSubscriptions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchTrsanctions = async (url: string) => {
        try {
            const { data }: { data: AllTransactionsResponse } = await axios.get(url, { withCredentials: true });
            setTransactions(data.transactions);
            setTransactionCount({
                ...transactionCount,
                resultPerPage: data.resultPerPage,
                filteredTransactions: data.filteredTransactionsCount,
                totalTransactions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchCards = async (url: string) => {
        try {
            const { data }: { data: AllCardsResponse } = await axios.get(url, { withCredentials: true });
            setCards(data.cards);
            setCardsCount({
                ...cardsCount,
                resultPerPage: data.resultPerPage,
                totalCards: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchCardStats = async (url: string) => {
        setStatsLoading(true);

        try {
            const { data }: { data: CardStatsResponse } = await axios.get(url, { withCredentials: true });
            setStats(data.count);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setStatsLoading(false);
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
            const { data }: { data: { message: string } } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/${id}`, { role: selectedOption }, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
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
            const { data }: { data: { message: string } } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/card/${id}`, { total }, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleFreeAccess = async (factor: boolean) => {
        try {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/users/free/access/${id}`;
            if (factor) {
                link = `${import.meta.env.VITE_BASE_URL}/admin/users/free/revoke/${id}`
            }

            window.sessionStorage.removeItem('user_byId');

            const { data }: { data: UserResponse } = await axios.put(link, {}, { withCredentials: true });
            setUser(data.user);
            setTotal(data.user.cards.total);
            setSelectedOption(data.user.role);
            const payload = {
                id,
                data: data.user,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem("user_byId", JSON.stringify(payload));
            toast.success(factor ? "Free Access Revoked" : "Free Access Granted");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleBlockUser = async (factor: boolean) => {
        try {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/users/block/${id}`;
            if (factor) {
                link = `${import.meta.env.VITE_BASE_URL}/admin/users/unblock/${id}`
            }
            const { data }: { data: { message: string } } = await axios.put(link, {}, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDeactivate = async (factor: boolean) => {
        try {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/users/deactivate/${id}`;
            if (factor) {
                link = `${import.meta.env.VITE_BASE_URL}/admin/users/reactivate/${id}`
            }
            const { data }: { data: { message: string } } = await axios.put(link, {}, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpen(true);
    }

    useEffect(() => {
        gotUser();
        fetchCardStats(`${import.meta.env.VITE_BASE_URL}/admin/cards/stats/${id}`);
    }, [id]);

    useEffect(() => {
        setCardLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/cards/user/${id}?page=${transactionCount.currentPage}&type=${type}`;
            fetchCards(link);

            setCardLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [id, type, cardsCount.currentPage]);

    useEffect(() => {
        setTransacLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/transac/user/${id}?page=${transactionCount.currentPage}`;
            fetchTrsanctions(link);

            setTransacLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [id, transactionCount.currentPage]);

    useEffect(() => {
        setSubLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/sub/user/${id}?page=${subscriptionCount.currentPage}`;
            fetchSubscriptions(link);

            setSubLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [id, subscriptionCount.currentPage]);

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col gap-1">
                    {user?.image ? (
                        <img className="h-15 w-15 rounded-full mb-4" src={user.image} alt={user.name} />
                    ) : (
                        <p className="h-15 w-15 mb-4 rounded-full flex items-center text-2xl font-semibold bg-slate-300 dark:bg-slate-500 justify-center">
                            {user?.name.charAt(0).toUpperCase()}
                        </p>
                    )}
                    <p className="text-white"><span className="font-semibold">Id:</span> {user?._id}</p>
                    <p className="text-white"><span className="font-semibold">Name</span> - {user?.name}</p>
                    <p className="text-white"><span className="font-semibold">Email</span> - {user?.email}</p>
                    <p className="text-white"><span className="font-semibold">Phone</span> - {user?.phone}</p>
                    <p className="text-white"><span className="font-semibold">Cards</span> - {user?.cards.created} / {user?.cards.total}</p>
                    <p className="text-white"><span className="font-semibold">Role</span> - {user?.role.toUpperCase()}</p>

                    <p className="text-white font-semibold text-xl">Billing Address</p>
                    <p className="text-white pl-8"><span className="font-semibold">Street</span> - {user?.billingAddress?.street}</p>
                    <p className="text-white pl-8"><span className="font-semibold">City</span> - {user?.billingAddress?.city}</p>
                    <p className="text-white pl-8"><span className="font-semibold">State</span> - {user?.billingAddress?.state}</p>
                    <p className="text-white pl-8"><span className="font-semibold">Country</span> - {user?.billingAddress?.country}</p>
                    <p className="text-white pl-8"><span className="font-semibold">Postal Code</span> - {user?.billingAddress?.postalCode}</p>

                    {user?.role === "org" && (
                        <>
                            <p className="text-white font-semibold text-xl">Organisation Details</p>
                            <p className="text-white pl-8"><span className="font-semibold">Phone</span> - {user?.orgDetails?.phone}</p>
                            <p className="text-white pl-8"><span className="font-semibold">Website</span> - {user?.orgDetails?.website}</p>
                            <p className="text-white font-semibold pl-8 text-lg">Address</p>
                            <p className="text-white pl-16"><span className="font-semibold">Street</span> - {user?.orgDetails?.address?.street}</p>
                            <p className="text-white pl-16"><span className="font-semibold">City</span> - {user?.orgDetails?.address?.city}</p>
                            <p className="text-white pl-16"><span className="font-semibold">State</span> - {user?.orgDetails?.address?.state}</p>
                            <p className="text-white pl-16"><span className="font-semibold">Country</span> - {user?.orgDetails?.address?.country}</p>
                            <p className="text-white pl-16"><span className="font-semibold">Postal Code</span> - {user?.orgDetails?.address?.postalCode}</p>
                        </>
                    )}

                    <p className="text-white"><span className="font-semibold">Account Type</span> - {user?.accountType.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Free Plan</span> - {user?.freePlan?.status.toString().toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Verified</span> - {String(user?.isVerified).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Blocked</span> - {String(user?.isBlocked).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Deactivated</span> - {String(user?.isDeactivated).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Login Attempts</span> - {user?.loginAttempt.count}</p>
                    <p className="text-white"><span className="font-semibold">Last Attempt</span> - {user?.loginAttempt.time ? String(new Date(user?.loginAttempt.time).toDateString()) : "Not Available"}</p>
                    <p className="text-white"><span className="font-semibold">Active Plan</span> - {user?.freePlan.status ? "FREE PLAN ( " + user.freePlan.type.toUpperCase() + " )" : user?.activePlan?._id}</p>
                    <p className="text-white"><span className="font-semibold">Plan Status</span> - {user?.activePlan?.status}</p>
                    <p className="text-white">
                        <span className="font-semibold">
                            {(user?.activePlan?.status === "cancelled" && (new Date(user?.activePlan?.currentEnd) > new Date(Date.now()))) ? "Valid Till" : "Next Billing"}
                        </span>
                        - {user?.activePlan?.currentEnd ? String(new Date(user?.activePlan?.currentEnd).toDateString()) : "Not Available"}</p>
                    <p className="text-white"><span className="font-semibold">Google Id</span> - {user?.googleId === "GoogleID" ? "Not Set Yet" : user?.googleId}</p>
                    <p className="text-white"><span className="font-semibold">Account Created</span> - {String(new Date(user?.createdAt!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Account Upadated</span> - {String(new Date(user?.updatedAt!).toDateString())}</p>
                </div>
                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this user?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={() => handleDeactivate(user?.isDeactivated ? true : false)}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-white rounded-lg" onClick={() => setOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4">

                    {statsLoading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <Loader2 size={60} />
                        </div>
                    ) : (
                        <CardsChart stats={stats} total={user?.cards.total!} />
                    )}

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

                    <button onClick={() => handleFreeAccess(user?.freePlan.status && user.freePlan.type === "custom" ? true : false)} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        {(user?.freePlan.status && user.freePlan.type === "custom") ? "Revoke Free Access" : "Grant Free Access"}
                    </button>

                    <button onClick={() => handleBlockUser(user?.isBlocked ? true : false)} className="flex w-full justify-center rounded bg-slate-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        {user?.isBlocked ? "Unblock User" : "Block User"}
                    </button>

                    <button
                        onClick={() => {
                            if (user?.isDeactivated) {
                                handleDeactivate(true)
                            } else {
                                setOpen(true);
                            }
                        }}
                        className={`flex w-full justify-center rounded ${user?.isDeactivated ? "bg-green-500" : "bg-red-500"} p-3 font-medium text-gray hover:bg-opacity-90`}
                    >
                        {user?.isDeactivated ? "Reactivate User" : "Deactivate User"}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-10 my-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white capitalize">
                            {type} Cards
                        </h4>
                        <div className="flex items-center justify-center">
                            <select
                                className="text-black px-3 py-2 rounded-md"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value as "botanical" | "individual" | "medical" | "creator" | "animal");
                                    setSearch({ type: e.target.value as "botanical" | "individual" | "medical" | "creator" | "animal" }, { replace: true });
                                }}
                            >
                                <option value="botanical">Botanical</option>
                                <option value="animal">Animal</option>
                                <option value="medical">Medical</option>
                                <option value="creator">Creator</option>
                                <option value="individual">Individual</option>
                            </select>
                        </div>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCardsCount({ ...cardsCount, currentPage: cardsCount.currentPage - 1 })}
                                disabled={cardsCount.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">
                                {cardsCount.currentPage} / {Math.ceil(cardsCount.totalCards / cardsCount.resultPerPage)}
                            </p>
                            <button
                                onClick={() => setCardsCount({ ...cardsCount, currentPage: cardsCount.currentPage + 1 })}
                                disabled={cardsCount.currentPage === Math.ceil(cardsCount.totalCards / cardsCount.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Card Type</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Created</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Creator</p>
                        </div>
                    </div>

                    {cardLoading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                            <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : (
                        <>
                            {cards?.map((card, key) => (
                                <div
                                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                    key={key}
                                    onClick={() => navigate(`/cards/details?id=${card._id}&type=${type}`)}
                                >
                                    <div className="col-span-2 flex items-center">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <p className="text-sm text-black dark:text-white">
                                                {card.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 hidden items-center sm:flex">
                                        <p className="text-sm text-black dark:text-white">
                                            {type.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="col-span-2 hidden items-center sm:flex">
                                        <p className="text-sm text-black dark:text-white">
                                            {String(new Date(card.createdAt).toLocaleDateString())}
                                        </p>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <p
                                            className="text-sm text-meta-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/card-details?id=${card.user._id}`);
                                            }}
                                        >
                                            {card.user?._id}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {(subscriptions?.length! > 0) ? (
                <div className="flex flex-col gap-10 my-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                Subscriptions
                            </h4>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => setSubscriptionCount({ ...subscriptionCount, currentPage: subscriptionCount.currentPage - 1 })}
                                    disabled={subscriptionCount.currentPage === 1}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Prev
                                </button>
                                <p className="text-md font-semibold truncate">
                                    {subscriptionCount.currentPage} / {Math.ceil(subscriptionCount.filteredSubscriptions / subscriptionCount.resultPerPage)}
                                </p>
                                <button
                                    onClick={() => setSubscriptionCount({ ...subscriptionCount, currentPage: subscriptionCount.currentPage + 1 })}
                                    disabled={subscriptionCount.currentPage === Math.ceil(subscriptionCount.filteredSubscriptions / subscriptionCount.resultPerPage)}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Period</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Billing Cycle</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Next Billing</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Method</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Status</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Type</p>
                            </div>
                        </div>

                        {subLoading ? (
                            <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                                <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                            </div>
                        ) : (
                            <>
                                {subscriptions?.map((sub, key) => (
                                    <div
                                        className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                        key={key}
                                        onClick={() => navigate(`/subscriptions/details?id=${sub._id}`)}
                                    >
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(sub.start).toLocaleDateString())} - {String(new Date(sub.end).toLocaleDateString())}
                                                {sub._id === user?.activePlan._id ? (<span className="hidden lg:inline-block bg-green-300 text-black rounded-full px-2 py-1 ml-3 font-semibold">Latest</span>) : null}
                                            </p>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{String(new Date(sub.currentStart).toLocaleDateString())} - {String(new Date(sub.currentEnd).toLocaleDateString())}</p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(sub.nextBilling).toLocaleDateString())}
                                            </p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {sub?.paymentMethod?.methodType?.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{sub.status.toUpperCase()}</p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-meta-3">
                                                {sub.subscriptionType.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-semibold my-10 text-center">No Subscriptions yet!</p>
            )}

            {(transactions?.length! > 0) ? (
                <div className="flex flex-col gap-10 my-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                Transactions
                            </h4>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => setTransactionCount({ ...transactionCount, currentPage: transactionCount.currentPage - 1 })}
                                    disabled={transactionCount.currentPage === 1}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Prev
                                </button>
                                <p className="text-md font-semibold truncate">
                                    {transactionCount.currentPage} / {Math.ceil(transactionCount.filteredTransactions / transactionCount.resultPerPage)}
                                </p>
                                <button
                                    onClick={() => setTransactionCount({ ...transactionCount, currentPage: transactionCount.currentPage + 1 })}
                                    disabled={transactionCount.currentPage === Math.ceil(transactionCount.filteredTransactions / transactionCount.resultPerPage)}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Period</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Date</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">For</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Amount</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Status</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Method</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Type</p>
                            </div>
                        </div>

                        {transacLoading ? (
                            <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                                <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                            </div>
                        ) : (
                            <>
                                {transactions?.map((transac, key) => (
                                    <div
                                        className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                        key={key}
                                        onClick={() => navigate(`/transactions/details?id=${transac._id}`)}
                                    >
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{String(new Date(transac.start).toLocaleDateString())} - {String(new Date(transac.end).toLocaleDateString())}</p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(transac.createdAt).toLocaleDateString())}
                                            </p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {transac.transactionFor.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{transac.currency === "INR" ? "₹" : "$"} {transac.amount}</p>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{transac.status.toUpperCase()}</p>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{transac?.paymentMethod?.methodType?.toUpperCase()}</p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-meta-3">
                                                {transac.transactionType.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-semibold my-10 text-center">No Transactions yet!</p>
            )}
        </DefaultLayout>
    )
}

export default UserDetails;
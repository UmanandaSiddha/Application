import axios from "axios";
import { useEffect, useState } from "react";
import { Subscription } from "@/types/types";
import TransactionComponent from "@/components/rest/transaction";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Link } from "react-router-dom";

const BillingPage = () => {
    const [subscription, setSubscription] = useState<Subscription | undefined>();

    const { user } = useSelector((state: RootState) => state.userReducer);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/sub/subscription/user`,
                    { withCredentials: true }
                );
                setSubscription(data.subscription);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSubscription();
    }, []);

    const handleSubscription = (id: string) => {
        try {
            console.log(id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {(!user?.isVerified) && (
                <>
                    <div className="flex justify-center mt-[1rem]">
                        <h1 className="font-Philosopher font-bold text-3xl">
                            Transactions
                        </h1>
                    </div>
                    <div className="flex justify-center mt-[2rem]">
                        <div className="font-Philosopher underline text-red-400">
                            <Link to="/profile">
                                Go to your Profile and verify your Email
                            </Link>
                        </div>
                    </div>
                </>
            )}
            {(user?.isVerified && !subscription) && (
                <>
                    <div className="flex justify-center mt-[1rem]">
                        <h1 className="font-Philosopher font-bold text-3xl">
                            Transactions
                        </h1>
                    </div>
                    <div className="flex justify-center mt-[1rem]">
                        <div className="font-Philosopher underline">
                            <Link to="/plans">
                                Buy a subscription to view your transactions here
                            </Link>
                        </div>
                    </div>
                </>
            )}
            {user?.isVerified && subscription && (
                <>
                    <div className="flex justify-center mb-[2rem] lg:w-full">
                        <div className="flex flex-col lg:flex-col lg:w-[50%] justify-center">
                            <div className="lg:flex lg:justify-center">
                                <div className="">
                                    <div className="flex lg:justify-center justify-center mt-4 lg:mt-4 lg:ml-6">
                                        <h1 className="text-2xl font-semibold font-Philosopher underline">
                                            Current Plan:
                                        </h1>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <div className="pt-4 w-full flex justify-center">
                                            <div className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%]">
                                                <div className="flex flex-row py-4">
                                                    <div className="basis-1/2 flex justify-end lg:justify-start lg:ml-4 font-Kanit ">
                                                        <div className="">
                                                            <div className="">
                                                                <p className="text-2xl font-bold">
                                                                    {subscription?.planId.name}
                                                                </p>
                                                                <div className="">
                                                                    <p className="text-blue-400 bg-blue-200 px-1 py-1 rounded-lg">
                                                                        Plan Validity: 30 Days
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="basis-1/2">
                                                        <div className="">
                                                            <div className="font-Kanit text-lg flex justify-end pr-4 text-slate-400">
                                                                Price
                                                            </div>
                                                            <div className="font-Kanit text-xl flex justify-end pr-4 text-black">
                                                                {subscription?.planId.amount}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row font-Kanit pl-3">
                                                    <div className="basis-2/5 flex justify-start pl-2">
                                                        Next Billing Date:
                                                    </div>
                                                    <div className="basis-3/5 flex justify-start pl-2">
                                                        {String(
                                                            new Date(
                                                                subscription?.nextBilling!
                                                            ).toDateString()
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row font-Kanit pl-3">
                                                    <div className="basis-2/5 flex justify-start pl-2">
                                                        Service Period:
                                                    </div>
                                                    <div className="basis-3/5 flex justify-start pl-2">
                                                        {String(
                                                            new Date(subscription?.start!).toDateString()
                                                        )}{" "}
                                                        -{" "}
                                                        {String(
                                                            new Date(subscription?.end!).toDateString()
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row font-Kanit pl-3">
                                                    <div className="basis-2/5 flex justify-start pl-2">
                                                        Subcription Status:
                                                    </div>
                                                    <div className="basis-3/5 flex justify-start pl-2">
                                                        {subscription?.status}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row font-Kanit pl-3">
                                                    <div className="basis-2/5 flex justify-start pl-2">
                                                        Remaining Payment Cycle:
                                                    </div>
                                                    <div className="basis-3/5 flex justify-start pl-2">
                                                        {subscription?.remainingCount}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row font-Kanit pl-3">
                                                    <div className="basis-2/5 flex justify-start pl-2">
                                                        Update Payment Method Here:
                                                    </div>
                                                    <div className="basis-3/5 flex justify-start pl-2">
                                                        <a
                                                            href={subscription?.shortUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="no-underline hover:underline"
                                                        >
                                                            {subscription?.shortUrl}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="w-full py-3 flex justify-center">
                                                    <button
                                                        className="w-[90%] py-2 bg-blue-500 text-white rounded-sm font-Kanit hover:cursor-pointer hover:bg-blue-400"
                                                        onClick={() =>
                                                            handleSubscription(subscription?._id!)
                                                        }
                                                    >
                                                        {subscription?.status === "paused"
                                                            ? "Resume"
                                                            : "Cancel"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:flex lg:justify-center lg:w-full">
                                <div className="pt-4 lg:flex lg:justify-center">
                                    <TransactionComponent />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default BillingPage;

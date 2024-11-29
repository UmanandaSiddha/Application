import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { donatorNotExist } from "@/redux/reducer/donatorReducer";
import { useState } from "react";

const DonatorDashboard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

    const { donator } = useSelector(
        (state: RootState) => state.donatorReducer
    );

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/donate/logout`, { withCredentials: true });
            toast.success("Logged out successfully");
            dispatch(donatorNotExist());
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLogoutLoading(false);
    }

    return (
        <div className="flex flex-col items-center w-[80%] mx-auto mt-20 pb-10 rounded-3xl shadow-[0px_4px_53px_-8px_rgba(0,_0,_0,_0.2)]">
            <div className="mt-3 text-4xl   lg:text-5xl font-semibold text-gray-800 dark:text-white">
                <span className="text-purple-500">Welcome</span> {donator?.name ? donator.name : donator?.email}
            </div>
            <p className="mt-4 pb-10 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400">
                We are very thankful for your donations.
            </p>
            <div className="w-[80%] flex flex-col gap-10 items-center">
                <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-lg rounded-xl bg-white">
                    <Link to="/donation/checkout" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                        <span className="text-xl font-semibold underline">Donate Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Checkout page for Donations.</p>
                </div>
                <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-lg rounded-xl bg-white">
                    <Link to="/donation/billing" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                        <span className="text-xl font-semibold underline">Your Donations</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Check out your Recurring / OneTime Donations.</p>
                </div>
                <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-lg rounded-xl bg-white">
                    <Link to="/contact" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                        <span className="text-xl font-semibold underline">Contact Us</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Tell us what's on your mind</p>
                </div>
                <div className="flex items-center  gap-x-4">
                    <button onClick={() => navigate("/")} className="w-1/7 px-6 py-3 text-lg text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                        Home
                    </button>
                    <button disabled={logoutLoading} onClick={handleLogout} className="w-1/7 px-6 py-3 text-lg text-white transition-colors duration-200 bg-gray-500 rounded-lg shrink-0 sm:w-auto hover:bg-gray-600 dark:hover:bg-gray-500 dark:bg-gray-600">
                        {logoutLoading ? "Hold on..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DonatorDashboard;
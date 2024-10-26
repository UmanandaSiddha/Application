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
        <section className="mx-auto w-full md:w-[85%] dark:bg-gray-900 ">
            <div className="flex min-h-screen px-6 py-12 mx-auto ml-4 w-full">
                <div className="w-full">
                    
                    <div className="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-gray-800 dark:text-white">
                        Welcome, {donator?.name ? donator.name : donator?.email}
                    </div>
                    <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400">
                        We are very thankful for your donations.
                    </p>

                    <div className="mt-10 space-y-6 w-full">
                        <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-xl rounded-xl bg-white">
                            <Link to="/donation/checkout" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span className="text-xl font-semibold underline">Donate Now</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Checkout page for Donations.</p>
                        </div>

                        <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-xl rounded-xl bg-white">
                            <Link to="/donation/billing" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span className="text-xl font-semibold underline">Your Donations</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Check out your Recurring / OneTime Donations.</p>
                        </div>

                        <div className="border w-[90%] lg:w-[60%] px-6 py-2 shadow-xl rounded-xl bg-white">
                            <Link to="/contact" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span className="text-xl font-semibold underline">Contact Us</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Tell us what's on your mind</p>
                        </div>

                        <div className="flex items-center my-16 gap-x-4">
                            <button onClick={() => navigate("/")} className="w-1/7 px-6 py-3 text-lg text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                Home
                            </button>

                            <button disabled={logoutLoading} onClick={handleLogout} className="w-1/7 px-6 py-3 text-lg text-white transition-colors duration-200 bg-gray-500 rounded-lg shrink-0 sm:w-auto hover:bg-gray-600 dark:hover:bg-gray-500 dark:bg-gray-600">
                                {logoutLoading ? "Hold on..." : "Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DonatorDashboard;
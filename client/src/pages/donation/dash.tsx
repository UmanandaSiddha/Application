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
        <section className="bg-white dark:bg-gray-900 ">
            <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
                <div>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Welcome {donator?.name ? donator.name : donator?.email}</h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">We are very thankful for your donations.</p>

                    <div className="flex items-center mt-6 gap-x-3">
                        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-1/3 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                            </svg>
                            <span>Go back</span>
                        </button>

                        <button onClick={() => navigate("/")} className="w-1/3 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                            Take me home
                        </button>

                        <button disabled={logoutLoading} onClick={handleLogout} className="w-1/3 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-gray-500 rounded-lg shrink-0 sm:w-auto hover:bg-gray-600 dark:hover:bg-gray-500 dark:bg-gray-600">
                            {logoutLoading ? "Hold on..." : "Logout"}
                        </button>
                    </div>

                    <div className="mt-10 space-y-6">
                        <div>
                            <Link to="/donation/checkout" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span>Donate Now</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Checkout page for Donations.</p>
                        </div>

                        <div>
                            <Link to="/billing?type=donation" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span>Your Donations</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Check out your Recurring / OneTime Donations.</p>
                        </div>

                        <div>
                            <Link to="/contact-us" className="inline-flex items-center text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                                <span>Contact Us</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Tell us what's on your mind</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DonatorDashboard;
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { donatorNotExist } from "@/redux/reducer/donatorReducer";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const DonatorDashboard = () => {

    const dispatch = useDispatch();
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

    const navigations = [
        {
            label: "Donate Now",
            path: "/donation/checkout"
        },
        {
            label: "Your Donations",
            path: "/donation/billing"
        },
        {
            label: "Contact Us",
            path: "/contact"
        }
    ];

    const { donator } = useSelector(
        (state: RootState) => state.donatorReducer
    );

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/donate/logout`, { withCredentials: true });
            dispatch(donatorNotExist());
            toast.success("Logged out successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLogoutLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>Voolata | Donation Dashboard</title>
                <meta name="description" content={`This is the donation dashboard page of Voolata`} />
                <meta name="keywords" content="donation, dashboard, voolata" />
            </Helmet>
            <div className="pt-6 pb-12 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
                <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-2 rounded-lg bg-white shadow-xl">
                    <div className="p-4 pt-4 sm:pt-6 md:pt-8 mx-auto w-full md:w-[70%] lg:w-[65%]">
                        <h1 className="text-2xl text-center sm:text-3xl md:text-4xl lg:text-4xl  md:text-center font-bold">
                            Welcome, {donator?.name ? donator.name : donator?.email}
                        </h1>
                        <p className="text-sm text-center sm:text-lg mt-4 leading-tight md:text-center text-slate-500">
                            We are very thankful for your donations.
                        </p>
                    </div>
                    <div className="p-4 pb-10 sm:pb-16 md:pb-20 flex flex-col justify-center items-center gap-4">
                        {navigations.map((nav, index) => (
                            <Link
                                to={nav.path}
                                key={index}
                                className={`w-full flex justify-center items-center gap-4 sm:w-[70%] md:w-[60%] lg:w-[55%] bg-purple-200 hover:bg-purple-500 hover:text-white text-purple-700 border border-purple-200 font-semibold py-3 sm:py-4 rounded-lg text-lg sm:text-xl`}
                            >
                                {nav.label}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            className="w-full sm:w-[70%] md:w-[60%] lg:w-[55%] border-2 border-black text-black hover:text-white hover:bg-black font-semibold py-3 sm:py-4 rounded-lg text-lg sm:text-xl"
                        >
                            {logoutLoading ? (
                                <><Loader2 className="animate-spin" />Hold on...</>
                            ) : "Logout"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DonatorDashboard;
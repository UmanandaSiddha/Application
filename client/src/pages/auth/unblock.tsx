import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UnBlockPage = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [blockData, setBlockData] = useState({
        isBlocked: false,
        count: 0,
        last: ""
    });

    const fetchBlocked = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/block/${id}`, { withCredentials: true });
            setBlockData({
                isBlocked: data.user.isBlocked ? true : false,
                count: data.user.loginAttempt.count,
                last: data.user.loginAttempt.time.toDateString()
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlocked();
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/unblock/${id}`, { withCredentials: true });
            toast.success("Successfully Unblocked");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <Helmet>
                <title>Voolata | Unblock</title>
                <meta name="description" content={`This is the unblock page of Voolata`} />
                <meta name="keywords" content="unblock, voolata" />
            </Helmet>
            <div className="pt-6 pb-12 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
                <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-2 rounded-lg bg-white shadow-xl">
                    <div className="p-4 pt-4 sm:pt-6 md:pt-8 mx-auto w-full md:w-[70%] lg:w-[65%]">
                        <h1 className="text-2xl text-center sm:text-3xl md:text-4xl lg:text-4xl  md:text-center font-bold">
                            {blockData.isBlocked ? "Account blocked due to suspicious activity" : "Account Not Blocked"}
                        </h1>
                        {blockData.isBlocked && (
                            <p className="text-sm text-center sm:text-lg mt-4 leading-tight md:text-center text-slate-500">
                                Reason: Multiple Failed Login Attempts were made from this account.
                            </p>
                        )}
                    </div>
                    {blockData.isBlocked && (
                        <div className="p-4 pb-10 sm:pb-16 md:pb-20 flex flex-col justify-center items-center gap-4">
                            <p className="text-center text-sm sm:text-base lg:text-lg font-medium text-gray-700">
                                It is advised to reset your password regularly.
                            </p>
                            <p className="text-center text-sm sm:text-base lg:text-lg font-medium text-gray-700">
                                Last Login Attempt: <span className="font-bold">{blockData.last}</span>
                            </p>
                            <p className="text-center text-sm sm:text-base lg:text-lg font-medium text-gray-700">
                                Total Attempts: <span className="font-bold">{blockData.count}</span>
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full sm:w-auto px-6 py-3 border-2 border-black text-black font-semibold rounded-lg transition duration-300 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    Unblock Me
                                </button>
                                <Link
                                    to="/report"
                                    className="w-full sm:w-auto text-center text-black font-semibold border-2 border-black rounded-lg px-6 py-3 transition duration-300 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    Report if not you
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UnBlockPage;
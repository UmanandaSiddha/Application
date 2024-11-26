import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const UnBlockPage = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [isMe, setIsMe] = useState<boolean>(false);

    const fetchBlocked = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/tofo later/${id}`, { isMe }, { withCredentials: true });
            if (data.user.isBlocked) {

            } else {
                toast.error("This account is not blocked");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlocked();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/user/unblock/${id}`, { isMe }, { withCredentials: true });
            toast.success("Successfully Unblocked");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className=" flex flex-col justify-center items-center ">
            {id ? (
                <div className="flex flex-col justify-center items-center ">
                    <img src="./blocked_img.jpg" alt="" className="lg:w-[800px] max-lg:w-[500px]" />
                    <h1 className="text-xl font-semibold mb-2 text-center">You Are Blocked due to failed login attempts</h1>
                    <form className="flex flex-col justify-center items-center gap-4 p-6 w-full max-w-md" onSubmit={handleSubmit}>
                        <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                                <input
                                    id="offers"
                                    checked={isMe}
                                    onChange={() => setIsMe(!isMe)}
                                    name="offers"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="text-xl leading-6">
                                <label htmlFor="offers" className="font-medium text-gray-900">
                                    It was Me
                                </label>
                            </div>
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300" type="submit">Submit</button>
                    </form>
                    <Link to="/report" className="text-lg mt-6 text-center text-blue-500 hover:underline">Report if it was not you</Link>
                </div>


            ) : (
                <div className="flex flex-col justify-center mt-20">
                    <img src="./broken_link.jpg" alt="" className="lg:w-[600px] max-lg:w-[400px]" />
                    <p className="text-xl text-center text-red-500">Seems you have entered a broken link</p>
                </div>
            )}
        </div>
    )
}

export default UnBlockPage;
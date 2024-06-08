import { userExist, userNotExist } from "@/redux/reducer/userReducer";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const UnBlockPage = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = search.get("id");
    const [isMe, setIsMe] = useState<boolean>(false);

    // we can fetch the failed login attempts details in here

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(isMe);
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/unblock/${id}`, { isMe }, { withCredentials: true });
            toast.success("Unblocked");
            dispatch(userExist(data.user));
            navigate("/dashboard");
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            {id ? (
                <>
                    <h1 className="text-xl font-semibold mb-6 text-center">You Are Blocked due to failed login attempts</h1>
                    <form className="flex flex-col justify-center items-center gap-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
                        <div className="flex justify-center items-center gap-4 w-full lg:m-6 ">
                            <input type="checkbox" checked={isMe} onChange={() => setIsMe(!isMe)} className="form-checkbox h-5 w-5 text-red-600" />
                            <p className="text-lg">It was Me</p>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300" type="submit">Submit</button>
                    </form>
                    <Link to="/report" className="text-lg mt-6 text-center text-blue-500 hover:underline">Report if it was not you</Link>
                </>
            ) : (
                <p className="text-xl text-center text-red-500">Seems you have entered a broken link</p>
            )}
        </div>
    )
}

export default UnBlockPage;
import { userExist, userNotExist } from "@/redux/reducer/userReducer";
import { UserResponse } from "@/types/api-types";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
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
        <div>
            {id ? (
                <>
                    <h1>You Are Blocked due to failed login attempts</h1>
                    <form className="flex flex-col justify-center items-center gap-4" onSubmit={handleSubmit}>
                        <div className="flex justify-center items-center gap-4">
                            <input type="checkbox" checked={isMe} onChange={() => setIsMe(!isMe)} />
                            <p className="text-lg">It was Me</p>
                        </div>
                        <button className="bg-red-500 p-2 m-2 text-white rounded-lg" type="submit">Submit</button>
                    </form>
                    <h1>Report if it was not you</h1>
                </>
            ) : (
                <p>Seems you have Entered a broken link</p>
            )}
        </div>
    )
}

export default UnBlockPage;
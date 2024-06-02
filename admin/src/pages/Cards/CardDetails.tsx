import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserResponse } from "../../types/api-types";
import axios from "axios";
import { User } from "../../types/types";
import CardsChart from "../../components/Charts/CardsChart";

const CardDetails = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const [user, setUser] = useState<User>();

    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/user/${id}`, { withCredentials: true });
            setUser(data.user);
            const localUser = {
                created: Date.now() + 30 * 1000,
                data: data.user,
            }
            window.localStorage.setItem("current_user", JSON.stringify(localUser));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const userData = window.localStorage.getItem("current_user");
        if (userData) {
            if (JSON.parse(userData)?.created < Date.now()) {
                window.localStorage.removeItem("current_user");
                gotUser();
            } else {
                setUser(JSON.parse(userData).data);
                if (JSON.parse(userData).data?._id !== id) {
                    gotUser();
                }
            }
        } else {
            gotUser();
        }
    }, [id]);

    return (
        <div>CardDetails</div>
    )
}

export default CardDetails;
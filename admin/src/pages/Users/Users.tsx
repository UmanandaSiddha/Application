import UserTable from "../../components/Tables/UserTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { User } from "../../types/types";
import axios from "axios";
import { AllUsersResponse } from "../../types/api-types";
import { toast } from "react-toastify";

const Users = () => {

    const [users, setUsers] = useState<User[]>();

    const gotUsers = async () => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/users`, { withCredentials: true });
            setUsers(data.users);
            const localUsers = {
                created: Date.now() + 30*1000,
                data: data.users,
            }
            window.localStorage.setItem("all_users", JSON.stringify(localUsers));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const userData = window.localStorage.getItem("all_users");
        if (userData) {
            if (JSON.parse(userData)?.created < Date.now()) {
                window.localStorage.removeItem("all_users");
                gotUsers();
            } else {
                setUsers(JSON.parse(userData).data);
            }
        } else {
            gotUsers();
        }
    }, []);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <UserTable users={users!} />
            </div>
        </DefaultLayout>
    )
}

export default Users;
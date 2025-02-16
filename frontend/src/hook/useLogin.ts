import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../config/apiConfig";
import { loginUser } from "../actions/users/user.actions";
import { userExist, userNotExist } from "../store/reducer/userReducer";

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const login = async (email: string, password: string, redirectTo: string = "/dashboard") => {
        if (!email || !password) {
            toast.warning("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            dispatch(userExist(data.user));
            toast.success("Logged In!");
            navigate(redirectTo, { replace: true });
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string, onSuccess?: () => void) => {
        if (!email) {
            toast.warning("Enter your email");
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.post("/user/password/forgot", { email }, { withCredentials: true });
            toast.success(data.message);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error sending reset email");
        } finally {
            setLoading(false);
        }
    };

    return { login, forgotPassword, loading };
};
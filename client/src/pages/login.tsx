import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, loginUser } from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { getGoogleAuthUrl } from "@/lib/google";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const [forgotEmail, setForgotEmail] = useState<string>();
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginLoading(true)
        const loginData = {
            email: userData.email,
            password: userData.password,
        }
        try {
            const data = await loginUser(loginData);
            navigate("/dashboard");
            dispatch(userExist(data.user));
            toast.success("Logged In!");
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setLoginLoading(false)
    };

    const onForgot = async () => {
        try {
            const data = await forgotPassword({ email: forgotEmail });
            setOpen(false)
            toast.success(data.message);
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-[350px] gap-2"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                        name="password"
                        type="text"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        placeholder="Enter your password"
                        className="w-[350px] gap-2"
                    />
                </div>
                <Button className="w-[350px]" type="submit" disabled={loginLoading}>{loginLoading ? "Logging..." : "Login"}</Button>
            </form>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link">Forgot Password?</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Enter Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            name="forgot email"
                            type="text"
                            value={userData.password}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-[350px] gap-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={onForgot} className="w-[350px]" type="submit">Send Email</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button><a href={getGoogleAuthUrl()}>Sign in with Google</a></Button>
            <Button variant="link"><Link to="/register">Don't have an account? Register</Link></Button>
        </div>
    )
}
export default Login;
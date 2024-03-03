import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { useState } from "react";
import { getGoogleAuthUrl } from "@/lib/google";
import { Label } from "@/components/ui/label";

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState<any>();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(reader.result);
                } else {
                    console.log("Failed to read the file.");
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegisterLoading(true);
        const registerData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            image: avatar
        }

        try {
            const data = await registerUser(registerData);
            dispatch(userExist(data.user));
            toast.success("User Registered!")
            navigate("/dashboard");
        } catch (error: any) {
            dispatch(userNotExist());
            toast.error(error.response.data.message);
        }
        setRegisterLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        name="name"
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-[350px] gap-2"
                    />
                </div>
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
                <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <Input
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        placeholder="Profile Image"
                        className="w-[350px] gap-2"
                    />
                </div>
                <Button className="w-[350px]" type="submit" disabled={registerLoading}>{registerLoading ? "Registering..." : "Register"}</Button>
            </form>
            <Button className="mt-4"><a href={getGoogleAuthUrl()}>Sign Up with Google</a></Button>
            <Button variant="link"><Link to="/login">Already have an account? Login</Link></Button>
        </div>
    )
}

export default Register;

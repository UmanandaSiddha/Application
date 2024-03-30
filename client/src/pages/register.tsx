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
import Compressor from 'compressorjs';

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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // const file = e.target.files![0];
        const file: File | null = e.target.files![0];
        if (file instanceof Blob) {
            // const reader = new FileReader();
            // reader.onload = () => {
            //     if (reader.readyState === 2) {
            //         setAvatar(reader.result);
            //     } else {
            //         console.log("Failed to read the file.");
            //     }
            // };
            // reader.readAsDataURL(file);

            const compressImage = async (file: File) => {
                try {
                    return await new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.6, 
                            maxWidth: 800, 
                            maxHeight: 600, 
                            success(result) {
                                resolve(result);
                            },
                            error(err) {
                                reject(err);
                            },
                        });
                    });
                } catch (error) {
                    console.error('Error compressing image:', error);
                    throw error;
                }
            };

            try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        setAvatar(reader.result);
                    } else {
                        console.error("Failed to read the compressed file.");
                    }
                };
                reader.readAsDataURL(compressedFile as Blob);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
    
            // const reader = new FileReader();
            // reader.onload = async () => {
            //     try {
            //         const compressedFile = await compressImage(file);
            //         setAvatar(compressedFile);
            //     } catch (error) {
            //         console.error('Failed to compress the image:', error);
            //     }
            // };
            // reader.readAsDataURL(file);
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

        console.log(registerData)

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

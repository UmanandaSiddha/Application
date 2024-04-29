import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getAllPayments } from "@/redux/api/paymentApi";
import { deleteUser, updateUserProfile, requestVerifyUser, updatePassword } from "@/redux/api/userApi";
import { AccordionDemo } from "@/components/rest/acordon";
import { paymentExist } from "@/redux/reducer/paymentReducer";

import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { UserResponse } from "@/types/api-types";
import { Label } from "@/components/ui/label";

const Profile = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [openSep, setOpenSep] = useState<boolean>(false);
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<any>();

    const dispatch = useDispatch();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { payments } = useSelector(
        (state: RootState) => state.paymentReducer
    );

    const gotPayment = async () => {
        if (user?.isVerified) {
            try {
                const data = await getAllPayments();
                dispatch(paymentExist(data.payments));
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
    }

    useEffect(() => {
        gotPayment();
    }, []);

    const formSchema = useMemo(() => z.object({
        name: z.string(),
    }), []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => ({
            name: user?.name,
        }), [user]),
    });

    const sepForm = useForm({
        defaultValues: useMemo(() => ({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }), []),
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const updateData = {
            name: values.name,
            image: avatar,
        }
        console.log(updateData);
        try {
            const data = await updateUserProfile(updateData);
            dispatch(userExist(data.user));
            setOpen(false);
            toast.success("Profile Updated Successfully")
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    };

    const handleRequestVerify = useCallback(async () => {
        setVerifyLoading(true);
        try {
            await requestVerifyUser();
            toast.success("Email Sent  Successfully")
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setVerifyLoading(false);
    }, []);

    const handleDeleteAccount = useCallback(async () => {
        setDeleteLoading(true);
        try {
            await deleteUser();
            dispatch(userNotExist());
            toast.success("Account Deleted Successfully")
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setDeleteLoading(false);
    }, [dispatch]);

    const handleResetPassword = useCallback(async (resetValues: any) => {
        const resetDate = {
            oldPassword: resetValues.oldPassword,
            newPassword: resetValues.newPassword,
            confirmPassword: resetValues.confirmPassword
        }
        try {
            if (user?.accountType === "google") {
                const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
                const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/set/password`, resetDate, config);
                dispatch(userExist(data.user));
            } else {
                const data = await updatePassword(resetDate);
                dispatch(userExist(data.user));
            }
            setOpenSep(false);
            toast.success("Password Updated Successfully");
        } catch (error: any) {
            setOpenSep(false);
            toast.error(error.response.data.message);
        }
    }, [dispatch]);

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

    return (
        loading ? (
            <Loader />
        ) : (
            <div className='flex flex-row justify-center gap-8 items-center mt-8'>
                {
                    user ? (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center border border-primary p-4 gap-5">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={user.image} alt={user._id} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p>UserId: {user._id}</p>
                                <p>Name : {user.name}</p>
                                <p>Email: {user.email}</p>
                                {!user?.isVerified && (
                                    <div className="flex flex-col justify-center items-center space-y-4">
                                        <p className="text-red-600 font-semibold">You are not verified</p>
                                        <Button onClick={handleRequestVerify} disabled={verifyLoading}>{verifyLoading ? "Sending Email..." : "Verify Email"}</Button>
                                    </div>
                                )}
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Edit Profile</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form className="space-y-8">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input className="w-[350px]" placeholder="Enter your Name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                            </form>
                                        </Form>
                                        <DialogFooter>
                                            <Button onClick={form.handleSubmit(onSubmit)} className="w-[350px]" type="submit">Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                {/* <Button onClick={handleResetPassword} variant="outline">Reset Password</Button> */}
                                <Dialog open={openSep} onOpenChange={setOpenSep}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            {user.accountType === "google" ? "Set Password" : "Reset Password"}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {user.accountType === "google" ? "Set Password" : "Reset Password"}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <Form {...sepForm}>
                                            <form className="space-y-8">
                                                {user.accountType !== "google" && (
                                                    <FormField
                                                        control={sepForm.control}
                                                        name="oldPassword"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Old Password</FormLabel>
                                                                <FormControl>
                                                                    <Input className="w-[350px]" placeholder="Enter old password" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                                <FormField
                                                    control={sepForm.control}
                                                    name="newPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>New Password</FormLabel>
                                                            <FormControl>
                                                                <Input className="w-[350px]" placeholder="Enter new passowrd" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={sepForm.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Confirm Password</FormLabel>
                                                            <FormControl>
                                                                <Input className="w-[350px]" placeholder="Enter new password again" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </form>
                                        </Form>
                                        <DialogFooter>
                                            <Button onClick={sepForm.handleSubmit(handleResetPassword)} className="w-[350px]" type="submit">Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={handleDeleteAccount} variant="destructive" disabled={deleteLoading}>{deleteLoading ? "Deleting Account..." : "Delete Account"}</Button>
                            </div>
                            <div className="w-[400px] border border-primary p-4">
                                <h1 className="text-3xl font-semibold">Payment History</h1>
                                {payments ? (
                                    <AccordionDemo />
                                ) : (
                                    <p>No Payments till now</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>You are not logged in</p>
                        </div>
                    )
                }
            </div>
        )
    )
}

export default Profile;

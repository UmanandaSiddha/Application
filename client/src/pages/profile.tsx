import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
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
import { userExist, userNotExist } from "../redux/reducer/userReducer";
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

// import BackButton from '../components/BackButton'

const Profile = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [openSep, setOpenSep] = useState<boolean>(false);
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
        email: z.string()
            .email({
                message: "Please enter a valid email address."
            }),
    }), []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => ({
            name: user?.name,
            email: user?.email,
        }), [user]),
    });

    const sepForm = useForm({
        defaultValues: useMemo(() => ({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }), []),
    })

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        const updateData = {
            name: values.name,
            email: values.email,
        }
        try {
            const data = await updateUserProfile(updateData);
            dispatch(userExist(data.user));
            setOpen(false);
            toast.success("Profile Updated Successfully")
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    }, [formSchema, dispatch]);

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
            const data = await updatePassword(resetDate);
            dispatch(userExist(data.user));
            setOpenSep(false);
            toast.success("Password Updated Successfully")
        } catch (error: any) {
            setOpenSep(false);
            toast.error(error.response.data.message);
        }
    }, [dispatch]);

    return (
        loading ? (
            <Loader />
        ) : (
            <div className='flex flex-row justify-center gap-8 items-center mt-8'>
                {/* <BackButton/> */}
                {
                    user ? (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center border border-primary p-4 gap-5">
                                <div className="bg-slate-300 w-14 h-14 flex items-center justify-center rounded-full">
                                    <p className="text-xl font-semibold">{user.name.charAt(0)}</p>
                                </div>
                                <p>UserId: {user._id}</p>
                                <p>Name : {user.name}</p>
                                <p>Email: {user.email}</p>
                                {!user?.isVerified && (
                                    <div className="flex flex-col justify-center items-center space-y-4">
                                        <p className="text-red-600 font-semibold">You are not verified</p>
                                        <button onClick={handleRequestVerify} disabled={verifyLoading}>{verifyLoading ? "Sending Email..." : "Verify Email"}</button>
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
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input className="w-[350px]" placeholder="Enter your Email" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
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
                                        <Button variant="outline">Reset Password</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Reset Password</DialogTitle>
                                        </DialogHeader>
                                        <Form {...sepForm}>
                                            <form className="space-y-8">
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

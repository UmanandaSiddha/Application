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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, loginUser } from "@/redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from 'react-toastify';
import { RootState } from "@/redux/store";
import { getGoogleAuthUrl } from "@/lib/google";


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const formSchema = useMemo(() => z.object({
        email: z.string()
            .email({
                message: "Please enter a valid email address."
            }),
        password: z.string()
            .min(8, {
                message: "Pssword must be at least 8 characters.",
            }),
    }), []);

    const forgotFormSchema = useMemo(() => z.object({
        email: z.string()
            .email({
                message: "Please enter a valid email address."
            }),
    }), []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => ({
            email: "",
            password: "",
        }), []),
    });

    const forgotForm = useForm<z.infer<typeof forgotFormSchema>>({
        resolver: zodResolver(forgotFormSchema),
        defaultValues: useMemo(() => ({
            email: "",
        }), []),
    });

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        setLoginLoading(true)
        const loginData = {
            email: values.email,
            password: values.password,
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
    }, [navigate, dispatch, formSchema]);

    const onForgot = useCallback(async (values: z.infer<typeof forgotFormSchema>) => {
        try {
            const data = await forgotPassword({ email: values.email});
            setOpen(false)
            toast.success(data.message);
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    }, [forgotFormSchema]);

    useEffect(() => {
        if (!loading) {
            form.reset();
            forgotForm.reset();
        }
    }, [loading, form, forgotForm]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input className="w-[350px]" placeholder="Enter your Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-[350px]" type="submit" disabled={loginLoading}>{loginLoading ? "Logging..." : "Login"}</Button>
                </form>
            </Form>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link">Forgot Password?</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Enter Email</DialogTitle>
                    </DialogHeader>
                    <Form {...forgotForm}>
                        <form className="space-y-8">
                            <FormField
                                control={forgotForm.control}
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
                        <Button onClick={forgotForm.handleSubmit(onForgot)} className="w-[350px]" type="submit">Send Email</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button><a href={getGoogleAuthUrl()}>Sign in with Google</a></Button>
            <Button variant="link"><Link to="/register">Don't have an account? Register</Link></Button>
        </div>
    )
}
export default Login;
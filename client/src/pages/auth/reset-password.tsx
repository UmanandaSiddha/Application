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
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { resetPassword } from "@/redux/api/userApi";

import { toast } from "react-toastify";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const token = search.get("token");

    const formSchema = z.object({
        newPassword: z.string()
            .min(8, {
                message: "Pssword must be at least 8 characters.",
            }),
        confirmPassword: z.string()
            .min(8, {
                message: "Pssword must be at least 8 characters.",
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const resetPass = {
            password: values.newPassword,
            confirmPassword: values.newPassword,
        }
        try {
            const data = await resetPassword(resetPass, token!);
            dispatch(userExist(data.user));
            toast.success("Password Reset Successful")
            navigate("/dashboard");
        } catch (error: any) {
            dispatch(userNotExist())
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-8">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input className="w-[350px]" placeholder="Enter your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
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
                    <Button className="w-[350px]" type="submit">Login</Button>
                </form>
            </Form>
        </div>
    )
}

export default ResetPassword;
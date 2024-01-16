import { useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { inputs } from "@/types/form-inputs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { createTree } from "@/redux/api/treeApi";

import { toast } from 'react-toastify';

const CreateTree = () => {

    const navigate = useNavigate();

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: {
            name: "",
            scientificName: "",
            treeType: "",
            location: "",
            description: "",
            features: "",
            maintenance: "",
            benefits: "",
            funFact: "",
        },
    });

    const onSubmit = async (values: any) => {
        const treeData = {
            name: values.name,
            scientificName: values.scientificName,
            treeType: values.treeType,
            location: values.location,
            description: values.description,
            features: values.features,
            maintenance: values.maintenance,
            benefits: values.benefits,
            funFact: values.funFact,
            user: user?._id
        }
        try {
            await createTree(treeData);
            toast.success("Tree VCard Created")
            navigate("/dashboard/tree");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mb-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {
                        inputs.map((input) => (
                            <FormField
                                key={input.name}
                                control={form.control}
                                name={input.name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{input.label}</FormLabel>
                                        <FormControl>
                                            <Input className="w-[350px]" placeholder={input.text} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))
                    }
                    <Button className="w-[350px]" type="submit">Save</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateTree;
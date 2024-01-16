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
import { useNavigate } from "react-router-dom";
import { inputs } from "@/types/form-inputs";
import { updateTree } from "@/redux/api/treeApi";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";

import { toast } from "react-toastify";

const formSchema = z.object({
    name: z.string().min(2),
    scientificName: z.string().min(2),
    treeType: z.string().min(2),
    location: z.string().min(2),
    description: z.string().min(2),
    features: z.string().min(2),
    maintenance: z.string().min(2),
    benefits: z.string().min(2),
    funFact: z.string().min(2),
});

const UpdateTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("treeId");

    const { trus, loading } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: trus?.name || "",
            scientificName: trus?.scientificName || "",
            treeType: trus?.treeType || "",
            location: trus?.location || "",
            description: trus?.description || "",
            features: trus?.features || "",
            maintenance: trus?.maintenance || "",
            benefits: trus?.benefits || "",
            funFact: trus?.funFact || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        }
        try {
            const data = await updateTree(treeData, id!);
            console.log(data);
            toast.success("Tree VCard Updated");
            navigate(`/dashboard/tree/view?treeId=${id}`);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mb-8">
            {loading ? (
                <Loader />
            ) : (
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
                        <Button className="w-[350px]" type="submit">Update</Button>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default UpdateTree;
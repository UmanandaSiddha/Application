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
import { useNavigate, useSearchParams } from "react-router-dom";
import { inputs } from "@/types/form-inputs";
import { toast } from 'react-toastify';
import { SingleTreeResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { createTree, updateTree } from "@/redux/api/treeApi";

const CreateTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("treeId");

    const [treeData, setTreeData] = useState<SingleTreeResponse | null>(null);
    const [treeLoading, setTreeLoading] = useState<boolean>(false);
    const isTree = !!treeData;

    useEffect(() => {
        const fetchData = async () => {
            if (id && !isTree) {
                try {
                    const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=tree`, { withCredentials: true });
                    setTreeData(data);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
        };

        fetchData();
    }, [id, isTree]);

    const form = useForm({
        defaultValues: {
            name: treeData?.tree.name || "",
            scientificName: treeData?.tree.scientificName || "",
            treeType: treeData?.tree.treeType || "",
            location: treeData?.tree.location || "",
            description: treeData?.tree.description || "",
            features: treeData?.tree.features || "",
            maintenance: treeData?.tree.maintenance || "",
            benefits: treeData?.tree.benefits || "",
            funFact: treeData?.tree.funFact || "",
        },
    });

    const onSubmit = async (values: any) => {
        setTreeLoading(true);
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
            if (isTree) {
                await updateTree(treeData, id!);
                toast.success("Tree VCard Updated");
            } else {
                await createTree(treeData);
                toast.success("Tree VCard Created");
            }
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setTreeLoading(false);
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
                    <Button className="w-[350px]" type="submit" disabled={treeLoading}>{treeLoading ? "Saving..." : "Save"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateTree;

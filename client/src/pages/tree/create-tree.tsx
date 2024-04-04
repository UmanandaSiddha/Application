import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { inputs } from "@/types/form-inputs";
import { RootState } from "../../redux/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingleTreeResponse } from "@/types/api-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { treeNotTemp, treeTemp } from "@/redux/reducer/treeReducer";

const CreateTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("treeId");
    const dispatch = useDispatch();

    const [isTree, setIsTree] = useState<boolean>(id ? true : false);
    const [treeLaoding, setTreeLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { trus } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const gotTree = async () => {
        if (id) {
            try {
                const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id!}?type=tree`, { withCredentials: true });
                dispatch(treeTemp(data.vCard));
                setIsTree(true);
            } catch (error: any) {
                toast.error(error.response.data.message);
                dispatch(treeNotTemp());
            }
        }
    }

    useEffect(() => {
        gotTree();
    }, []);

    const form = useForm({
        defaultValues: {
            name: isTree ? trus?.name : "",
            scientificName: isTree ? trus?.scientificName : "",
            treeType: isTree ? trus?.treeType : "",
            location: isTree ?  trus?.location : "",
            description: isTree ?  trus?.description : "",
            features: isTree ? trus?.features : "",
            maintenance: isTree ? trus?.maintenance : "",
            benefits: isTree ? trus?.benefits : "",
            funFact: isTree ? trus?.funFact : "",
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
            user: user?._id
        }
        try {
            if (isTree) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`, treeData, { withCredentials: true });
                toast.success("Tree VCard Updated");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=tree`, treeData, { withCredentials: true });
                toast.success("Tree VCard Created");
            }
            if (isPaid || user?.role === "admin") {
                navigate(-1);
            } else {
                navigate("/plans");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            if (!isPaid && user?.role !== "admin") {
                navigate("/plans");
            }
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
                    <Button className="w-[350px]" type="submit" disabled={treeLaoding}>{treeLaoding ? "Saving..." : "Save"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateTree;
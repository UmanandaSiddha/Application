import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "../../../redux/store";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { creatorInput } from "@/types/form-inputs";
import { creatorNotTemp, creatorTemp } from "@/redux/reducer/creatorreducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SingleCreatorResponse } from "@/types/api-types";
import axios from "axios";

const CreatorInput = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("creatorId");
    const [isCreator, setIsCreator] = useState<boolean>(id ? true : false);

    const { creator } = useSelector(
        (state: RootState) => state.creatorReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotCreator = async () => {
        if (id) {
            try {
                const { data }: { data: SingleCreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/creator/detailed/${id!}`, { withCredentials: true });
                dispatch(creatorTemp(data.vCard));
                setIsCreator(true);
            } catch (error: any) {
                toast.error(error.response.data.message);
                dispatch(creatorNotTemp());
            }
        }
    }

    useEffect(() => {
        gotCreator();
    }, []);

    const [arrData, setArrData] = useState<any | null>(isCreator ? creator?.links : creatorInput);
    const [open, setOpen] = useState(false);
    const [otherName, setOtherName] = useState("");
    const [otherLink, setOtherLink] = useState("");
    const [creatorLoading, setCreatorLoading] = useState<boolean>(false);

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const dispatch = useDispatch();

    const handleAdd = () => {
        setArrData([...arrData, {
            name: otherLink,
            label: otherName,
            text: "",
        }]);
        setOpen(false);
        setOtherLink("");
        setOtherName("");
    }

    const handleChange = (event: any, index: number) => {
        setArrData((prevData: any) => [
            ...prevData.slice(0, index),
            {
                ...prevData[index],
                [event.target.name]: event.target.value,
            },
            ...prevData.slice(index + 1),
        ]);
    }

    const form = useForm({
        defaultValues: {
            name: isCreator ? creator?.name : "",
        }
    })

    const onSubmit = async (values: any) => {
        setCreatorLoading(true);
        let final = [];
        for (let i = 0; i < arrData.length; i++) {
            const element = {
                label: arrData[i].label,
                name: arrData[i].name
            }
            final.push(element);
        }
        const creatorData = {
            name: values.name,
            links: final,
            user: user?._id,
        }
        try {
            if (isCreator) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=creator`, creatorData, { withCredentials: true });
                toast.success("Creator VCard Updated");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=creator`, creatorData, { withCredentials: true });
                toast.success("Creator VCard Created");
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
        setCreatorLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center my-8">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input className="w-[350px]" placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col space-y-2">
                        <h1 className="font-semibold">Social Media Profiles</h1>
                        {arrData && (
                            <div className="flex flex-col space-y-2">
                                {arrData.map((arr: any, index: number) => (
                                    <div key={index} className="flex w-[350px] justify-center items-center gap-2">
                                        <Label>{arr.label}</Label>
                                        <Input
                                            name="name"
                                            value={arr.name}
                                            onChange={(e) => handleChange(e, index)}
                                            placeholder={arr.text}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-[350px] my-4">Add more</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Another Social Profile</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={otherName}
                                            onChange={(e) => setOtherName(e.target.value)}
                                            placeholder="Enter Social Media Platform"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="link" className="text-right">
                                            Link
                                        </Label>
                                        <Input
                                            id="link"
                                            value={otherLink}
                                            onChange={(e) => setOtherLink(e.target.value)}
                                            placeholder="Enter Social Media Link"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAdd} type="submit">Add</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Button className="my-4 w-[350px]" disabled={creatorLoading}>{creatorLoading ? "Creating..." : "Create"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreatorInput;
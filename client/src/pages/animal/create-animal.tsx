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
import { animalInputs } from "@/types/form-inputs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { toast } from 'react-toastify';
import { SingleAnimalResponse } from "@/types/api-types";
import axios from "axios";
import { treeNotTemp } from "@/redux/reducer/treeReducer";
import { useEffect, useState } from "react";
import { animalTemp } from "@/redux/reducer/animalReducer";

const CreateAnimal = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("animalId");
    const dispatch = useDispatch();

    const [isAnimal, setIsAnimal] = useState<boolean>(id ? true : false);
    const [animalLaoding, setAnimalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { animal } = useSelector(
        (state: RootState) => state.animalReducer
    );

    const gotAnimal = async () => {
        if (id) {
            try {
                const { data }: { data: SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/animal/detailed/${id!}`, { withCredentials: true });
                dispatch(animalTemp(data.vCard));
                setIsAnimal(true);
            } catch (error: any) {
                toast.error(error.response.data.message);
                dispatch(treeNotTemp());
            }
        }
    }

    useEffect(() => {
        gotAnimal();
    }, []);

    const form = useForm({
        defaultValues: {
            species: isAnimal ? animal?.species : "",
            name: isAnimal ? animal?.name : "",
            age: isAnimal ? animal?.age : "",
            gender: isAnimal ?  animal?.gender : "",
            color: isAnimal ? animal?.color : "",
            location: isAnimal ?  animal?.location : "",
            owner: isAnimal ? animal?.owner : "",
            phone: isAnimal ? animal?.phone : "",
        },
    });

    const onSubmit = async (values: any) => {
        setAnimalLoading(true);
        const animalData = {
            species: values.species,
            name: values.name,
            age: values.age,
            gender: values.gender,
            color: values.color,
            location: values.location,
            owner: values.owner,
            phone: values.phone,
            user: user?._id
        }
        try {
            if (isAnimal) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=animal`, animalData, { withCredentials: true });
                toast.success("Animal VCard Updated");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=animal`, animalData, { withCredentials: true });
                toast.success("Animal VCard Created");
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
        setAnimalLoading(false);
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mb-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {
                        animalInputs.map((input) => (
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
                    <Button className="w-[350px]" type="submit" disabled={animalLaoding}>{animalLaoding ? "Saving..." : "Save"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateAnimal;
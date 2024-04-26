import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { animalInputs } from "@/types/form-inputs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
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
    const [animalLoading, setAnimalLoading] = useState<boolean>(false);

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

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
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
        <>
        <div className="w-full">
        <h1 className="pl-6 font-Kanit text-4xl font-bold">Animal</h1>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen -mt-20 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {animalInputs.map((input) => (
            <div
              key={input.name}
              className="flex w-full justify-center items-center gap-2"
            >
              <div className="basis-1/3 flex font-semibold justify-start items-center">
                <label htmlFor={input.name} className="font-Kanit text-base">
                  {input.label}:
                </label>
              </div>
              <div className="basis-2/3">
                <input
                  className="block py-2.5 px-0 w-full text-sm font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                  type="text"
                  id={input.name}
                  placeholder={input.text}
                  {...register(input.name, { required: true })}
                />
              </div>
              {errors[input.name] && (
                <p className="text-red-500">This field is required</p>
              )}
            </div>
          ))}
          <div className="pt-8">
            <button
              className="w-[350px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer"
              type="submit"
              disabled={animalLoading}
            >
              {animalLoading ? "Saving..." : "SAVE"}
            </button>
          </div>
        </form>
      </div>
        </>
    )
}

export default CreateAnimal;
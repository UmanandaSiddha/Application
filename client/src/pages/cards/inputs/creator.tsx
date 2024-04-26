import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
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

  const { creator } = useSelector((state: RootState) => state.creatorReducer);

  const { isPaid } = useSelector((state: RootState) => state.userReducer);

  const gotCreator = async () => {
    if (id) {
      try {
        const { data }: { data: SingleCreatorResponse } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/creator/detailed/${id!}`,
          { withCredentials: true }
        );
        dispatch(creatorTemp(data.vCard));
        setIsCreator(true);
      } catch (error: any) {
        toast.error(error.response.data.message);
        dispatch(creatorNotTemp());
      }
    }
  };

  useEffect(() => {
    gotCreator();
  }, []);

  const [arrData, setArrData] = useState<any | null>(
    isCreator ? creator?.links : creatorInput
  );
  const [open, setOpen] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [creatorLoading, setCreatorLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();

  const handleAdd = () => {
    setArrData([
      ...arrData,
      {
        name: otherLink,
        label: otherName,
        text: "",
      },
    ]);
    setOpen(false);
    setOtherLink("");
    setOtherName("");
  };

  const handleChange = (event: any, index: number) => {
    setArrData((prevData: any) => [
      ...prevData.slice(0, index),
      {
        ...prevData[index],
        [event.target.name]: event.target.value,
      },
      ...prevData.slice(index + 1),
    ]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: isCreator ? creator?.name : "",
    },
  });

  const onSubmit = async (values: any) => {
    setCreatorLoading(true);
    let final = [];
    for (let i = 0; i < arrData.length; i++) {
      const element = {
        label: arrData[i].label,
        name: arrData[i].name,
      };
      final.push(element);
    }
    const creatorData = {
      name: values.name,
      links: final,
      user: user?._id,
    };
    try {
      if (isCreator) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=creator`,
          creatorData,
          { withCredentials: true }
        );
        toast.success("Creator VCard Updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cards/new?type=creator`,
          creatorData,
          { withCredentials: true }
        );
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
  };

  function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
    if ((e.target as Element).id === "popupform") {
      setOpen(false);
    }
  }

  return (
    <>
      <div className="w-full">
        <h1 className="pl-6 font-Kanit text-4xl font-bold">Creator</h1>
      </div>
      <div className="flex flex-col justify-center items-center my-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2 flex flex-row items-center">
            <div className="basis-1/3 flex justify-start pr-4 font-Kanit text-xl pt-2">
              <label htmlFor="name" className="">
                Name:
              </label>
            </div>
            <div className="basis-2/3 ">
              <input
                className="block py-2.5 px-0 w-full text-lg font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                type="text"
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: true })}
              />
              {errors.name && <p className="text-red-500">Name is required</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-2 font-Kanit">
            <h1 className="font-semibold text-lg">Social Media Profiles</h1>
            {arrData && (
              <div className="flex flex-col space-y-2">
                {arrData.map((arr: any, index: number) => (
                  <div
                    key={index}
                    className="flex w-full justify-center items-center gap-2"
                  >
                    <div className="basis-1/3 flex justify-start">
                      <label htmlFor={`name-${index}`}>{arr.label}:</label>
                    </div>
                    <div className="basis-2/3">
                      <input
                        className="block py-2.5 px-0 w-full text-sm font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                        type="text"
                        id={`name-${index}`}
                        name="name"
                        value={arr.name}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={arr.text}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6 pt-10">
            <div className="">
              <button
                className="w-[350px] bg-black text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => setOpen(true)}
              >
                Add more
              </button>
              {open && (
                <div className="font-Kanit">
                  <div
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
                    id="popupform"
                    onClick={handleCloseForm}
                  >
                    <div className="bg-white p-8 rounded shadow-lg w-[425px]">
                      <h2 className="text-lg font-bold mb-4 flex justify-center underline">
                        Add Another Social Profile
                      </h2>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="name"
                            className="text-right text-lg font-semibold"
                          >
                            Name
                          </label>
                          <input
                            className="col-span-3 border rounded px-4 py-2 text-sm"
                            type="text"
                            id="name"
                            value={otherName}
                            onChange={(e) => setOtherName(e.target.value)}
                            placeholder="Enter Social Media Platform"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="link"
                            className="text-right text-lg font-semibold"
                          >
                            Link
                          </label>
                          <input
                            className="col-span-3 border rounded px-4 py-2 text-sm"
                            type="text"
                            id="link"
                            value={otherLink}
                            onChange={(e) => setOtherLink(e.target.value)}
                            placeholder="Enter Social Media Link"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded"
                          type="button"
                          onClick={handleAdd}
                        >
                          Add
                        </button>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                          type="button"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <button
                className="w-[350px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={creatorLoading}
              >
                {creatorLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatorInput;

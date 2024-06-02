import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  perInfo,
  emCon,
  medAdd,
  healthHistory,
  healthhabits,
  inSur,
} from "@/redux/inputs/medical-input";
import { toast } from "react-toastify";
import { medicalNotTemp, medicalTemp } from "@/redux/reducer/medicalReducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SingleMedicalResponse } from "@/types/api-types";

const MedicalInput = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("medicalId");

  const [progressBar, setProgressBar] = useState<number>(25);
  const [isMedical, setIsMedical] = useState<boolean>(id ? true : false);
  const [medicalLoading, setMedicalLoading] = useState<boolean>(false);

  const { user, isPaid } = useSelector((state: RootState) => state.userReducer);

  const { medical } = useSelector((state: RootState) => state.medicalReducer);

  const dispatch = useDispatch();

  const gotMedical = async () => {
    if (id) {
      try {
        const { data }: { data: SingleMedicalResponse } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/medical/detailed/${id!}`,
          { withCredentials: true }
        );
        dispatch(medicalTemp(data.vCard));
        setIsMedical(true);
      } catch (error: any) {
        toast.error(error.response.data.message);
        dispatch(medicalNotTemp());
      }
    }
  };

  useEffect(() => {
    gotMedical();
  }, []);

  const handleProgressForward = () => {
    setProgressBar(progressBar + 25);
  };

  const handleProgressBackward = () => {
    setProgressBar(progressBar - 25);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: medical?.personalInfo?.name || "",
      birth: medical?.personalInfo.birth || Date.now(),
      gender: medical?.personalInfo.gender || "",
      phone: medical?.personalInfo.phone || 91,
      email: medical?.personalInfo.email || "",
      emname: medical?.personalInfo.emergency.name || "",
      emrelation: medical?.personalInfo.emergency.relation || "",
      emphone: medical?.personalInfo.emergency.phone || 91,
      street: medical?.personalInfo.address.street || "",
      city: medical?.personalInfo.address.city || "",
      state: medical?.personalInfo.address.state || "",
      postal: medical?.personalInfo.address.postalCode || "",
      allergy: medical?.healthHistory.allergy || "",
      chronic: medical?.healthHistory.chronic || "",
      current: medical?.currentMedication || "",
      surgery: medical?.previousSurgeries || "",
      smoker: medical?.healthHabits.smoker || "",
      alcohol: medical?.healthHabits.alcohol || "",
      routine: medical?.healthHabits.exercise || "",
      diet: medical?.healthHabits.diet || "",
      mental: medical?.healthHabits.mentalCondition || "",
      vaccine: medical?.healthHabits.vaccinationHistory || "",
      provider: medical?.insuranceInfo.provider || "",
      policy: medical?.insuranceInfo.policyNumber || 0,
      group: medical?.insuranceInfo.grpNumber || 0,
    },
  });

  const onSubmit = async (values: any) => {
    setMedicalLoading(true);
    const medicalData = {
      personalInfo: {
        name: values.name,
        birth: values.birth,
        gender: values.gender,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          postalCode: values.postal,
        },
        phone: values.phone,
        email: values.email,
        emergency: {
          name: values.emname,
          relation: values.emrelation,
          phone: values.emphone,
        },
      },
      healthHistory: {
        allergy: values.allergy,
        chronic: values.chronic,
      },
      currentMedication: values.current,
      previousSurgeries: values.surgery,
      healthHabits: {
        smoker: values.smoker,
        alcohol: values.alcohol,
        exercise: values.routine,
        diet: values.diet,
        mentalCondition: values.mental,
        vaccinationHistory: values.vaccine,
      },
      insuranceInfo: {
        provider: values.provider,
        policyNumber: values.policy,
        grpNumber: values.group,
      },
      user: user?._id,
    };
    try {
      if (isMedical) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=medical`,
          medicalData,
          { withCredentials: true }
        );
        toast.success("Medical VCards updated!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cards/new?type=medical`,
          medicalData,
          { withCredentials: true }
        );
        toast.success("Medical VCards created!");
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
    setMedicalLoading(false);
  };
    
  return (
    <>
      <div className="flex flex-col justify-center items-center my-8">
        {/* progress bar */}
        <div className="flex justify-center lg:mt-4 lg:flex lg:justify-center lg:w-full">
          <div className="w-[90%] h-4 bg-gray-300 rounded-full lg:w-[50%]">
            <div
              className="h-4 bg-blue-500 rounded-full"
              style={{ width: `${(progressBar / 100) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* heading */}
        <div className="w-full py-4 lg:flex lg:justify-center">
            <h1 className="font-Philosopher text-3xl font-bold pl-4">Medical Card</h1>
        </div>

        {/* form */}
        <div className="flex flex-col justify-center items-center lg:w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:w-[30rem]">
          <div className="space-y-4">
            {progressBar === 25 && (
              <>
                <div className="space-y-2">
                  {perInfo.map((pIn, index) => (
                    <div key={index} className="space-y-2 flex flex-row gap-10">
                      <label htmlFor={`${pIn.name}`} className="basis-2/5 flex justify-start lg:justify-start font-Kanit text-lg items-center">{pIn.label}:</label>
                      {(pIn.name === 'birth') ? (
                        <input
                        className="basis-3/5 flex items-center py-2.5 px-0 w-full text-sm font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                        type="date"
                        id={pIn.name}
                        required
                        placeholder={pIn.text}
                        autoComplete="off"
                        {...register(pIn.name, { required: true })}
                      />
                      ) : (
                        <input
                          className="basis-3/5 flex items-center py-2.5 px-0 w-full text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                          type="text"
                          id={pIn.name}
                          required
                          placeholder={pIn.text}
                          autoComplete="off"
                          {...register(pIn.name, { required: true })}
                        />
                      )}
                      {errors[pIn.name] && (
                        <p className="text-red-500">{pIn.label} is required</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <h1 className="font-semibold mt-4 font-Kanit text-lg underline">
                    Emergency Contact
                  </h1>
                  {emCon.map((em, index) => (
                    <div key={index} className="space-y-2 flex flex-row gap-10">
                      {/* <div className="basis-1/4 flex justify-start font-Kanit text-lg items-center"> */}
                        <label htmlFor={`${em.name}`} className="basis-2/5 flex justify-start font-Kanit text-lg items-center">{em.label}:</label>
                      {/* </div> */}
                      {/* <div className="basis-3/4 flex items-center"> */}
                        <input
                          className="basis-3/5 flex items-center py-2.5 px-0 w-full text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                          type="text"
                          id={em.name}
                          required
                          autoComplete="off"
                          placeholder={em.text}
                          {...register(em.name, { required: true })}
                        />
                      {/* </div> */}
                      {errors[em.name] && (
                        <p className="text-red-500">{em.label} is required</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {progressBar === 50 && (
              <>
                <div className="space-y-1 w-full">
                  <div className="lg:flex lg:justify-center">
                  <h1 className="font-semibold mt-4 font-Philosopher text-lg underline pl-6">
                    Address
                  </h1>
                  </div>
                  {medAdd.map((em, index) => (
                    <div key={index} className="space-y-2 flex flex-row">
                      {/* <div className="basis-1/4 flex justify-start font-Kanit text-lg items-center"> */}
                        <label htmlFor={`${em.name}`} className="basis-1/4 flex justify-start lg:justify-center lg:mt-4 font-Kanit text-lg items-center">{em.label}:</label>
                      {/* </div> */}
                      {/* <div className="basis-3/4 flex items-center"> */}
                        <input
                          className="basis-3/4 flex items-center py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                          type="text"
                          id={em.name}
                          autoComplete="off"
                          required
                          placeholder={em.text}
                          {...register(em.name, { required: true })}
                        />
                      {/* </div> */}
                      {errors[em.name] && (
                        <p className="text-red-500">{em.label} is required</p>
                      )}
                    </div>
                  ))}
                </div>

                {healthHistory.map((sele, index) => (
                  <div key={index} className="space-y-2">
                    {/* <div className="w-full flex justify-start font-Kanit text-lg font-semibold items-center"> */}
                      <label htmlFor={`${sele.name}`} className="w-full flex justify-start font-Kanit text-lg font-semibold items-center">{sele.label}:</label>
                    {/* </div> */}
                    {/* <div className="items-center w-full"> */}
                      <input
                        className="tems-center w-full block py-2.5 px-0  text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                        type="text"
                        id={sele.name}
                        placeholder={sele.text}
                        {...register(sele.name, { required: true })}
                      />
                    {/* </div> */}
                    {errors[sele.name] && (
                      <p className="text-red-500">{sele.label} is required</p>
                    )}
                  </div>
                ))}

                <div className="space-y-2">
                  {/* <div className="w-full flex justify-start font-Kanit text-lg font-semibold items-center"> */}
                    <label htmlFor="current" className="w-full flex justify-start font-Kanit text-lg font-semibold items-center pl-6 lg:pl-0">
                      Current Medications:
                    </label>
                  {/* </div> */}
                  {/* <div className="items-center w-full"> */}
                    <textarea
                      className="items-center block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                      // type="text"
                      id="current"
                      required
                      autoComplete="off"
                      placeholder="Current Medications"
                      {...register("current", { required: true })}
                    />
                  {/* </div> */}
                  {errors.current && (
                    <p className="text-red-500">
                      Current Medications is required
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {/* <div className="w-full flex justify-start font-Kanit text-lg font-semibold items-center"> */}
                    <label htmlFor="surgery" className="w-full flex justify-start font-Kanit text-lg font-semibold items-center pl-6 lg:pl-0">
                      Previous Surgeries:
                    </label>
                  {/* </div> */}
                  {/* <div className="items-center w-full"> */}
                    <input
                      className="items-center block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                      type="text"
                      id="surgery"
                      required
                      autoComplete="off"
                      placeholder="Previous Surgeries"
                      {...register("surgery", { required: true })}
                    />
                  {/* </div> */}
                  {errors.current && (
                    <p className="text-red-500">
                      Current Medications is required
                    </p>
                  )}
                </div>
              </>
            )}
            {progressBar === 75 && (
              <>
                {healthhabits.map((sele, index) => (
                  <div key={index} className="space-y-2 w-full">
                    {/* <div className="font-Kanit font-semibold text-lg pl-4 flex justify-start"> */}
                      <label htmlFor={`${sele.name}`} className="font-Kanit font-semibold text-lg pl-4 lg:pl-0 flex justify-start">
                        {sele.label}
                      </label>
                    {/* </div> */}
                    {/* <div className=""> */}
                      <select
                        className="block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-slate-400 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                        id={sele.name}
                        required
                        {...register(sele.name, { required: true })}
                      >
                        <option value="" className="">
                          {sele.text}
                        </option>
                        {sele.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    {/* </div> */}
                    {errors[sele.name] && (
                      <p className="text-red-500">{sele.label} is required</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          {progressBar === 100 && (
            <>
              <div className="w-full">
                <div className="lg:flex lg:justify-center">
                <h1 className="font-semibold font-Philosopher text-xl underline">
                  Insurance Information
                </h1>
                </div>
                {inSur.map((em, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center w-full space-y-2 gap-8 my-2"
                  >
                    {/* <div className="basis-1/4 flex justify-start "> */}
                      <label htmlFor={`${em.name}`} className="basis-1/4 flex justify-start lg:mt-4 font-Kanit text-lg">{em.label}:</label>
                    {/* </div> */}
                    {/* <div className="basis-3/4"> */}
                      <input
                        className="basis-3/4 block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-slate-400 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                        type="text"
                        id={em.name}
                        required
                        placeholder={em.text}
                        {...register(em.name, { required: true })}
                      />
                    {/* </div> */}
                    {errors[em.name] && (
                        <p className="text-red-500">{em.label} is required</p>
                      )}
                  </div>
                ))}
              </div>
            </>
          )}
          {/* <button
            className="w-[350px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={medicalLoading}
          >
            {medicalLoading ? "Saving..." : "Save"}
          </button> */}
          <div className="w-full flex flex-row pt-8 pb-5">
            <div className="basis-1/2 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit disabled:bg-blue-300"
                onClick={handleProgressBackward}
                disabled={progressBar === 25}
              >
                Back
              </button>
            </div>
            <div className="basis-1/2 flex justify-center">
            {(progressBar === 100) ? (
              <button
              className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit"
              type="submit"
              disabled={medicalLoading}
            >
              {medicalLoading ? "Saving..." : "Save"}
            </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit"
                onClick={handleProgressForward}
              >
                Next
              </button>
            )}
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default MedicalInput;

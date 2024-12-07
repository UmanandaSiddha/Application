import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SinglePersonalResponse } from "@/types/api-types";
import SideBar from "@/components/rest/sidebar";
import { IoMdLink } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
    aboutPersonal,
    additionalInfo,
    contactInfo,
    emailInfo,
    Favourites,
    interests,
    lifestyle,
    miscellaneous,
    motto,
    perosnalName,
    professional,
    sepPersonal,
    socials
} from "@/data/individual";
import { convertToStrings, generateDefaultValues, setSvg } from "@/lib/helper";
import { otherInputs } from "@/data/medical";
import TextInput from "@/components/rest/text-input";
import SelectInput from "@/components/rest/select-input";
import MultiSelectInput from "@/components/rest/multi-select-input";
import { Helmet } from "react-helmet-async";

type LinkType = {
    name: string;
    label: string;
    text: string;
}

const CreatePersonal = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [progressBar, setProgressBar] = useState<number>(1);
    const [isPersonal, setIsPersonal] = useState<boolean>(id ? true : false);
    const [personalLoading, setPersonalLoading] = useState<boolean>(false);
    const [otherLink, setOtherLink] = useState("");
    const [otherName, setOtherName] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [socialData, setSocialData] = useState<LinkType[]>(socials);
    const [isEditable, setIsEditable] = useState(false);

    const { user, isPaid } = useSelector((state: RootState) => state.userReducer);

    const form = useForm({
        defaultValues: generateDefaultValues([
            perosnalName,
            aboutPersonal,
            contactInfo,
            emailInfo,
            miscellaneous,
            lifestyle,
            Favourites,
            motto,
            interests,
            sepPersonal,
            professional,
            additionalInfo,
            otherInputs,
        ]),
    });

    const { handleSubmit, register, reset, watch, setValue } = form;

    const fetchPersonal = async () => {
        if (id) {
            try {
                const { data }: { data: SinglePersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=individual`, { withCredentials: true });
                setIsPersonal(true);
                reset(convertToStrings(data.vCard));
                setSocialData(data.vCard.socialMedia);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
    };

    useEffect(() => {
        fetchPersonal();
    }, [id, reset]);

    const handleAdd = () => {
        if (!isEditable && Array.isArray(socialData) && socialData.find((arr: LinkType) => arr.label.trim().toLowerCase() === otherName.trim().toLowerCase())) {
            toast.warning("Platform already exists!");
            return;
        }
        if (isEditable) {
            const normalizedOtherName = otherName.trim().toLowerCase();
            const index = socialData.findIndex((arr: LinkType) => arr.label.trim().toLowerCase() === normalizedOtherName);
            if (index !== -1) {
                const updatedArr = [...socialData];
                updatedArr[index] = {
                    ...updatedArr[index],
                    name: otherLink,
                    text: `Enter Your ${otherName} Profile`,
                };
                setSocialData(updatedArr);
                setIsEditable(false);
            }
        } else {
            setSocialData([
                ...socialData,
                {
                    name: otherLink,
                    label: otherName,
                    text: `Enter Your ${otherName} Profile`,
                },
            ]);
        }
        setOpen(false);
        setOtherLink("");
        setOtherName("");
    };

    const handleChange = (event: any, index: number) => {
        setSocialData((prevData: any) => [
            ...prevData.slice(0, index),
            {
                ...prevData[index],
                [event.target.name]: event.target.value,
            },
            ...prevData.slice(index + 1),
        ]);
    };

    const onSubmit = async (values: any) => {
        let final = [];
        for (let i = 0; i < socialData.length; i++) {
            const element = {
                label: socialData[i].label,
                name: socialData[i].name,
            };
            if (element.name) {
                final.push(element);
            }
        }
        const personalData = {
            ...values,
            socialMedia: final,
            user: user?._id,
        };
        if (!isPaid && user?.cards?.total! > 10 && user?.role !== "admin") {
            navigate("/plans");
        } else {
            setPersonalLoading(true);
            try {
                if (isPersonal) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=individual`, personalData, { withCredentials: true });
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=individual`, personalData, { withCredentials: true });
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            } finally {
                setPersonalLoading(false);
            }
        }
    };

    function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setOtherName("");
            setOtherLink("");
            setOpen(false);
        }
    }

    const handleDeleteSocial = (label: string) => {
        const normalizedLabel = label.trim().toLowerCase();
        const updatedArr = socialData.filter((arr: LinkType) => arr.label.trim().toLowerCase() != normalizedLabel);
        setSocialData(updatedArr);
    }

    const formParts = () => {
        switch (progressBar) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Personal Preferences</h1>
                        <TextInput
                            name="name"
                            label="Name"
                            text="Enter your name"
                            type="text"
                            register={register}
                        />

                        <h1 className="py-4 text-2xl font-semibold">Socials</h1>
                        {socialData?.map((arr: LinkType, index: number) => (
                            <div className="relative w-full flex items-center" key={index}>
                                <label
                                    htmlFor={`name-${index}`}
                                    className="text-sm md:text-md font-semibold text-gray-700 min-w-10"
                                >
                                    {setSvg(arr.label) === "" ? (
                                        <IoMdLink size={25} />
                                    ) : (
                                        <svg
                                            className="fill-current"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d={setSvg(arr.label)}
                                                fill="black"
                                            />
                                        </svg>
                                    )}
                                </label>
                                <div className="flex space-x-4 w-full">
                                    <div className="relative h-11 w-full">
                                        <input
                                            type="text"
                                            id={`name-${index}`}
                                            name="name"
                                            value={arr.name}
                                            onChange={(e) => handleChange(e, index)}
                                            placeholder={arr.text}
                                            autoComplete="off"
                                            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        />
                                        <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                    </div>
                                    {arr.name != "" && (
                                        <>
                                            <button
                                                type="button"
                                                className="p-2"
                                                onClick={() => {
                                                    setIsEditable(true);
                                                    setOtherLink(arr.name);
                                                    setOtherName(arr.label);
                                                    setOpen(true);
                                                }}
                                            >
                                                <MdEdit size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 text-red-500"
                                                onClick={() => handleDeleteSocial(arr.label)}
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center">
                            <button
                                className="px-3 py-2 mt-4 rounded-md hover:cursor-pointer w-full text-white bg-black text-lg"
                                type="button"
                                onClick={() => setOpen(true)}
                            >
                                ADD MORE
                            </button>
                            {open && (
                                <div
                                    className="fixed inset-0 bg-opacity-30 backdrop-blur lg flex justify-center items-center z-10"
                                    id="popupform"
                                    onClick={handleCloseForm}
                                >
                                    <div className="bg-white border-2 p-8 rounded shadow-lg max-w-[425px]">
                                        <div className="space-y-6 lg:w-full">
                                            <h1 className="text-xl md:text-2xl font-semibold">{isEditable ? "Edit" : "Add"} Social Profile</h1>
                                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                                <label
                                                    htmlFor="name"
                                                    className="text0-sm md:text-md font-semibold text-gray-700 min-w-14"
                                                >
                                                    Platform
                                                </label>
                                                <div className="relative h-11 w-full min-w-56">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={otherName}
                                                        disabled={isEditable}
                                                        onChange={(e) => setOtherName(e.target.value)}
                                                        placeholder="Enter Social Media Platform"
                                                        autoComplete="off"
                                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                    />
                                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                                </div>
                                            </div>

                                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                                <label
                                                    htmlFor="link"
                                                    className="text-sm md:text-md font-semibold text-gray-700 min-w-14"
                                                >
                                                    Link
                                                </label>
                                                <div className="relative h-11 w-full min-w-56">
                                                    <input
                                                        type="text"
                                                        id="link"
                                                        value={otherLink}
                                                        onChange={(e) => setOtherLink(e.target.value)}
                                                        placeholder="Enter Social Media Link"
                                                        autoComplete="off"
                                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                    />
                                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <button
                                                    className="bg-black text-white font-semibold py-2 px-4 rounded"
                                                    type="button"
                                                    onClick={handleAdd}
                                                >
                                                    {isEditable ? "Update" : "Create"} Social
                                                </button>
                                                <button
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded ml-2"
                                                    type="button"
                                                    onClick={() => {
                                                        if (isEditable) {
                                                            setIsEditable(false);
                                                            setOtherName("");
                                                            setOtherLink("");
                                                        }
                                                        setOpen(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        <TextInput
                            name="aboutMe"
                            label="About me"
                            text="Tell Something About Yourself"
                            type="textarea"
                            register={register}
                        />

                        <h1 className="pt-4 text-2xl font-semibold">Contact Numbers</h1>
                        {contactInfo?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Email Addresses</h1>
                        {emailInfo?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        {lifestyle?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Tell us about your Favourites!</h1>
                        {Favourites?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Miscellaneous Details</h1>
                        {miscellaneous?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Quotes</h1>
                        {motto?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Interests & Activities</h1>
                        {interests?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            if (sele.multiple) {
                                return (
                                    <MultiSelectInput
                                        key={index}
                                        name={sele.name}
                                        label={sele.label}
                                        options={sele.options}
                                        placeholder={sele.text}
                                        value={selectedValue}
                                        register={register}
                                        setValue={setValue}
                                    />
                                )
                            }
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Professional Details</h1>
                        {professional?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            if (sele.multiple) {
                                return (
                                    <MultiSelectInput
                                        key={index}
                                        name={sele.name}
                                        label={sele.label}
                                        options={sele.options}
                                        placeholder={sele.text}
                                        value={selectedValue}
                                        register={register}
                                        setValue={setValue}
                                    />
                                )
                            }
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}

                        <h1 className="pt-4 text-2xl font-semibold">Personal Values</h1>
                        {sepPersonal?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            if (sele.multiple) {
                                return (
                                    <MultiSelectInput
                                        key={index}
                                        name={sele.name}
                                        label={sele.label}
                                        options={sele.options}
                                        placeholder={sele.text}
                                        value={selectedValue}
                                        register={register}
                                        setValue={setValue}
                                    />
                                )
                            }
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Additional Infomation</h1>
                        {additionalInfo?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}
                    </div>
                );
        }
    };

    return (
        <>
            <Helmet>
                <title>Voolata | Form individual</title>
                <meta name="description" content={`This is the individual form page of Voolata`} />
                <meta name="keywords" content="individual, form, voolata" />
            </Helmet>
            <div className="flex justify-center h-screen">
                <div className="flex flex-col lg:flex-row w-[90%] md:w-[85%] lg:w-[80%] space-y-6 lg:space-y-0 lg:space-x-4">
                    <div className="basis-1/4 hidden lg:block">
                        <SideBar />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <h1 className="font-bold text-3xl md:text-4xl text-center mt-6 mb-4">
                            Individual
                        </h1>

                        <div className="flex justify-center w-full lg:w-[70%] mx-auto mb-4 px-4 md:px-0">
                            <div className="w-full h-2 bg-blue-100 rounded-full">
                                <div
                                    className="h-2 bg-purple-400 rounded-full"
                                    style={{ width: `${(progressBar / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col space-y-2 w-full lg:w-[90%] mx-auto px-4 md:px-0"
                        >
                            <div className="flex gap-10 lg:gap-20 justify-center items-center">
                                <button
                                    className="hidden sm:flex px-3 py-2 justify-center items-center rounded-full h-14 w-14 text-white bg-purple-400 text-base"
                                    type="button"
                                    disabled={progressBar === 1}
                                    onClick={() => setProgressBar((currPage) => currPage - 1)}
                                >
                                    <FaArrowLeft />
                                </button>

                                <div className="sm:h-[75vh] w-full overflow-y-auto hide-scrollbar flex-1 flex flex-col">
                                    {formParts()}
                                </div>

                                <button
                                    className="hidden sm:flex px-3 py-2 justify-center items-center rounded-full h-14 w-14 text-white bg-purple-400 text-base"
                                    type="button"
                                    disabled={progressBar === 5}
                                    onClick={() => setProgressBar((currPage) => currPage + 1)}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>

                            <div className="flex justify-center w-full lg:w-[70%] mx-auto gap-4 pb-4">
                                <button
                                    className="sm:hidden px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#3763a3] text-lg"
                                    type="button"
                                    disabled={progressBar === 1}
                                    onClick={() => setProgressBar((currPage) => currPage - 1)}
                                >
                                    Prev
                                </button>
                                {progressBar === 5 ? (
                                    <button
                                        className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#3763a3] text-lg"
                                        type="submit"
                                        disabled={personalLoading}
                                    >
                                        {personalLoading ? "Hold on..." : "Submit"}
                                    </button>
                                ) : (
                                    <button
                                        className="sm:hidden px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#3763a3] text-lg"
                                        type="button"
                                        onClick={() => setProgressBar((currPage) => currPage + 1)}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatePersonal;
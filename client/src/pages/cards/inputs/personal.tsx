import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SinglePersonalResponse } from "@/types/api-types";
import SideBar from "@/components/rest/sidebar";
import { IoMdLink } from "react-icons/io";
import * as icons from 'simple-icons';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type LinkType = {
    name: string;
    label: string;
    text: string;
}

const perosnalName = [{ name: "name" }];

const aboutPersonal = [{ name: "aboutMe" }];

const contactInfo = [
    { name: "mobileNumber", label: "Mobile", text: "Enter mobile phone number", type: "tel" },
    { name: "homeNumber", label: "Home", text: "Enter home phone number", type: "tel" },
    { name: "workNumber", label: "Work", text: "Enter work phone number", type: "tel" },
    { name: "otherNumber", label: "Other", text: "Enter any other phone number", type: "tel" }
];

const emailInfo = [
    { name: "personalEmail", label: "Personal", text: "Enter Personal Email Address", type: "text" },
    { name: "workEmail", label: "Work", text: "Enter Work Email Address", type: "text" },
    { name: "otherEmail", label: "Other", text: "Enter any other email address", type: "text" },
];

const socials = [
    { name: "", label: "Instagram", text: "Enter Your Instagram Profile" },
    { name: "", label: "Youtube", text: "Enter Your Youtube Profile" },
    { name: "", label: "Facebook", text: "Enter Your Facebook Profile" },
    { name: "", label: "Discord", text: "Enter Your Discord Profile" },
    { name: "", label: "X", text: "Enter Your X Profile" },
];

const lifestyle = [
    { name: "dateOfBirth", label: "Date of Birth", text: "Enter your Date of Birth", type: "date" },
    { name: "homeTown", label: "Hometown", text: "Enter your Hometown", type: "text" },
    { name: "currentCity", label: "Current City", text: "Enter your Current City", type: "text" },
    { name: "languages", label: "Languages", text: "Enter languages spoken", type: "text" },
];

const Favourites = [
    { name: "music", label: "Favourite Music", text: "Enter Favourite Music/Artists" },
    { name: "color", label: "Favourite Color(s)", text: "Enter Favourite Color(s)" },
    { name: "city", label: "Favourite City", text: "Enter Favourite City" },
    { name: "travelDestination", label: "Favourite Destination", text: "Enter Favourite Destinations" },
    { name: "season", label: "Favourite Season", text: "Enter Favourite Season" },
    { name: "uniqueSkills", label: "Unique Skills", text: "Enter Unique Skills" },
    { name: "cuisine", label: "Favourite Cuisine", text: "Enter Favourite Cuisine/Food" },
    { name: "beverage", label: "Favourite Beverage", text: "Enter Beverage" },
];

const miscellaneous = [
    { name: "petLover", label: "Pet Lover?", text: "Enter Yes/No", options: ["Yes", "No"] },
    { name: "partyEnthusiast", label: "Party Enthusiast?", text: "Enter Yes/No", options: ["Yes", "No"] },
    { name: "smoker", label: "Smoker?", text: "Enter Yes/No", options: ["Yes", "No"] },
    { name: "maritalStatus", label: "Marital Status?", text: "Enter Yes/No", options: ["Single", "In a relationship", "Engaged", "Married"] },
    { name: "relationshipStatus", label: "Relationship?", text: "Enter Yes/No", options: ["Just Exploring", "Committed", "It's complicated", "Single and Happy"] },
    { name: "morningPerson", label: "Morning/Night Person?", text: "Enter Yes/No", options: ["Morning person", "Night Owl", "Somewhere in between", "Depends on the day"] },
    { name: "sleepingHabit", label: "Sleeping Habits?", text: "Enter Sleeping Habits", options: ["Early Riser", "Night Owl", "Somewhere in between", "Depends on the day"] },
    { name: "fitnessRoutine", label: "Fitness Routine", text: "Enter Fitness Routine", options: ["Daily fitness regime", "A few times a week", "Sometimes when I can", "Not much into fitness"] },
    { name: "diet", label: "Dietary Preferences", text: "Enter Dietary Preferences", options: ["Vegetarian", "Vegan", "Omnivore", "Other"] },
];

const motto = [
    { name: "inspirationalQuotes", label: "Inspirational", text: "Enter any Inspirational Quote" },
    { name: "funnyQuotes", label: "Funny", text: "Enter any Funny Quote" },
    { name: "motivationalQuotes", label: "Motivational", text: "Enter any Motivational Quote" },
    { name: "otherQuotes", label: "Other", text: "Enter any Other Quote" },
];

const interests = [
    { name: "travelMode", label: "Preferred Mode of Travel", text: "Enter your Preferred Mode of Travel", options: ["Airplane", "Train", "Cars", "Cruise", "Other"] },
    { name: "genre", label: "Fav Movies/TV Shows", text: "Favorite Movies/TV Shows/Genres", options: ["Action", "Comedy", "Drama", "Sci-Fi/Fantasy", "Documentary", "Other"] },
    { name: "sports", label: "Sports Activites", text: "Sports or Outdoor Activities", options: ["Basketball", "Tennis", "Hiking", "Cycling", "Swimming", "Other"] },
    { name: "artistisPursuits", label: "Artistic Hobbies", text: "Artistic Pursuits/Hobbies", options: ["Drawing/Painting", "Photography", "Writing", "Crafts", "Music", "Other"] },
    { name: "gaming", label: "Gaming Preferences", text: "Gaming Preferences", options: ["Action", "Adventure", "Puzzle", "Role-playing", "Simulation", "Other"] },
    { name: "collectignHobby", label: "Collecting Hobby/Interest", text: "Collecting Hobby or Interest", options: ["Coins/Stamps", "Comics/Figurines", "Antiques", "Trading cards", "Memorabilia", "Other"] },
    { name: "coffee", label: "Coffee or Tea?", text: "Coffee or Tea Lover", options: ["Coffee addict", "Tea enthusiast", "Both!", "None, prefer other beverages"] },
    { name: "cookingSkills", label: "Cooking Skills", text: "Cooking Skills", options: ["Novice", "Intermediate", "Expert"] },
];

const personalValues = [
    { name: "spiritual", label: "Spiritual or Religious Beliefs", text: "Spiritual or Religious Beliefs", options: ["Religious", "Spiritual", "Atheist", "Agnostic"] },
    { name: "core", label: "Core Values", text: "Core Values", options: ["Honesty", "Respect", "Kindness", "Integrity"] },
    { name: "philosophy", label: "Philosophies I Believe In", text: "Philosophies I Believe In", options: ["Stoicism", "Existentialism", "Humanism", "Nihilism"] },
    { name: "socialCause", label: "Environmental/Social Causes I Support", text: "Environmental/Social Causes I Support", options: ["Environmental Conservation", "Human Rights", "Animal Welfare", "Education"] },
];

const professional = [
    { name: "currentOcupation", label: "Current Occupation", text: "Enter Current Occupation/Industry", options: ["Technology", "Healthcare", "Education", "Finance", "Arts/Entertainment", "Other"] },
    { name: "careerAspiation", label: "Career Aspiation", text: "Enter Career Aspirations/Goals", options: ["Leadership", "Entrepreneurship", "Creativity", "Advancement", "Other"] },
    { name: "education", label: "Education Background", text: "Enter Education Background/Degrees", options: ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"] },
    { name: "skills", label: "Professional Skills", text: "Enter Professional Skills or Expertise", options: ["Communication", "Problem-solving", "Teamwork", "Leadership", "Other"] },
];

const additionalInfo = [
    { name: "globalIssues", label: "globalIssues", text: "globalIssues" },
    { name: "weirdBelief", label: "weirdBelief", text: "weirdBelief" },
    { name: "otherInterests", label: "Other Interests", text: "Any Other Interests" },
    { name: "futureGoals", label: "Future Goals", text: "Future Goals" },
    { name: "current", label: "Currently Learning", text: "Things I'm Learning" },
    { name: "unusualExperinece", label: "Most Unusual Experience", text: "Unusual Experience" },
    { name: "strangeHabits", label: "Strangest Habit I Have", text: "Strangest Habit I Have" },
];

const otherInputs = [
    { name: "travelMode_Other" },
    { name: "genre_Other" },
    { name: "sports_Other" },
    { name: "artistisPursuits_Other" },
    { name: "gaming_Other" },
    { name: "collectignHobby_Other" },
    { name: "coffee_Other" },
    { name: "cookingSkills_Other" },
    { name: "currentOcupation_Other" },
    { name: "careerAspiation_Other" },
    { name: "education_Other" },
    { name: "skills_Other" },
    { name: "diet_Other" },
];

const generateDefaultValues = (arrays: { name: string }[][]) => {
    return arrays.reduce((acc, array) => {
        array.forEach((field) => {
            acc[field.name] = "";
        });
        return acc;
    }, {} as Record<string, string>);
};

const convertToStrings = (data: any) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] =
            data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
        return acc;
    }, {} as Record<string, string>);
};

const CreatePersonal = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("individualId");
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
            personalValues,
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
                    // label: normalizedOtherName,
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
        setPersonalLoading(true);
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
            try {
                if (isPersonal) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=individual`, personalData, { withCredentials: true });
                    // toast.success("Personal VCards updated!");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=individual`, personalData, { withCredentials: true });
                    // toast.success("Personal VCards created!");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            }
        }
        setPersonalLoading(false);
    };

    function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setOtherName("");
            setOtherLink("");
            setOpen(false);
        }
    }

    const setSvg = (input: string) => {
        const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
        const icon = icons[platformKey as keyof typeof icons];
        if (icon) {
            return icon.path;
        } else {
            return "";
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
                    <>
                        <h1 className="text-2xl font-bold">Personal Preferences</h1>
                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                            <label
                                htmlFor="name"
                                className="text-md font-semibold text-gray-700 min-w-24"
                            >
                                Name:
                            </label>
                            <div className="relative h-11 w-full min-w-56">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    {...register("name", { required: true })}
                                    autoComplete="off"
                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                />
                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold">Socials</h1>
                        {socialData?.map((arr: LinkType, index: number) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={`name-${index}`}
                                    className="text-md font-semibold text-gray-700 min-w-10"
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
                                <div className="flex space-x-4">
                                    <div className="relative h-11 w-full min-w-44">
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
                                className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full max-w-2xl text-white bg-black text-lg"
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
                                    <div className="bg-white p-8 rounded shadow-lg max-w-[425px]">
                                        <div className="space-y-6 lg:w-full">
                                            <h1 className="text-2xl font-bold">{isEditable ? "Edit" : "Add"} Social Profile</h1>
                                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                                <label
                                                    htmlFor="name"
                                                    className="text-md font-semibold text-gray-700 min-w-14"
                                                >
                                                    Platform:
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
                                                    className="text-md font-semibold text-gray-700 min-w-14"
                                                >
                                                    Link:
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
                                                    className="bg-black text-white font-bold py-2 px-4 rounded"
                                                    type="button"
                                                    onClick={handleAdd}
                                                >
                                                    {isEditable ? "Update" : "Create"} Social
                                                </button>
                                                <button
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
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

                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                            <label
                                htmlFor="aboutMe"
                                className="text-md font-semibold text-gray-700 min-w-24"
                            >
                                About me:
                            </label>
                            <div className="relative w-full min-w-56">
                                <textarea
                                    {...register("aboutMe", { required: true })}
                                    placeholder="Tell Something About Yourself"
                                    autoComplete="off"
                                    className="peer h-full min-h-[100px] w-full resize-none border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                ></textarea>
                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold">Contact Numbers</h1>
                        {contactInfo?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Email Addresses</h1>
                        {emailInfo?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                );
            case 2:
                return (
                    <>
                        {lifestyle?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Tell us about your Favourites!</h1>
                        {Favourites?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type="text"
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Miscellaneous Details</h1>
                        {miscellaneous?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <>
                                    <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                        <label className="text-md font-semibold text-gray-700 min-w-24" htmlFor={sele.name}>
                                            {sele.label}:
                                        </label>
                                        <div className="relative h-11 w-full min-w-56">
                                            <select
                                                id={sele.name}
                                                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                {...register(sele.name, {
                                                    required: true,
                                                    onChange: (e) => {
                                                        if (e.target.value !== "Other") {
                                                            setValue(`${sele.name}_Other`, "");
                                                        }
                                                    },
                                                })}
                                            >
                                                <option key={index} value="" disabled className="text-slate-400">{sele.label}</option>
                                                {sele.options.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                        </div>
                                    </div>
                                    {selectedValue === "Other" && (
                                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                            <label
                                                htmlFor={`${sele.name}_Other`}
                                                className="text-md font-semibold text-gray-700 min-w-24"
                                            >
                                                {sele.label} (Specify):
                                            </label>
                                            <div className="relative h-11 w-full min-w-56">
                                                <input
                                                    type="text"
                                                    placeholder={sele.text}
                                                    {...register(`${sele.name}_Other`, { required: true })}
                                                    autoComplete="off"
                                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                />
                                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        })}
                    </>
                );
            case 3:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Quotes</h1>
                        {motto?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type="text"
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Interests & Activities</h1>
                        {interests?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <>
                                    <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                        <label className="text-md font-semibold text-gray-700 min-w-24" htmlFor={sele.name}>
                                            {sele.label}:
                                        </label>
                                        <div className="relative h-11 w-full min-w-56">
                                            <select
                                                id={sele.name}
                                                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                {...register(sele.name, {
                                                    required: true,
                                                    onChange: (e) => {
                                                        if (e.target.value !== "Other") {
                                                            setValue(`${sele.name}_Other`, "");
                                                        }
                                                    },
                                                })}
                                            >
                                                <option key={index} value="" disabled className="text-slate-400">{sele.label}</option>
                                                {sele.options.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                        </div>
                                    </div>
                                    {selectedValue === "Other" && (
                                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                            <label
                                                htmlFor={`${sele.name}_Other`}
                                                className="text-md font-semibold text-gray-700 min-w-24"
                                            >
                                                {sele.label} (Specify):
                                            </label>
                                            <div className="relative h-11 w-full min-w-56">
                                                <input
                                                    type="text"
                                                    placeholder={sele.text}
                                                    {...register(`${sele.name}_Other`, { required: true })}
                                                    autoComplete="off"
                                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                />
                                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        })}
                    </>
                );
            case 4:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Professional Details</h1>
                        {professional?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <>
                                    <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                        <label className="text-md font-semibold text-gray-700 min-w-24" htmlFor={sele.name}>
                                            {sele.label}:
                                        </label>
                                        <div className="relative h-11 w-full min-w-56">
                                            <select
                                                id={sele.name}
                                                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                {...register(sele.name, {
                                                    required: true,
                                                    onChange: (e) => {
                                                        if (e.target.value !== "Other") {
                                                            setValue(`${sele.name}_Other`, "");
                                                        }
                                                    },
                                                })}
                                            >
                                                <option key={index} value="" disabled className="text-slate-400">{sele.label}</option>
                                                {sele.options.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                        </div>
                                    </div>
                                    {selectedValue === "Other" && (
                                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16">
                                            <label
                                                htmlFor={`${sele.name}_Other`}
                                                className="text-md font-semibold text-gray-700 min-w-24"
                                            >
                                                {sele.label} (Specify):
                                            </label>
                                            <div className="relative h-11 w-full min-w-56">
                                                <input
                                                    type="text"
                                                    placeholder={sele.text}
                                                    {...register(`${sele.name}_Other`, { required: true })}
                                                    autoComplete="off"
                                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                />
                                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        })}

                        <h1 className="text-2xl font-bold">Personal Values</h1>
                        {personalValues?.map((sele, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label className="text-md font-semibold text-gray-700 min-w-24" htmlFor={sele.name}>
                                    {sele.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <select
                                        id={sele.name}
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        {...register(sele.name, { required: true })}
                                    >
                                        <option key={index} value="" disabled className="text-slate-400">{sele.label}</option>
                                        {sele.options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                );
            case 5:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Additional Infomation</h1>
                        {additionalInfo?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type="text"
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                );
        }
    };

    return (
        <div className="flex justify-center ">
            <div className="flex flex-row w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block xl:block">
                    <SideBar />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:w-full">
                    <div className="basis-full border-2 flex items-center justify-center gap-20 lg:basis-3/4 lg:max-h-screen">
                        <button
                            className="px-4 py-2 mt-4 flex justify-center items-center hover:cursor-pointer rounded-full h-20 w-20 text-white bg-blue-500 text-lg"
                            type="button"
                            disabled={progressBar === 1}
                            onClick={() => setProgressBar((currPage) => currPage - 1)}
                        >
                            <FaArrowLeft className="text-3xl" />
                        </button>
                        <div className="h-[85vh] flex flex-col overflow-y-scroll mb-4 hide-scrollbar">
                            <h1 className="font-bold text-4xl text-center mt-6 mb-16 lg:mb-12">Individual</h1>
                            <div className="flex flex-col justify-center items-center lg:w-full">
                                <div className="flex flex-col gap-6 justify-center pb-10">

                                    <div className="flex justify-center lg:mt-4 mb-10 lg:flex lg:justify-center">
                                        <div className="w-full h-4 bg-blue-100 rounded-full">
                                            <div
                                                className="h-4 bg-blue-500 rounded-full"
                                                style={{ width: `${(progressBar / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {formParts()}
                                    <div className="flex  justify-center space-x-4">
                                    </div>
                                </div>
                            </div>
                            {progressBar === 5 ?

                                <button
                                    className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer   text-white bg-slate-500 text-lg"
                                    type="submit"
                                    disabled={personalLoading}
                                >
                                    {personalLoading ? "APPLYING..." : "APPLY CHANGES"}
                                </button>
                                :
                                <></>
                            }
                        </div>
                        {progressBar === 5 ? (
                            <></>
                        ) : (
                            <button
                                className="px-4 py-2 mt-4 rounded-full flex justify-center items-center h-20 w-20 hover:cursor-pointer text-white bg-blue-500 text-lg"
                                type="button"
                                disabled={progressBar === 5}
                                onClick={() => setProgressBar((currPage) => currPage + 1)}
                            >
                                <FaArrowRight className="text-3xl" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div >

    );
};

export default CreatePersonal;
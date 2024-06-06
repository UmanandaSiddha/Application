import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SinglePersonalResponse } from "@/types/api-types";

const perosnalName = [
    { name: "name" },
];

const aboutPersonal = [
    { name: "aboutMe" },
];

const contactInfo = [
    { name: "mobileNumber", label: "Mobile", text: "Enter mobile phone number", type: "tel" },
    { name: "homeNumber", label: "Home", text: "Enter home phone number", type: "tel" },
    { name: "workNumber", label: "Work", text: "Enter work phone number", type: "tel" },
    { name: "otherNumber", label: "Other", text: "Enter any other phone number", type: "tel" },
];

const emailInfo = [
    { name: "personalEmail", label: "Personal", text: "Enter Personal Email Address", type: "text" },
    { name: "workEmail", label: "Work", text: "Enter Work Email Address", type: "text" },
    { name: "otherEmail", label: "Other", text: "Enter any other email address", type: "text" },
];

const socials = [
    { name: "", label: "Instagram", text: "Enter Your Instagram Profile" },
    { name: "", label: "Youtube", text: "Enter Your Youtube Profile" },
    { name: "", label: "Spotify", text: "Enter Your Spotify Profile" },
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
    { name: "music", label: "Fav Music", text: "Enter Fav Music/Artists" },
    { name: "color", label: "Fav Color(s)", text: "Enter Fav Color(s)" },
    { name: "city", label: "Fav City", text: "Enter Fav City" },
    { name: "travelDestination", label: "Fav-Destination", text: "Enter Fav Destinations" },
    { name: "season", label: "Fav Season", text: "Enter Fav Season" },
    { name: "uniqueskills", label: "Unique Skills", text: "Enter Unique Skills" },
    { name: "cuisine", label: "Fav Cuisine", text: "Enter Fav Cuisine/Food" },
    { name: "beverage", label: "Fav Beverage", text: "Enter Beverage" },
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
    { name: "otherQuotes", label: "Other", text: "Enter any Other Quote" }
];

const interests = [
    { name: "travelMode", label: "Preferred Mode of Travel", text: "Enter your Preferred Mode of Travel", options: ["Airplane", "Train", "Cars", "Cruise", "Other"], customInput: { name: "prefOther", text: "Enter custom preference mode" } },
    { name: "genre", label: "Fav Movies/TV Shows", text: "Favorite Movies/TV Shows/Genres", options: ["Action", "Comedy", "Drama", "Sci-Fi/Fantasy", "Documentary", "Other"], customInput: { name: "genreOther", text: "Enter custom genre" } },
    { name: "sports", label: "Sports Activites", text: "Sports or Outdoor Activities", options: ["Basketball", "Tennis", "Hiking", "Cycling", "Swimming", "Other"], customInput: { name: "sportOther", text: "Enter custom activities" } },
    { name: "artistisPursuits", label: "Artistic Hobbies", text: "Artistic Pursuits/Hobbies", options: ["Drawing/Painting", "Photography", "Writing", "Crafts", "Music", "Other"], customInput: { name: "artOther", text: "Enter custom hobbies" } },
    { name: "gaming", label: "Gaming Preferences", text: "Gaming Preferences", options: ["Action", "Adventure", "Puzzle", "Role-playing", "Simulation", "Other"], customInput: { name: "gamingOther", text: "Enter custom preference" } },
    { name: "collectignHobby", label: "Collecting Hobby/Interest", text: "Collecting Hobby or Interest", options: ["Coins/Stamps", "Comics/Figurines", "Antiques", "Trading cards", "Memorabilia", "Other"], customInput: { name: "collectingOther", text: "Enter custom interest" } },
    { name: "coffee", label: "Coffee or Tea?", text: "Coffee or Tea Lover", options: ["Coffee addict", "Tea enthusiast", "Both!", "None, prefer other beverages"], customInput: { name: "coffeeOther", text: "Enter custom coffee" } },
    { name: "cookingSkills", label: "Cooking Skills", text: "Cooking Skills", options: ["Novice", "Intermediate", "Expert"], customInput: { name: "cookOther", text: "Enter custom skill" } }
];

const personalValues = [
    { name: "spiritual", label: "Spiritual or Religious Beliefs", text: "Spiritual or Religious Beliefs", options: ["Religious", "Spiritual", "Atheist", "Agnostic"] },
    { name: "core", label: "Core Values", text: "Core Values", options: ["Honesty", "Respect", "Kindness", "Integrity"] },
    { name: "philosophy", label: "Philosophies I Believe In", text: "Philosophies I Believe In", options: ["Stoicism", "Existentialism", "Humanism", "Nihilism"] },
    { name: "socialCause", label: "Environmental/Social Causes I Support", text: "Environmental/Social Causes I Support", options: ["Environmental Conservation", "Human Rights", "Animal Welfare", "Education"] }
];

const professional = [
    { name: "currentOcupation", label: "Current Occupation", text: "Enter Current Occupation/Industry", options: ["Technology", "Healthcare", "Education", "Finance", "Arts/Entertainment", "Other"], customInput: { name: "occupationOther", text: "Enter custom occupation" } },
    { name: "careerAspiation", label: "Career Aspiation", text: "Enter Career Aspirations/Goals", options: ["Leadership", "Entrepreneurship", "Creativity", "Advancement", "Other"], customInput: { name: "aspirationOther", text: "Enter custom aspiration" } },
    { name: "education", label: "Education Background", text: "Enter Education Background/Degrees", options: ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"], customInput: { name: "backgroundOther", text: "Enter custom background" } },
    { name: "skills", label: "Professional Skills", text: "Enter Professional Skills or Expertise", options: ["Communication", "Problem-solving", "Teamwork", "Leadership", "Other"], customInput: { name: "expertiseOther", text: "Enter custom expertise" } }
];

const additionalInfo = [
    { name: "globalIssues", label: "globalIssues", text: "globalIssues" },
    { name: "weirdBelief", label: "weirdBelief", text: "weirdBelief" },
    { name: "otherInterests", label: "Other Interests", text: "Any Other Interests" },
    { name: "futureGoals", label: "Future Goals", text: "Future Goals" },
    { name: "current", label: "Currently Learning", text: "Things I'm Learning" },
    { name: "unusualExperinece", label: "Most Unusual Experience", text: "Unusual Experience" },
    { name: "strangeHabits", label: "Strangest Habit I Have", text: "Strangest Habit I Have" }
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
    { name: "diet_Other" }
]

const generateDefaultValues = (arrays: { name: string }[][]) => {
    return arrays.reduce((acc, array) => {
        array.forEach(field => {
            acc[field.name] = "";
        });
        return acc;
    }, {} as Record<string, string>);
};

const convertToStrings = (data: any) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
        return acc;
    }, {} as Record<string, string>);
};

const InputVCard = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("personalId");
    const [progressBar, setProgressBar] = useState<number>(1);
    const [isPersonal, setIsPersonal] = useState<boolean>(id ? true : false);
    const [personalLoading, setPersonalLoading] = useState<boolean>(false);
    const [otherLink, setOtherLink] = useState("");
    const [otherName, setOtherName] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [socialData, setSocialData] = useState<any | null>(socials);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues([perosnalName, aboutPersonal, contactInfo, emailInfo, miscellaneous, lifestyle, Favourites, motto, interests, personalValues, professional, additionalInfo, otherInputs]),
    });

    const { handleSubmit, register, reset, watch, setValue } = form;

    useEffect(() => {
        const fetchPersonal = async () => {
            if (id) {
                try {
                    const { data }: { data: SinglePersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=personal`, { withCredentials: true });
                    setIsPersonal(true);
                    reset(convertToStrings(data.vCard));
                    setSocialData(data.vCard.socialMedia);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
        }

        const cardData = localStorage.getItem("current_card");
        if (cardData && id) {
            const cardDataParsed = JSON.parse(cardData);
            if (cardDataParsed?._id !== id) {
                fetchPersonal();
            } else {
                setIsPersonal(true);
                setSocialData(cardDataParsed.socialMedia);
                reset(convertToStrings(cardDataParsed));
            }
        } else {
            fetchPersonal();
        }
    }, [id, reset]);

    const handleAdd = () => {
        setSocialData([
            ...socialData,
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
        if (!isPaid && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isPersonal) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=personal`, personalData, { withCredentials: true });
                    toast.success("Personal VCards updated!");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=personal`, personalData, { withCredentials: true });
                    toast.success("Personal VCards created!");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        setPersonalLoading(false);
    };

    function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setOpen(false);
        }
    }

    const formParts = () => {
        switch (progressBar) {
            case 1:
                return (
                    <div className="flex flex-col justify-center items-center my-8">
                        <div className="w-full lg:w-[50%] lg:flex lg:justify-center">
                            <h1 className="text-3xl font-bold pl-6 font-Philosopher">Personal Preferences</h1>
                        </div>
                        <div className="w-[90%] lg:w-[45%] flex flex-row lg:mt-10">
                            <div className="basis-1/3 flex justify-center items-center">
                                <label htmlFor="" className="text-xl">
                                    Name:
                                </label>
                            </div>
                            <div className="basis-2/3 flex justify-center items-center">
                                <input
                                    type="text"
                                    className="block py-2.5 px-0 w-full text-xl font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                    placeholder="Enter your name"
                                    {...register("name", { required: true })}
                                />
                            </div>
                        </div>

                        {/* socials */}
                        <div className="flex flex-col space-y-2 font-Kanit">
                            <div className="lg:flex lg:justify-center"><h1 className="font-semibold text-lg font-Philosopher underline">Social Media Profiles</h1></div>
                            {socialData && (
                                <div className="flex flex-col space-y-2">
                                    {socialData.map((arr: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex w-full justify-center items-center gap-2"
                                        >
                                            <div className="basis-1/3 flex justify-start">
                                                <label htmlFor={`name-${index}`}>{arr.label}:</label>
                                            </div>
                                            <div className="basis-2/3">
                                                <input
                                                    className="block py-2.5 px-0 w-full text-sm font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
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
                                            className="fixed inset-0 bg-opacity-30 backdrop-blur lg flex justify-center items-center z-10"
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
                        </div>

                        {/* about me */}
                        <div className="w-[90%] lg:w-[45%] flex flex-row lg:mt-10">
                            <div className="basis-1/3 flex justify-center items-center">
                                <label htmlFor="" className="text-xl">
                                    About Me:
                                </label>
                            </div>
                            <div className="basis-2/3 flex justify-center items-center">
                                <textarea
                                    className="block py-2.5 px-0 w-full text-xl font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                    placeholder="Tell Something About Yourself"
                                    {...register("aboutMe", { required: true })}
                                />
                            </div>
                        </div>

                        {/* conatct */}
                        <div className="pl-6">
                            {contactInfo.map((contact, index) => (
                                <div key={index}>
                                    <div className="flex flex-row" key={index}>
                                        <div className="basis-1/3 flex justify-center items-center text-lg">
                                            <label htmlFor="" className="text-black">
                                                {contact.label}
                                            </label>
                                        </div>
                                        <div className="basis-2/3 px-4">
                                            <input
                                                type={contact.type}
                                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-slate-300 appearance-none text-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                placeholder={contact.text}
                                                {...register(contact.name, {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* email */}
                        <div className="pl-6">
                            {emailInfo.map((email, index) => (
                                <div key={index}>
                                    <div className="flex flex-row" key={index}>
                                        <div className="basis-1/3 flex justify-center items-center text-lg">
                                            <label htmlFor="" className="text-black">
                                                {email.label}
                                            </label>
                                        </div>
                                        <div className="basis-2/3 px-4">
                                            <input
                                                type={email.type}
                                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-slate-300 appearance-none text-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                placeholder={email.text}
                                                {...register(email.name, {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="flex flex-col justify-center items-center my-8">
                        <div className="pl-6">
                            {lifestyle.map((life, index) => (
                                <div key={index}>
                                    <div className="flex flex-row" key={index}>
                                        <div className="basis-1/3 flex justify-center items-center text-lg">
                                            <label htmlFor="" className="text-black">
                                                {life.label}
                                            </label>
                                        </div>
                                        <div className="basis-2/3 px-4">
                                            <input
                                                type={life.type}
                                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-slate-300 appearance-none text-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                placeholder={life.text}
                                                {...register(life.name, {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Favourites section */}
                        <div className="pl-6 mt-2 ">
                            {Favourites.map((favs, index) => (
                                <div key={index}>
                                    <div className="flex flex-row" key={index}>
                                        <div className="basis-1/3 flex justify-start items-center text-lg">
                                            <label htmlFor="" className="pl-2 text-black">
                                                {favs.label}
                                            </label>
                                        </div>
                                        <div className="basis-2/3 px-4">
                                            <input
                                                type="text"
                                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-slate-300 appearance-none text-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                placeholder={favs.text}
                                                {...register(`${favs.name}`, {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* misc section */}
                        <div className="pl-6 mt-2 ">
                            {miscellaneous.map((miscs, index) => {
                                const selectedValue = watch(miscs.name);
                                return (
                                    <div className="py-1" key={index}>
                                        <div className="flex flex-row" key={index}>
                                            <div className="basis-1/3 flex justify-start items-center text-lg">
                                                <label htmlFor="" className="pl-2 text-black">
                                                    {miscs.label}
                                                </label>
                                            </div>
                                            <div className="basis-2/3 px-4 flex items-center">
                                                <select
                                                    className="w-[75%] rounded-lg text-black"
                                                    {...register(miscs.name, {
                                                        required: true,
                                                        onChange: (e) => {
                                                            if (e.target.value !== 'Other') {
                                                                setValue(`${miscs.name}_Other`, '');
                                                            }
                                                        },
                                                    })}
                                                >
                                                    <option value="">{miscs.text}</option>
                                                    {miscs.options?.map((option, index) => (
                                                        <option key={index}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedValue === 'Other' && (
                                            <div className="flex flex-row py-1">
                                                <div className="basis-1/3">{miscs.label}</div>
                                                <div className="basis-2/3 px-4">
                                                    <input
                                                        type="text"
                                                        className="w-[75%] rounded-lg text-black"
                                                        placeholder={`Enter your ${miscs.label.toLowerCase()}`}
                                                        {...register(`${miscs.name}_Other`, { required: true })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="flex flex-col justify-center items-center my-8">

                        <div>
                            <h1>Motto</h1>
                            <div className="pl-6">
                                {motto.map((life, index) => (
                                    <div key={index}>
                                        <div className="flex flex-row" key={index}>
                                            <div className="basis-1/3 flex justify-center items-center text-lg">
                                                <label htmlFor="" className="text-black">
                                                    {life.label}
                                                </label>
                                            </div>
                                            <div className="basis-2/3 px-4">
                                                <input
                                                    type="text"
                                                    className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-slate-300 appearance-none text-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                    placeholder={life.text}
                                                    {...register(life.name, {
                                                        required: true,
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-[50%] lg:flex lg:justify-center">
                            <h1 className="text-3xl font-bold pl-6 font-Philosopher">
                                Interests & Activities
                            </h1>
                        </div>
                        <div className="pt-6 lg::justify-start">
                            {interests.map((int, index) => {
                                const selectedValue = watch(int.name);
                                return (
                                    <div key={index}>
                                        <div className="flex flex-row py-2 lg:gap-10">
                                            <div className="basis-2/5 flex justify-start lg:justify-end items-center text-lg">
                                                <label htmlFor={int.name} className="pl-2 font-semibold">
                                                    {int.label}
                                                </label>
                                            </div>
                                            <div className="basis-3/5 px-4 flex items-center">
                                                <select
                                                    className="w-full rounded-lg text-black flex items-center text-lg border-2 border-black"
                                                    {...register(int.name, {
                                                        required: true,
                                                        onChange: (e) => {
                                                            if (e.target.value !== 'Other') {
                                                                setValue(`${int.name}_Other`, '');
                                                            }
                                                        },
                                                    })}
                                                >
                                                    <option value="" selected>{int.text}</option>
                                                    {int.options.map((option, index) => (
                                                        <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedValue === 'Other' && (
                                            <div className="flex flex-row py-1">
                                                <div className="basis-1/3">{int.label}</div>
                                                <div className="basis-2/3 px-4">
                                                    <input
                                                        type="text"
                                                        className="w-[75%] rounded-lg text-black"
                                                        placeholder={`Enter your ${int.label.toLowerCase()}`}
                                                        {...register(`${int.name}_Other`, { required: true })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div>
                        <div className="flex flex-col justify-center items-center my-8">
                            <div className="w-full lg:flex lg:justify-center">
                                <h1 className="text-3xl font-bold pl-6 font-Philosopher">Professional Details:</h1>
                            </div>
                            <div className="w-full pt-6">
                                <div className="lg:w-[40%] lg:flex lg:justify-end">
                                    <h3 className="text-2xl font-semibold pl-6 underline lg:mr-[2.5rem] font-Philosopher">
                                        Career :
                                    </h3>
                                </div>
                                <div className="lg:flex lg:justify-center">
                                    <div className="pt-2">
                                        {professional.map((prof, index) => {
                                            const selectedValue = watch(prof.name);
                                            return (
                                                <div key={index}>
                                                    <div className="flex flex-row py-2 lg:gap-10">
                                                        <div className="basis-1/3 flex justify-start lg:justify-end lg:w-[50%] items-center text-lg">
                                                            <label htmlFor={prof.name} className="pl-4 font-semibold">
                                                                {prof.label}
                                                            </label>
                                                        </div>
                                                        <div className="basis-2/3 px-4 flex items-center lg:justify-start lg:w-[50%]">
                                                            <select
                                                                className="w-full rounded-lg text-black items-center text-lg lg:w-[70%] border-2 border-black"
                                                                {...register(prof.name, {
                                                                    required: true,
                                                                    onChange: (e) => {
                                                                        if (e.target.value !== 'Other') {
                                                                            setValue(`${prof.name}_Other`, '');
                                                                        }
                                                                    },
                                                                })}
                                                            >
                                                                <option value="">{prof.text}</option>
                                                                {prof.options.map((option, index) => (
                                                                    <option key={index} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {selectedValue === 'Other' && (
                                                        <div className="flex flex-row py-1">
                                                            <div className="basis-1/3">{prof.label}</div>
                                                            <div className="basis-2/3 px-4">
                                                                <input
                                                                    type="text"
                                                                    className="w-[75%] rounded-lg text-black"
                                                                    placeholder={`Enter your ${prof.label.toLowerCase()}`}
                                                                    {...register(`${prof.name}_Other`, { required: true })}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h1>Perosnal Values</h1>
                                <div className="pl-6 mt-2 ">
                                    {personalValues.map((value, index) => (
                                        <div className="py-1" key={index}>
                                            <div className="flex flex-row" key={index}>
                                                <div className="basis-1/3 flex justify-start items-center text-lg">
                                                    <label htmlFor="" className="pl-2 text-black">
                                                        {value.label}
                                                    </label>
                                                </div>
                                                <div className="basis-2/3 px-4 flex items-center">
                                                    <select
                                                        className="w-[75%] rounded-lg text-black"
                                                        {...register(value.name, { required: true })}
                                                    >
                                                        <option value="">{value.text}</option>
                                                        {value.options?.map((option, index) => (
                                                            <option key={index}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="flex flex-col justify-center items-center my-8">
                        <div className="w-full lg:flex lg:justify-center">
                            <h1 className="text-3xl font-bold pl-6 font-Philosopher">Others</h1>
                        </div>
                        <div className="py-8">
                            {additionalInfo.map((info, index) => (
                                <div className="flex flex-row" key={index}>
                                    <div className="basis-1/3 flex justify-start items-center text-lg">
                                        <label htmlFor="" className="">
                                            {info.label}
                                        </label>
                                    </div>
                                    <div className="basis-2/3 px-4">
                                        <input
                                            type="text"
                                            className="block py-2.5 px-0 w-full text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                            placeholder={info.text}
                                            {...register(info.name, { required: true })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col justify-center items-center my-8">
            <div className="flex justify-center lg:mt-4 lg:flex lg:justify-center">
                <div className="w-[90%] h-4 bg-gray-300 rounded-full lg:w-[50%]">
                    <div
                        className="h-4 bg-blue-500 rounded-full"
                        style={{ width: `${(progressBar / 5) * 100}%` }}
                    ></div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-Kanit">
                <div className="space-y-4">
                    {formParts()}
                </div>

                <div className="footer">
                    <button
                        type="button"
                        disabled={progressBar === 0}
                        onClick={() => {
                            setProgressBar((currPage) => currPage - 1);
                        }}
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        disabled={progressBar === 5}
                        onClick={() => {
                            setProgressBar((currPage) => currPage + 1);
                        }}
                    >
                        Next
                    </button>
                    {progressBar === 5 && (
                        <button type="submit" disabled={personalLoading}>{personalLoading ? "Hold On" : "Submit"}</button>
                    )}
                </div>
            </form >
        </div>
    );
};

export default InputVCard;

import { Personal } from "@/types/card_types";
import { FcAbout, FcBriefcase, FcFeedback } from "react-icons/fc";
import { FcBusinessContact } from "react-icons/fc";
import { FcCloth } from "react-icons/fc";
import { FcComboChart } from "react-icons/fc";
import { FcDataProtection } from "react-icons/fc";
import { GrLinkNext } from "react-icons/gr";
import { IconType } from "react-icons";
import { useState } from "react";
import * as icons from 'simple-icons';
import { IoMdLink } from "react-icons/io";
import { Link } from "react-router-dom";

interface PropsType {
    card: Personal | null;
}

const PersonalComponent = ({ card }: PropsType) => {

    const birthDate = card?.dateOfBirth ? new Date(card?.dateOfBirth) : null;
    const formattedDate = birthDate ? birthDate.toLocaleDateString() : null;

    const data = [
        {
            label: "Lifestyle",
            icon: FcBriefcase as IconType,
            data: [
                { label: "Date of Birth", value: formattedDate ?? "" },
                { label: "Home Town", value: card?.homeTown },
                { label: "Current City", value: card?.currentCity },
                { label: "Languages", value: card?.languages },
                { label: "Mobile Number", value: card?.mobileNumer },
                { label: "Home Number", value: card?.homeNumber },
                { label: "Work Number", value: card?.workNumber },
                { label: "Other Number", value: card?.otherNumber },
                { label: "Personal Email", value: card?.personalEmail },
                { label: "Work Email", value: card?.workEmail },
                { label: "Other Email", value: card?.otherEmail },
                { label: "About Me", value: card?.aboutMe },
            ]
        },
        {
            label: "Professional",
            icon: FcDataProtection as IconType,
            data: [
                { label: "Current Occupation", value: card?.currentOcupation === "Other" ? card.currentOcupation_Other : card?.currentOcupation },
                { label: "Career Goals", value: card?.careerAspiation === "Other" ? card.careerAspiation_Other : card?.careerAspiation },
                { label: "Education", value: card?.education === "Other" ? card.education_Other : card?.education },
                { label: "Skills", value: card?.skills === "Other" ? card.skills_Other : card?.skills },
            ]
        },
        {
            label: "Favourites",
            icon: FcBusinessContact as IconType,
            data: [
                { label: "Fav Music", value: card?.music },
                { label: "Fav Colour", value: card?.color },
                { label: "Fav City", value: card?.city },
                { label: "Fav-Destination", value: card?.travelDestination },
                { label: "Fav Season", value: card?.season },
                { label: "Unique Skills", value: card?.uniqueSkills },
                { label: "Fav-Cuisine", value: card?.cuisine },
                { label: "Fav Beverage", value: card?.beverage }
            ]
        },
        {
            label: "Quotes & Beliefs",
            icon: FcFeedback as IconType,
            data: [
                { label: "Inspirational Quotes", value: card?.inspirationalQuotes },
                { label: "Funny Quotes", value: card?.funnyQuotes },
                { label: "Motivational Quotes", value: card?.motivationalQuotes },
                { label: "Other Quotes", value: card?.otherQuotes },
                { label: "Spiritual Beliefs", value: card?.spiritual },
                { label: "Core Beliefs", value: card?.core },
                { label: "Philosophy", value: card?.philosophy },
                { label: "Weird Beliefs", value: card?.weirdBelief },
                { label: "Social Causes", value: card?.socialCause },
                { label: "Global Issues", value: card?.globalIssues }
            ]
        },
        {
            label: "Miscellaneous",
            icon: FcCloth as IconType,
            data: [
                { label: "Pet Lover?", value: card?.petLover },
                { label: "Party Enthusiast?", value: card?.partyEnthusiast },
                { label: "Smoker?", value: card?.smoker },
                { label: "Marital Status?", value: card?.maritalStatus },
                { label: "Relationship?", value: card?.relationshipStatus },
                { label: "Morning/Night Person?", value: card?.morningPerson },
                { label: "Sleeping Habits?", value: card?.sleepingHabit },
                { label: "Dietary Preferences", value: card?.diet === "Other" ? card?.diet_Other : card?.diet },
                { label: "Fitness Routine", value: card?.fitnessRoutine }
            ]
        },
        {
            label: "Interests",
            icon: FcComboChart as IconType,
            data: [
                { label: "Preferred Mode of Travel", value: card?.travelMode === "Other" ? card?.travelMode_Other : card?.travelMode },
                { label: "Fav Movies/TV Shows", value: card?.genre === "Other" ? card.genre_Other : card?.genre },
                { label: "Sports Activities", value: card?.sports === "Other" ? card?.sports_Other : card?.sports },
                { label: "Artistic Hobbies", value: card?.artistisPursuits === "Other" ? card.artistisPursuits_Other : card?.artistisPursuits },
                { label: "Gaming Preferences", value: card?.gaming === "Other" ? card.gaming_Other : card?.gaming },
                { label: "Collecting Hobby/Interest", value: card?.collectignHobby === "Other" ? card.collectignHobby_Other : card?.collectignHobby },
                { label: "Coffee or Tea?", value: card?.coffee === "Other" ? card.coffee_Other : card?.coffee },
                { label: "Cooking Skills", value: card?.cookingSkills === "Other" ? card.cookingSkills_Other : card?.cookingSkills }
            ]
        },
        {
            label: "Additional",
            icon: FcAbout as IconType,
            data: [
                { label: "Other Interests", value: card?.otherInterests },
                { label: "Future Goals", value: card?.futureGoals },
                { label: "Currently Learning", value: card?.current },
                { label: "Most Unusual Experience", value: card?.unusualExperinece },
                { label: "Strangest Habit I Have", value: card?.strangeHabits }
            ]
        }
    ];


    const [expandedSections, setExpandedSections] = useState<boolean[]>(new Array(data.length).fill(false));

    const toggleSection = (index: number) => {
        setExpandedSections((prev) =>
            prev.map((expanded, i) => (i === index ? !expanded : expanded))
        );
    };

    const setSvg = (input: string) => {
        const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
        const icon = icons[platformKey as keyof typeof icons];
        if (icon) {
            return icon.path;
        } else {
            return "";
        }
    }
    // bg-[#346CD9] shape-container
    return (
        <div className="bg-[#ACC5F5] bg-[url('/personal_bg.png')] overflow-x-hidden relative bg-auto bg-center pb-16 md:pb-6">
            <img src="/personal_curve.png" alt="" className="absolute md:right-10 md:top-10 md:rotate-6 z-10 " />
            <div className="relative rounded-[10px] mb-10">
                <img src="/card_header_bg.png" alt="" className="w-full h-80"/>
                <div className="p-10 absolute top-5">
                    <div className="flex justify-start pl-6 py-4">
                        <p className="text-white font-semibold">Individual Data</p>
                    </div>
                    <div className="text-white text-5xl lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div>
                </div>
            </div>

            <div className="flex justify-center w-full">
                <div className="w-[90%]">
                    {/* <div className="my-8 flex flex-col gap-y-2 py-2">
                        <p className="text-lg font-semibold">Name:</p>
                        <p className="bg-white border-2 border-slate-200 w-full rounded-lg px-3 py-2 text-lg shadow-lg">{card?.name}</p>
                    </div> */}

                    <div className="bg-white rounded-xl mb-16 pb-8">

                        <div className="flex justify-center">
                            <div className="w-[80%] flex flex-nowrap justify-between md:gap-2 gap-5 pb-6 mt-6">
                                {card?.socialMedia.map((item: any, index: number) => (
                                    <Link key={index} to={item.name} target="blank" className="flex w-20 h-14 md:w-16 md:h-16 shadow-lg justify-center border-2 rounded-full py-2.5 items-center">
                                        {setSvg(item.label) === "" ? (
                                            <IoMdLink size={30} />
                                        ) : (
                                            <svg
                                                className="fill-current"
                                                width="25"
                                                height="25"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d={setSvg(item.label)}
                                                    fill="black"
                                                />
                                            </svg>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col justify-center">
                                <div className="flex justify-center ">
                                    <div className="w-[80%] flex items-center border-2 h-16 border-black mt-6 rounded-full">
                                        <button
                                            className="w-full border-2 border-black px-4 border-none flex flex-row"
                                            onClick={() => toggleSection(index)}
                                            type="button"
                                        >
                                            <div className="flex flex-row w-full">
                                                <div className="basis-1/5 flex items-center justify-center">
                                                    {item.icon ? (
                                                        <item.icon className="w-[2rem] h-[2rem]" />
                                                    ) : (
                                                        <FcBriefcase className="w-[2rem] h-[2rem]" />
                                                    )}
                                                </div>
                                                <div className="basis-3/5 flex justify-start items-center font-Kanit">
                                                    <p className="pl-2 text-md font-bold pt-1">{item.label}</p>
                                                </div>
                                                <div className="basis-1/5 flex justify-end items-center">
                                                    <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    {expandedSections[index] && (
                                        <div className="relative bg-slate-200 divide-gray-100 rounded-lg shadow-lg w-[80%] dark:bg-gray-700 py-2 mt-2 flex justify-center">
                                            <ul className="w-full mx-6 md:mx-16 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                                {item.data && (
                                                    <div className="flex flex-col space-y-2">
                                                        {item.data.map((item, index) => (
                                                            <div key={index} className="flex flex-col md:flex-row justify-center md:items-center md:gap-4">
                                                                <div className="md:basis-1/3 flex justify-start items-center text-lg text-black"><p className="text-sm font-semibold">{item.label}:</p></div>
                                                                <div className="md:basis-2/3 flex justify-start items-center">
                                                                    <p className="block py-2.5 px-0 w-full text-base bg-transparent border-0 border-b-2 border-gray-600 appearance-none text-gray-600 focus:outline-none focus:ring-0 focus:border-gray-600">{item.value}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalComponent;
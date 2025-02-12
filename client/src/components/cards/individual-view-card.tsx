// import { Personal } from '@/types/card_types';
import { useState } from 'react'
import { FavouritesIndividualDisplay, InterestsIndividualDisplay, LifeStyleIndividualDisplay, MiscellaneousIndividualDisplay, OthersIndividualDisplay, ProfessionalIndividualDisplay } from '@/constants/cards/display';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { setSvg } from '@/lib/helper';

const IndividualViewCard = () => {
    // const birthDate = card?.dateOfBirth ? new Date(card?.dateOfBirth) : null;
    // const formattedDate = birthDate ? birthDate.toLocaleDateString() : null;

    // const data = [
    //     {
    //         label: "Lifestyle",
    //         icon: FcBriefcase as IconType,
    //         data: [
    //             { label: "Date of Birth", value: formattedDate ?? "" },
    //             { label: "Home Town", value: card?.homeTown },
    //             { label: "Current City", value: card?.currentCity },
    //             { label: "Languages", value: card?.languages },
    //             { label: "Mobile Number", value: card?.mobileNumber },
    //             { label: "Home Number", value: card?.homeNumber },
    //             { label: "Work Number", value: card?.workNumber },
    //             { label: "Other Number", value: card?.otherNumber },
    //             { label: "Personal Email", value: card?.personalEmail },
    //             { label: "Work Email", value: card?.workEmail },
    //             { label: "Other Email", value: card?.otherEmail },
    //             { label: "About Me", value: card?.aboutMe },
    //         ]
    //     },
    //     {
    //         label: "Professional",
    //         icon: FcDataProtection as IconType,
    //         data: [
    //             { label: "Current Occupation", value: card?.currentOcupation === "Other" ? card.currentOcupation_Other : card?.currentOcupation },
    //             { label: "Career Goals", value: card?.careerAspiation === "Other" ? card.careerAspiation_Other : card?.careerAspiation },
    //             { label: "Education", value: card?.education === "Other" ? card.education_Other : card?.education },
    //             { label: "Skills", multiple: true, originValue: card?.skills, value: card?.skills === "Other" ? card.skills_Other : card?.skills },
    //         ]
    //     },
    //     {
    //         label: "Favourites",
    //         icon: FcBusinessContact as IconType,
    //         data: [
    //             { label: "Fav Music", value: card?.music },
    //             { label: "Fav Colour", value: card?.color },
    //             { label: "Fav City", value: card?.city },
    //             { label: "Fav-Destination", value: card?.travelDestination },
    //             { label: "Fav Season", value: card?.season },
    //             { label: "Unique Skills", value: card?.uniqueSkills },
    //             { label: "Fav-Cuisine", value: card?.cuisine },
    //             { label: "Fav Beverage", value: card?.beverage }
    //         ]
    //     },
    //     {
    //         label: "Quotes & Beliefs",
    //         icon: FcFeedback as IconType,
    //         data: [
    //             { label: "Inspirational Quotes", value: card?.inspirationalQuotes },
    //             { label: "Funny Quotes", value: card?.funnyQuotes },
    //             { label: "Motivational Quotes", value: card?.motivationalQuotes },
    //             { label: "Other Quotes", value: card?.otherQuotes },
    //             { label: "Spiritual Beliefs", value: card?.spiritual === "Other" ? card.spiritual_Other : card?.spiritual },
    //             { label: "Core Beliefs", multiple: true, originValue: card?.core, value: card?.core === "Other" ? card.core_Other : card?.core },
    //             { label: "Philosophy", value: card?.philosophy === "Other" ? card?.philosophy_Other : card?.philosophy },
    //             { label: "Weird Beliefs", value: card?.weirdBelief },
    //             { label: "Social Causes", multiple: true, originValue: card?.socialCause, value: card?.socialCause === "Other" ? card?.socialCause_Other : card?.socialCause },
    //             { label: "Global Issues", value: card?.globalIssues }
    //         ]
    //     },
    //     {
    //         label: "Miscellaneous",
    //         icon: FcCloth as IconType,
    //         data: [
    //             { label: "Pet Lover?", value: card?.petLover },
    //             { label: "Party Enthusiast?", value: card?.partyEnthusiast },
    //             { label: "Smoker?", value: card?.smoker },
    //             { label: "Marital Status?", value: card?.maritalStatus },
    //             { label: "Relationship?", value: card?.relationshipStatus },
    //             { label: "Morning/Night Person?", value: card?.morningPerson },
    //             { label: "Sleeping Habits?", value: card?.sleepingHabit },
    //             { label: "Dietary Preferences", value: card?.diet === "Other" ? card?.diet_Other : card?.diet },
    //             { label: "Fitness Routine", value: card?.fitnessRoutine }
    //         ]
    //     },
    //     {
    //         label: "Interests",
    //         icon: FcComboChart as IconType,
    //         data: [
    //             { label: "Preferred Mode of Travel", multiple: true, originValue: card?.travelMode, value: card?.travelMode === "Other" ? card?.travelMode_Other : card?.travelMode },
    //             { label: "Fav Movies/TV Shows", multiple: true, originValue: card?.genre, value: card?.genre === "Other" ? card.genre_Other : card?.genre },
    //             { label: "Sports Activities", multiple: true, originValue: card?.sports, value: card?.sports === "Other" ? card?.sports_Other : card?.sports },
    //             { label: "Artistic Hobbies", multiple: true, originValue: card?.artistisPursuits, value: card?.artistisPursuits === "Other" ? card.artistisPursuits_Other : card?.artistisPursuits },
    //             { label: "Gaming Preferences", multiple: true, originValue: card?.gaming, value: card?.gaming === "Other" ? card.gaming_Other : card?.gaming },
    //             { label: "Collecting Hobby/Interest", multiple: true, originValue: card?.collectignHobby, value: card?.collectignHobby === "Other" ? card.collectignHobby_Other : card?.collectignHobby },
    //             { label: "Coffee or Tea?", value: card?.coffee === "Other" ? card.coffee_Other : card?.coffee },
    //             { label: "Cooking Skills", value: card?.cookingSkills === "Other" ? card.cookingSkills_Other : card?.cookingSkills }
    //         ]
    //     },
    //     {
    //         label: "Additional",
    //         icon: FcAbout as IconType,
    //         data: [
    //             { label: "Other Interests", value: card?.otherInterests },
    //             { label: "Future Goals", value: card?.futureGoals },
    //             { label: "Currently Learning", value: card?.current },
    //             { label: "Most Unusual Experience", value: card?.unusualExperinece },
    //             { label: "Strangest Habit I Have", value: card?.strangeHabits }
    //         ]
    //     }
    // ];

    const accordonData = [
        {
            id: 1,
            name: "Lifestyle",
            svg: LifeStyleIndividualDisplay,
            data: [
                { label: "Date of Birth", value: "" },
                { label: "Home Town", value: "Bongaigaon" },
                { label: "Current City", value: "" },
                { label: "Languages", value: "" },
            ]
        },
        {
            id: 2,
            name: "Favourites",
            svg: FavouritesIndividualDisplay
        },
        {
            id: 3,
            name: "Miscellaneous",
            svg: MiscellaneousIndividualDisplay
        },
        {
            id: 4,
            name: "Interests & Activities",
            svg: InterestsIndividualDisplay
        },
        {
            id: 5,
            name: "Professional Details",
            svg: ProfessionalIndividualDisplay
        },
        {
            id: 6,
            name: "Others",
            svg: OthersIndividualDisplay
        }
    ]

    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (id: number) => {
        if (selected === id) {
            setSelected(null);
            return;
        }
        setSelected(id);
    }

    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className='flex flex-wrap justify-center items-center gap-2 my-4'>
                {["instagram", "youtube", "spotify", "discord", "x"].map((item, index) => (
                    <div key={index} className='h-14 w-14 border shadow-sm p-1 rounded-full bg-white flex justify-center items-center'>
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
                                d={setSvg(item)}
                                fill="black"
                            />
                        </svg>
                    </div>
                ))}
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-3.5'>
                {(selected ? accordonData.filter(arr => arr.id === selected) : accordonData).map(acc => (
                    <>
                        <div key={acc.id} onClick={() => handleSelect(acc.id)} className='select-none w-full bg-white border-[1.5px] border-[#292929] p-2 flex justify-between items-center rounded-full'>
                            <div className='flex justify-between items-center gap-2'>
                                <img src={acc.svg} alt="" />
                                <p className='text-lg text-[#292929] font-bold truncate'>{acc.name}</p>
                            </div>
                            {selected === acc.id ? (
                                <ArrowDown size={28} strokeWidth={1.5} className="text-[#292929]" />
                            ) : (
                                <ArrowRight size={28} strokeWidth={1.5} className="text-[#292929]" />
                            )}
                        </div>
                        {selected === acc.id && (
                            <div className='w-full flex flex-col justify-start items-start gap-2 px-3'>
                                {acc.data && acc.data.map(dat => (
                                    <div key={dat.label} className='flex flex-wrap items-center gap-2'>
                                        <p className='text-md text-[#454545] font-bold whitespace-nowrap'>{dat.label} :</p>
                                        <p className='text-md text-[#2E2E2E] whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    )
}

export default IndividualViewCard;
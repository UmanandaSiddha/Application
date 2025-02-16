import { useState } from 'react'
import { FavouritesIndividualDisplay, InterestsIndividualDisplay, LifeStyleIndividualDisplay, MiscellaneousIndividualDisplay, OthersIndividualDisplay, ProfessionalIndividualDisplay } from '@/constants/cards/display';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { setSvg } from '@/lib/helper';
import { IndividualData } from '@/types/type';
import { Link } from 'react-router-dom';

interface PropTypes {
    cardData: IndividualData;
}

const IndividualViewCard = ({ cardData }: PropTypes) => {

    const accordonData = [
        {
            id: 1,
            name: "Lifestyle",
            svg: LifeStyleIndividualDisplay,
            data: [
                { label: "Date of Birth", value: cardData.dateOfBirth || "" },
                { label: "Home Town", value: cardData.homeTown || "" },
                { label: "Current City", value: cardData.currentCity || "" },
                { label: "Languages", value: cardData.languages || "" },
                { label: "Marital Status", value: cardData.maritalStatus || "" },
                { label: "Relationship Status", value: cardData.relationshipStatus || "" },
                { label: "Fitness Routine", value: cardData.fitnessRoutine || "" },
                { label: "Diet", value: cardData.diet === "Other" ? cardData.diet_Other || "" : cardData.diet || "" },
                { label: "Sleeping Habit", value: cardData.sleepingHabit || "" },
                { label: "Morning Person", value: cardData.morningPerson || "" },
                { label: "Travel Mode", value: cardData.travelMode === "Other" ? cardData.travelMode_Other || "" : cardData.travelMode || "" }
            ]
        },
        {
            id: 2,
            name: "Favourites",
            svg: FavouritesIndividualDisplay,
            data: [
                { label: "Color", value: cardData.color || "" },
                { label: "City", value: cardData.city || "" },
                { label: "Travel Destination", value: cardData.travelDestination || "" },
                { label: "Season", value: cardData.season || "" },
                { label: "Cuisine", value: cardData.cuisine || "" },
                { label: "Beverage", value: cardData.beverage || "" },
                { label: "Music", value: cardData.music || "" },
                { label: "Genre", value: cardData.genre === "Other" ? cardData.genre_Other || "" : cardData.genre || "" },
                { label: "Sports", value: cardData.sports === "Other" ? cardData.sports_Other || "" : cardData.sports || "" },
                { label: "Artistic Pursuits", value: cardData.artistisPursuits === "Other" ? cardData.artistisPursuits_Other || "" : cardData.artistisPursuits || "" },
                { label: "Gaming", value: cardData.gaming === "Other" ? cardData.gaming_Other || "" : cardData.gaming || "" },
                { label: "Collecting Hobby", value: cardData.collectignHobby === "Other" ? cardData.collectignHobby_Other || "" : cardData.collectignHobby || "" },
                { label: "Coffee", value: cardData.coffee === "Other" ? cardData.coffee_Other || "" : cardData.coffee || "" },
                { label: "Cooking Skills", value: cardData.cookingSkills === "Other" ? cardData.cookingSkills_Other || "" : cardData.cookingSkills || "" }
            ]
        },
        {
            id: 3,
            name: "Miscellaneous",
            svg: MiscellaneousIndividualDisplay,
            data: [
                { label: "Weird Belief", value: cardData.weirdBelief || "" },
                { label: "Other Interests", value: cardData.otherInterests || "" },
                { label: "Future Goals", value: cardData.futureGoals || "" },
                { label: "Current", value: cardData.current || "" },
                { label: "Unusual Experience", value: cardData.unusualExperinece || "" },
                { label: "Strange Habits", value: cardData.strangeHabits || "" },
                { label: "Social Cause", value: cardData.socialCause === "Other" ? cardData.socialCause_Other || "" : cardData.socialCause || "" },
                { label: "Philosophy", value: cardData.philosophy === "Other" ? cardData.philosophy_Other || "" : cardData.philosophy || "" },
                { label: "Spiritual", value: cardData.spiritual === "Other" ? cardData.spiritual_Other || "" : cardData.spiritual || "" },
                { label: "Core Beliefs", value: cardData.core === "Other" ? cardData.core_Other || "" : cardData.core || "" }
            ]
        },
        {
            id: 4,
            name: "Interests & Activities",
            svg: InterestsIndividualDisplay,
            data: [
                { label: "Global Issues", value: cardData.globalIssues || "" },
                { label: "Social Cause", value: cardData.socialCause === "Other" ? cardData.socialCause_Other || "" : cardData.socialCause || "" },
                { label: "Pet Lover", value: cardData.petLover || "" },
                { label: "Party Enthusiast", value: cardData.partyEnthusiast || "" },
                { label: "Smoker", value: cardData.smoker || "" }
            ]
        },
        {
            id: 5,
            name: "Professional Details",
            svg: ProfessionalIndividualDisplay,
            data: [
                { label: "Current Occupation", value: cardData.currentOcupation === "Other" ? cardData.currentOcupation_Other || "" : cardData.currentOcupation || "" },
                { label: "Career Aspiration", value: cardData.careerAspiation === "Other" ? cardData.careerAspiation_Other || "" : cardData.careerAspiation || "" },
                { label: "Education", value: cardData.education === "Other" ? cardData.education_Other || "" : cardData.education || "" },
                { label: "Skills", value: cardData.skills === "Other" ? cardData.skills_Other || "" : cardData.skills || "" }
            ]
        },
        {
            id: 6,
            name: "Others",
            svg: OthersIndividualDisplay,
            data: [
                { label: "Inspirational Quotes", value: cardData.inspirationalQuotes || "" },
                { label: "Funny Quotes", value: cardData.funnyQuotes || "" },
                { label: "Motivational Quotes", value: cardData.motivationalQuotes || "" },
                { label: "Other Quotes", value: cardData.otherQuotes || "" }
            ]
        }
    ];

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
            {cardData.socialMedia && (
                <div className='flex flex-wrap justify-center items-center gap-2 my-4'>
                    {cardData.socialMedia.map((item, index) => (
                        <Link key={index} to={item.link} target='blank' className='h-14 w-14 border shadow-sm p-1 rounded-full bg-white flex justify-center items-center'>
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
                        </Link>
                    ))}
                </div>
            )}
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AnimalData, CreatorData, MedicalData, IndividualData, BotanyData, ICard } from "../../types/type";
import DefaultLayout from "../../layout/DefaultLayout";
import Loader from "../../components/Loader";
import API from "../../config/apiConfig";

type CardType = "BOTANICAL"
    | "INDIVIDUAL"
    | "MEDICAL"
    | "CREATOR"
    | "ANIMAL";

interface CardByIdResponse {
    success: boolean;
    card: ICard;
}

const CardDetails = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const paramsType = (searchParams.get("type") as CardType) || "BOTANICAL";
    // const [type, setType] = useState<CardType>(paramsType);
    let type = paramsType;
    const [card, setCard] = useState<ICard | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCard = async () => {
        setLoading(true);
        try {
            const { data }: { data: CardByIdResponse } = await API.get(`/admin/cards/byId/${id!}?type=${type}`);
            setCard(data.card);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setCard(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCard();
    }, [id, type]);

    const handleShare = () => {
        if (card && type) {
            window.navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/d/${card.shortCode}`);
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    }

    const handleDelete = async () => {
        try {
            await API.delete(`/admin/cards/byId/${id!}?type=${type}`);
            toast.success("Card deleted successfully");
            navigate(-1)
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setOpen(false);
        }
    }

    const renderCard = () => {
        switch (type) {
            case "BOTANICAL":
                let botanicalCardData = card && (card.data as BotanyData);
                const botanicalData = [
                    { label: "Scientific Name", value: botanicalCardData?.scientificName || "" },
                    { label: "Water Requirement", value: botanicalCardData?.waterRequirement || "" },
                    { label: "Sunlight Requirement", value: botanicalCardData?.sunlightRequirement || "" },
                    { label: "Common Pests & Diseases", value: botanicalCardData?.commonPestsDiseases || "" },
                    { label: "Description", value: botanicalCardData?.description || "" },
                    { label: "Height", value: botanicalCardData?.height || "" },
                    { label: "Leaf Type", value: botanicalCardData?.leafType || "" },
                    { label: "Symptoms", value: botanicalCardData?.symptoms || "" },
                    { label: "Nutritional Needs", value: botanicalCardData?.nutritionalNeeds || "" },
                    { label: "Care Instructions", value: botanicalCardData?.careInstructions || "" },
                    { label: "Special Features", value: botanicalCardData?.specialFeatures || "" },
                    { label: "Caretaker Mobile Number", value: botanicalCardData?.caretakerMobileNumber || "" },
                    { label: "Additional Notes", value: botanicalCardData?.additionalNotes || "" }
                ]
                return card && card.data && (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        {botanicalData.map(dat => (
                            <div key={dat.label} className='flex flex-wrap items-center gap-2'>
                                <p className='text-md text-white font-bold whitespace-nowrap'>{dat.label} :</p>
                                <p className='text-md text-white whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                            </div>
                        ))}
                        <Link to={`/users/details?id=${card?.userId?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.userId?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "INDIVIDUAL":
                let individualCardData = card && (card.data as IndividualData);
                const individualData = [
                    {
                        id: 1,
                        name: "Lifestyle",
                        data: [
                            { label: "Date of Birth", value: individualCardData?.dateOfBirth || "" },
                            { label: "Home Town", value: individualCardData?.homeTown || "" },
                            { label: "Current City", value: individualCardData?.currentCity || "" },
                            { label: "Languages", value: individualCardData?.languages || "" },
                            { label: "Marital Status", value: individualCardData?.maritalStatus || "" },
                            { label: "Relationship Status", value: individualCardData?.relationshipStatus || "" },
                            { label: "Fitness Routine", value: individualCardData?.fitnessRoutine || "" },
                            { label: "Diet", value: individualCardData?.diet === "Other" ? individualCardData?.diet_Other || "" : individualCardData?.diet || "" },
                            { label: "Sleeping Habit", value: individualCardData?.sleepingHabit || "" },
                            { label: "Morning Person", value: individualCardData?.morningPerson || "" },
                            { label: "Travel Mode", value: individualCardData?.travelMode === "Other" ? individualCardData?.travelMode_Other || "" : individualCardData?.travelMode || "" }
                        ]
                    },
                    {
                        id: 2,
                        name: "Favourites",
                        data: [
                            { label: "Color", value: individualCardData?.color || "" },
                            { label: "City", value: individualCardData?.city || "" },
                            { label: "Travel Destination", value: individualCardData?.travelDestination || "" },
                            { label: "Season", value: individualCardData?.season || "" },
                            { label: "Cuisine", value: individualCardData?.cuisine || "" },
                            { label: "Beverage", value: individualCardData?.beverage || "" },
                            { label: "Music", value: individualCardData?.music || "" },
                            { label: "Genre", value: individualCardData?.genre === "Other" ? individualCardData?.genre_Other || "" : individualCardData?.genre || "" },
                            { label: "Sports", value: individualCardData?.sports === "Other" ? individualCardData?.sports_Other || "" : individualCardData?.sports || "" },
                            { label: "Artistic Pursuits", value: individualCardData?.artistisPursuits === "Other" ? individualCardData?.artistisPursuits_Other || "" : individualCardData?.artistisPursuits || "" },
                            { label: "Gaming", value: individualCardData?.gaming === "Other" ? individualCardData?.gaming_Other || "" : individualCardData?.gaming || "" },
                            { label: "Collecting Hobby", value: individualCardData?.collectignHobby === "Other" ? individualCardData?.collectignHobby_Other || "" : individualCardData?.collectignHobby || "" },
                            { label: "Coffee", value: individualCardData?.coffee === "Other" ? individualCardData?.coffee_Other || "" : individualCardData?.coffee || "" },
                            { label: "Cooking Skills", value: individualCardData?.cookingSkills === "Other" ? individualCardData?.cookingSkills_Other || "" : individualCardData?.cookingSkills || "" }
                        ]
                    },
                    {
                        id: 3,
                        name: "Miscellaneous",
                        data: [
                            { label: "Weird Belief", value: individualCardData?.weirdBelief || "" },
                            { label: "Other Interests", value: individualCardData?.otherInterests || "" },
                            { label: "Future Goals", value: individualCardData?.futureGoals || "" },
                            { label: "Current", value: individualCardData?.current || "" },
                            { label: "Unusual Experience", value: individualCardData?.unusualExperinece || "" },
                            { label: "Strange Habits", value: individualCardData?.strangeHabits || "" },
                            { label: "Social Cause", value: individualCardData?.socialCause === "Other" ? individualCardData?.socialCause_Other || "" : individualCardData?.socialCause || "" },
                            { label: "Philosophy", value: individualCardData?.philosophy === "Other" ? individualCardData?.philosophy_Other || "" : individualCardData?.philosophy || "" },
                            { label: "Spiritual", value: individualCardData?.spiritual === "Other" ? individualCardData?.spiritual_Other || "" : individualCardData?.spiritual || "" },
                            { label: "Core Beliefs", value: individualCardData?.core === "Other" ? individualCardData?.core_Other || "" : individualCardData?.core || "" }
                        ]
                    },
                    {
                        id: 4,
                        name: "Interests & Activities",
                        data: [
                            { label: "Global Issues", value: individualCardData?.globalIssues || "" },
                            { label: "Social Cause", value: individualCardData?.socialCause === "Other" ? individualCardData?.socialCause_Other || "" : individualCardData?.socialCause || "" },
                            { label: "Pet Lover", value: individualCardData?.petLover || "" },
                            { label: "Party Enthusiast", value: individualCardData?.partyEnthusiast || "" },
                            { label: "Smoker", value: individualCardData?.smoker || "" }
                        ]
                    },
                    {
                        id: 5,
                        name: "Professional Details",
                        data: [
                            { label: "Current Occupation", value: individualCardData?.currentOcupation === "Other" ? individualCardData?.currentOcupation_Other || "" : individualCardData?.currentOcupation || "" },
                            { label: "Career Aspiration", value: individualCardData?.careerAspiation === "Other" ? individualCardData?.careerAspiation_Other || "" : individualCardData?.careerAspiation || "" },
                            { label: "Education", value: individualCardData?.education === "Other" ? individualCardData?.education_Other || "" : individualCardData?.education || "" },
                            { label: "Skills", value: individualCardData?.skills === "Other" ? individualCardData?.skills_Other || "" : individualCardData?.skills || "" }
                        ]
                    },
                    {
                        id: 6,
                        name: "Others",
                        data: [
                            { label: "Inspirational Quotes", value: individualCardData?.inspirationalQuotes || "" },
                            { label: "Funny Quotes", value: individualCardData?.funnyQuotes || "" },
                            { label: "Motivational Quotes", value: individualCardData?.motivationalQuotes || "" },
                            { label: "Other Quotes", value: individualCardData?.otherQuotes || "" }
                        ]
                    }
                ];
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        {individualData.map(dat => (
                            <div key={dat.id} className="my-2">
                                <h2 className="text-white text-2xl font-semibold underline">{dat.name}</h2>
                                {dat.data.map(data => (
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <p className='text-md text-white font-bold whitespace-nowrap'>{data.label} :</p>
                                        <p className='text-md text-white whitespace-nowrap'>{data.value ? data.value : "----------"}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {individualCardData && individualCardData.socialMedia?.length > 0 ? individualCardData.socialMedia.map((link, index: number) => (
                            <Link
                                to={link.link}
                                target="blank"
                                className="w-full relative flex flex-col justify-center items-center py-3"
                                key={index}
                            >
                                <p key={index} className="text-white"><span className="font-semibold">{link.label}:</span> {link.link}</p>
                            </Link>
                        )) : (
                            <p className='text-center text-white text-lg'>No links available</p>
                        )}
                        <Link to={`/users/details?id=${card?.userId?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.userId?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "ANIMAL":
                let animalCardData = card && (card.data as AnimalData);
                const animalData = [
                    { label: "Sign Illness", value: animalCardData?.signIllness || "" },
                    { label: "Vaccination", value: animalCardData?.vaccination || "" },
                    { label: "Physical Description", value: animalCardData?.physicalDescription || "" },
                    { label: "Diet", value: animalCardData?.diet || "" },
                    { label: "Lifespan", value: animalCardData?.lifespan || "" },
                    { label: "Behavior", value: animalCardData?.behavior || "" },
                    { label: "Common Health", value: animalCardData?.commonHealth || "" },
                    { label: "Location", value: animalCardData?.location || "" },
                    { label: "Additional Notes", value: animalCardData?.additionalNotes || "" }
                ]
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        {animalData.map(dat => (
                            <div key={dat.label} className='flex flex-wrap items-center gap-2'>
                                <p className='text-md text-white font-bold whitespace-nowrap'>{dat.label} :</p>
                                <p className='text-md text-white whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                            </div>
                        ))}
                        <Link to={`/users/details?id=${card?.userId?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.userId?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "MEDICAL":
                let medicalCardData = card && (card.data as MedicalData);
                const medicalData = {
                    profile: [
                        {
                            label: "Gender",
                            value: medicalCardData?.gender || ""
                        }, {
                            label: "Age",
                            value: medicalCardData?.age || ""
                        }, {
                            label: "Height",
                            value: medicalCardData?.height || ""
                        }, {
                            label: "Weight",
                            value: medicalCardData?.weight || ""
                        }, {
                            label: "Blood Type",
                            value: medicalCardData?.blood || ""
                        }, {
                            label: "Date of Birth",
                            value: medicalCardData?.dateOfBirth || ""
                        }, {
                            label: "Phone Number",
                            value: medicalCardData?.phone || ""
                        },
                    ],
                    address: {
                        line1: `${medicalCardData?.street || ""} ${medicalCardData?.city || ""}`,
                        state: medicalCardData?.state || "",
                        postal_code: medicalCardData?.postalCode || ""
                    },
                    usual: [
                        {
                            name: "Previous Surgeries",
                            value: medicalCardData?.previousSurgeries || ""
                        },
                        {
                            name: "Smoker",
                            value: medicalCardData?.smoker || ""
                        },
                        {
                            name: "Alcohol Consumption",
                            value: medicalCardData?.alcohol || ""
                        },
                        {
                            name: "Exercise Routine",
                            value: medicalCardData?.exercise === "Other" ? medicalCardData?.exercise_Other : medicalCardData?.exercise || ""
                        },
                        {
                            name: "Dietry Preferences",
                            value: medicalCardData?.diet === "Other" ? medicalCardData?.diet_Other : medicalCardData?.diet || ""
                        },
                        {
                            name: "Current Medication",
                            value: medicalCardData?.currentMedication || ""
                        }
                    ],
                    contacts: [
                        {
                            name: medicalCardData?.emergencyName,
                            relation: medicalCardData?.emergencyRelation,
                            phone: medicalCardData?.emergencyPhone,
                            action: "Call"
                        },
                    ],
                    multiselect: [
                        {
                            name: "Known Allergies",
                            data: medicalCardData?.allergyHistory?.split(",").map(item => item.trim()) || []
                        },
                        {
                            name: "Mental Health",
                            data: medicalCardData?.mentalCondition?.split(",").map(item => item.trim()) || []
                        },
                        {
                            name: "Routine Vaccinations",
                            data: medicalCardData?.vaccinationHistory?.split(",").map(item => item.trim()) || []
                        },
                        {
                            name: "Chronic Conditions",
                            data: medicalCardData?.chronicHistory?.split(",").map(item => item.trim()) || []
                        }
                    ],
                    actions: [
                        {
                            name: "Insurance Info",
                            data: [
                                {
                                    label: "Insurance Provider",
                                    value: medicalCardData?.insuranceProvider || ""
                                }, {
                                    label: "Policy Number",
                                    value: medicalCardData?.insurancePolicyNumber || ""
                                }, {
                                    label: "Group Number",
                                    value: medicalCardData?.insuranceGrpNumber || ""
                                }
                            ]
                        }
                    ],
                };
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        {medicalData.profile.map((dat, index) => (
                            <div key={index} className='flex flex-wrap items-center gap-2'>
                                <p className='text-md text-white font-semibold whitespace-nowrap'>{dat.label} :</p>
                                <p className='text-md text-white whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                            </div>
                        ))}
                        <div className="mt-2">
                            <h2 className="text-white text-2xl font-semibold">Address</h2>
                            <div>
                                <p className="text-white">{medicalData.address.line1}</p>
                                <p className="text-white">State - {medicalData.address.state}</p>
                                <p className="text-white">Postal -{medicalData.address.postal_code}</p>
                            </div>
                        </div>
                        {medicalData.usual.map((data, index) => (
                            <div key={index} className="mt-4">
                                <h2 className="text-white text-2xl font-semibold">{data.name}</h2>
                                <p className="text-white">{data.value}</p>
                                <hr className="border border-white mt-1" />
                            </div>
                        ))}
                        <div className="mt-4">
                            <h2 className="text-white text-2xl font-semibold">SOS</h2>
                            <div className="flex gap-4 overflow-auto select-none hide-scrollbar">
                                {medicalData.contacts.map((data, index) => (
                                    <div key={index} className="flex flex-col justify-center items-center w-[200px] gap-1 py-2 px-5 bg-red-100 border rounded-2xl">
                                        <p className="text-black text-lg font-semibold whitespace-nowrap">{data.name}</p>
                                        <p className="text-black">{data.relation}</p>
                                        <a href={`tel:${data.phone}`} className="bg-blue-100 text-center text-black text-lg font-semibold w-full py-1 rounded-md">{data.action}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            {medicalData.multiselect.map((dat, index) => (
                                <div key={index} className="py-2">
                                    <h1 className="text-white text-2xl font-semibold">{dat.name}</h1>
                                    <div className="flex flex-wrap justify-start items-center gap-2">
                                        {dat.data.map((dax, i) => (
                                            <div key={i} className="px-3 py-2 rounded-md bg-blue-100">
                                                <p className="text-blue-600 font-normal">{dax}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            {medicalData.actions.map((action, index) => (
                                <div key={index}>
                                    <h2 className="text-white text-xl font-semibold">{action.name}</h2>
                                    {action.data.map((action, index) => (
                                        <div key={index} className="flex flex-wrap items-center gap-2">
                                            <p className='text-lg text-white font-semibold whitespace-nowrap'>{action.label} :</p>
                                            <p className='text-lg text-white whitespace-nowrap'>{action.value ? action.value : "----------"}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <Link to={`/users/details?id=${card?.userId?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.userId?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "CREATOR":
                let creatorCardData = card && (card.data as CreatorData)
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> {creatorCardData?.name}</p>
                        {creatorCardData && creatorCardData.links?.length > 0 ? creatorCardData.links.map((link, index: number) => (
                            <Link
                                to={link.link}
                                target="blank"
                                className="w-full relative flex flex-col justify-center items-center py-3"
                                key={index}
                            >
                                <p key={index} className="text-white"><span className="font-semibold">{link.label}:</span> {link.link}</p>
                            </Link>
                        )) : (
                            <p className='text-center text-white text-lg'>No links available</p>
                        )}
                        <Link to={`/users/details?id=${card?.userId?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.userId?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            default:
                return (
                    <p className="text-3xl text-red-500 font-semibold">Card Type Not Valid</p>
                )
        }
    }

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-white capitalize font-semibold underline">{type} Card</h1>
                    {renderCard()}
                </div>

                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this card?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDelete}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-white rounded-lg" onClick={() => setOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="h-full w-full">
                        {/* <div className="bg-white rounded-xl">
                            {qrCodeDataUrl ? (
                                <img src={qrCodeDataUrl} alt={card?._id} className="rounded-lg object-cover" />
                            ) : (
                                <Loader2 />
                            )}
                        </div> */}
                        <div className="flex items-center justify-center mt-3 text-2xl text-black font-semibold">
                            {card?.data.name}
                        </div>
                    </div>
                    {/* <button onClick={handleDownload} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Download Card
                    </button> */}
                    <button onClick={handleShare} className="flex w-full justify-center rounded bg-green-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Share Card
                    </button>
                    <button onClick={() => setOpen(true)} className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Delete Card
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default CardDetails;
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CardResponse } from "../../types/api-types";
import axios from "axios";
import { AnimalData, CreatorData, MedicalData, IndividualData, BotanyData, ICard } from "../../types/type";
import DefaultLayout from "../../layout/DefaultLayout";
import QRCodeStyling from "qr-code-styling";
import { Loader2 } from "lucide-react";
import Loader from "../../components/Loader";

const qrStyles: Record<string, { qrColor: string; dotColor: string }> = {
    botanical: { qrColor: "#4ade80", dotColor: "#22c55e" },
    individual: { qrColor: "#60a5fa", dotColor: "#3b82f6" },
    medical: { qrColor: "#818cf8", dotColor: "#6366f1" },
    creator: { qrColor: "#22d3ee", dotColor: "#06b6d4" },
    animal: { qrColor: "#f87171", dotColor: "#ef4444" },
    default: { qrColor: "#9ca3af", dotColor: "#6b7280" },
};

export const createQRCode = (type: string, cardId: string) => {
    const styles = type && qrStyles[type] ? qrStyles[type] : qrStyles.default;

    return new QRCodeStyling({
        width: 300,
        height: 300,
        margin: 5,
        data: `${import.meta.env.VITE_CLIENT_URL}/d/${cardId}`,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "H",
        },
        image: `/assets/${type}.svg`,
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
        },
        dotsOptions: {
            type: "extra-rounded",
            color: styles.qrColor,
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: styles.dotColor,
        },
        cornersDotOptions: {
            color: styles.qrColor,
        },
    });
};

const CardDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const type = search.get("type");
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const [card, setCard] = useState<BotanyData | IndividualData | MedicalData | CreatorData | AnimalData | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCard = async () => {
        setLoading(true);

        const cachedCardsAll = window.sessionStorage.getItem('cards_all');
        if (cachedCardsAll) {
            const { data: cachedCards, expires, type: cachedType } = JSON.parse(cachedCardsAll);

            if (Date.now() < expires && type === cachedType) {
                const cachedCard = cachedCards.find((card: ICard) => card._id === id);
                // const cachedCard = cachedCards.find((card: BotanyData | IndividualData | MedicalData | CreatorData | AnimalData) => card._id === id);
                if (cachedCard) {
                    setCard(cachedCard);
                    setLoading(false);
                    const payload = {
                        type,
                        id,
                        data: cachedCard,
                        expires: Date.now() + 60 * 1000
                    }
                    window.sessionStorage.setItem('cards_byId', JSON.stringify(payload));
                    return;
                }
            }
        }

        const cachedCardById = window.sessionStorage.getItem('cards_byId');
        if (cachedCardById) {
            const { data: cachedCard, expires, type: cachedType, id: cachedId } = JSON.parse(cachedCardById);

            if (Date.now() < expires && cachedId === id && cachedType === type) {
                setCard(cachedCard);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('cards_byId');

        try {
            const { data }: { data: CardResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/cards/byId/${id!}?type=${type}`, { withCredentials: true });
            setCard(data.card);
            const payload = {
                type,
                id,
                data: data.card,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('cards_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCard();
    }, [id, type]);

    useEffect(() => {
        if (type && card) {
            const qrCode = createQRCode(type!, card.shortCode); 

            qrCode.getRawData("png").then((data) => {
                if (data) {
                    const dataUrl = URL.createObjectURL(new Blob([data], { type: "image/png" }));
                    setQrCodeDataUrl(dataUrl);
                }
            });
        }
    }, [type, card]);

    const handleDownload = () => {
        if (card && type) {
            const qrCode = createQRCode(type, card.shortCode);

            qrCode.download({
                name: card._id,
                extension: "svg"
            });
        }
    }

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
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/cards/byId/${id!}?type=${type}`, { withCredentials: true });
            toast.success("Card deleted successfully");
            window.sessionStorage.removeItem('cards_byId');
            window.sessionStorage.removeItem('cards_all');
            navigate(-1)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpen(false);
    }

    const renderCard = () => {
        switch (type) {
            case "botanical":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> - {(card as BotanyData)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Type:</span> - {(card as BotanyData)?.treeType}</p>
                        <p className="text-white"><span className="font-semibold">Scientific Name</span> - {(card as BotanyData)?.scientificName}</p>
                        {/* <p className="text-white"><span className="font-semibold">Location</span> - {(card as BotanyData)?.location}</p> */}
                        <p className="text-white"><span className="font-semibold">Description</span> - {(card as BotanyData)?.description}</p>
                        <p className="text-white"><span className="font-semibold">Features</span> - {(card as BotanyData)?.specialFeatures}</p>
                        <p className="text-white"><span className="font-semibold">Maintenance</span> - {(card as BotanyData)?.nutritionalNeeds}</p>
                        {/* <p className="text-white"><span className="font-semibold">Benefits</span> - {(card as BotanyData)?.benefits}</p>
                        <p className="text-white"><span className="font-semibold">FunFact</span> - {(card as BotanyData)?.funFact}</p> */}
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "individual":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> - {(card as IndividualData)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Mobile Number:</span> - {(card as IndividualData)?.mobileNumer}</p>
                        <p className="text-white"><span className="font-semibold">Home Number:</span> - {(card as IndividualData)?.homeNumber}</p>
                        <p className="text-white"><span className="font-semibold">Work Number:</span> - {(card as IndividualData)?.workNumber}</p>
                        <p className="text-white"><span className="font-semibold">Other Number:</span> - {(card as IndividualData)?.otherNumber}</p>
                        <p className="text-white"><span className="font-semibold">Personal Email:</span> - {(card as IndividualData)?.personalEmail}</p>
                        <p className="text-white"><span className="font-semibold">Work Email:</span> - {(card as IndividualData)?.workEmail}</p>
                        <p className="text-white"><span className="font-semibold">Other Email:</span> - {(card as IndividualData)?.otherEmail}</p>
                        <p className="text-white"><span className="font-semibold">About Me:</span> - {(card as IndividualData)?.aboutMe}</p>
                        <p className="text-white"><span className="font-semibold">Date of Birth:</span> - {(card as IndividualData)?.dateOfBirth}</p>
                        <p className="text-white"><span className="font-semibold">Home Town:</span> - {(card as IndividualData)?.homeTown}</p>
                        <p className="text-white"><span className="font-semibold">Current City:</span> - {(card as IndividualData)?.currentCity}</p>
                        <p className="text-white"><span className="font-semibold">Languages:</span> - {(card as IndividualData)?.languages}</p>
                        <p className="text-white"><span className="font-semibold">Music:</span> - {(card as IndividualData)?.music}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Color:</span> - {(card as IndividualData)?.color}</p>
                        <p className="text-white"><span className="font-semibold">Favorite City:</span> - {(card as IndividualData)?.city}</p>
                        <p className="text-white"><span className="font-semibold">Travel Destination:</span> - {(card as IndividualData)?.travelDestination}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Season:</span> - {(card as IndividualData)?.season}</p>
                        <p className="text-white"><span className="font-semibold">Unique Skills:</span> - {(card as IndividualData)?.uniqueSkills}</p>
                        <p className="text-white"><span className="font-semibold">Cuisine:</span> - {(card as IndividualData)?.cuisine}</p>
                        <p className="text-white"><span className="font-semibold">Beverage:</span> - {(card as IndividualData)?.beverage}</p>
                        <p className="text-white"><span className="font-semibold">Inspirational Quotes:</span> - {(card as IndividualData)?.inspirationalQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Funny Quotes:</span> - {(card as IndividualData)?.funnyQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Motivational Quotes:</span> - {(card as IndividualData)?.motivationalQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Other Quotes:</span> - {(card as IndividualData)?.otherQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Travel Mode:</span> - {(card as IndividualData)?.travelMode === "other" ? (card as IndividualData)?.travelMode_Other : (card as IndividualData)?.travelMode}</p>
                        <p className="text-white"><span className="font-semibold">Pet Lover:</span> - {(card as IndividualData)?.petLover}</p>
                        <p className="text-white"><span className="font-semibold">Party Enthusiast:</span> - {(card as IndividualData)?.partyEnthusiast}</p>
                        <p className="text-white"><span className="font-semibold">Smoker:</span> - {(card as IndividualData)?.smoker}</p>
                        <p className="text-white"><span className="font-semibold">Marital Status:</span> - {(card as IndividualData)?.maritalStatus}</p>
                        <p className="text-white"><span className="font-semibold">Relationship Status:</span> - {(card as IndividualData)?.relationshipStatus}</p>
                        <p className="text-white"><span className="font-semibold">Fitness Routine:</span> - {(card as IndividualData)?.fitnessRoutine}</p>
                        <p className="text-white"><span className="font-semibold">Morning Person:</span> - {(card as IndividualData)?.morningPerson}</p>
                        <p className="text-white"><span className="font-semibold">Diet:</span> - {(card as IndividualData)?.diet === "other" ? (card as IndividualData)?.diet_Other : (card as IndividualData)?.diet}</p>
                        <p className="text-white"><span className="font-semibold">Sleeping Habit:</span> - {(card as IndividualData)?.sleepingHabit}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Genre:</span> - {(card as IndividualData)?.genre === "other" ? (card as IndividualData)?.genre_Other : (card as IndividualData)?.genre}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Sports:</span> - {(card as IndividualData)?.sports === "other" ? (card as IndividualData)?.sports_Other : (card as IndividualData)?.sports === "other"}</p>
                        <p className="text-white"><span className="font-semibold">Artistic Pursuits:</span> - {(card as IndividualData)?.artistisPursuits === "other" ? (card as IndividualData)?.artistisPursuits_Other : (card as IndividualData)?.artistisPursuits}</p>
                        <p className="text-white"><span className="font-semibold">Gaming:</span> - {(card as IndividualData)?.gaming === "other" ? (card as IndividualData)?.gaming_Other : (card as IndividualData)?.gaming}</p>
                        <p className="text-white"><span className="font-semibold">Collecting Hobby:</span> - {(card as IndividualData)?.collectignHobby === "other" ? (card as IndividualData)?.collectignHobby_Other : (card as IndividualData)?.collectignHobby}</p>
                        <p className="text-white"><span className="font-semibold">Coffee:</span> - {(card as IndividualData)?.coffee === "other" ? (card as IndividualData)?.coffee_Other : (card as IndividualData)?.coffee}</p>
                        <p className="text-white"><span className="font-semibold">Cooking Skills:</span> - {(card as IndividualData)?.cookingSkills === "other" ? (card as IndividualData)?.cookingSkills_Other : (card as IndividualData)?.cookingSkills}</p>
                        <p className="text-white"><span className="font-semibold">Current Occupation:</span> - {(card as IndividualData)?.currentOcupation}</p>
                        <p className="text-white"><span className="font-semibold">Career Aspiration:</span> - {(card as IndividualData)?.careerAspiation}</p>
                        <p className="text-white"><span className="font-semibold">Education:</span> - {(card as IndividualData)?.education}</p>
                        <p className="text-white"><span className="font-semibold">Skills:</span> - {(card as IndividualData)?.skills}</p>
                        <p className="text-white"><span className="font-semibold">Other Interests:</span> - {(card as IndividualData)?.otherInterests}</p>
                        <p className="text-white"><span className="font-semibold">Future Goals:</span> - {(card as IndividualData)?.futureGoals}</p>
                        <p className="text-white"><span className="font-semibold">Current Status:</span> - {(card as IndividualData)?.current}</p>
                        <p className="text-white"><span className="font-semibold">Unusual Experience:</span> - {(card as IndividualData)?.unusualExperinece}</p>
                        <p className="text-white"><span className="font-semibold">Strange Habits:</span> - {(card as IndividualData)?.strangeHabits}</p>
                        {(card as IndividualData)?.socialMedia.map((item: { label: string; name: string }, index: number) => (
                            <p key={index} className="text-white"><span className="font-semibold">{item.label}:</span> {item.name}</p>
                        ))}
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "animal":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> {(card as Animal)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Species:</span> {(card as Animal)?.species}</p>
                        <p className="text-white"><span className="font-semibold">Age:</span> {(card as Animal)?.age}</p>
                        <p className="text-white"><span className="font-semibold">Gender:</span> {(card as Animal)?.gender}</p>
                        <p className="text-white"><span className="font-semibold">Color:</span> {(card as Animal)?.color}</p>
                        <p className="text-white"><span className="font-semibold">Location:</span> {(card as Animal)?.location}</p>
                        <p className="text-white"><span className="font-semibold">Owner:</span> {(card as Animal)?.owner}</p>
                        <p className="text-white"><span className="font-semibold">Phone:</span> {(card as Animal)?.phone}</p>
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "medical":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> {(card as MedicalData)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Date of Birth:</span> {(card as MedicalData)?.dateOfBirth}</p>
                        <p className="text-white"><span className="font-semibold">Gender:</span> {(card as MedicalData)?.gender}</p>
                        <p className="text-white"><span className="font-semibold">Street:</span> {(card as MedicalData)?.street}</p>
                        <p className="text-white"><span className="font-semibold">City:</span> {(card as MedicalData)?.city}</p>
                        <p className="text-white"><span className="font-semibold">State:</span> {(card as MedicalData)?.state}</p>
                        <p className="text-white"><span className="font-semibold">Postal Code:</span> {(card as MedicalData)?.postalCode}</p>
                        <p className="text-white"><span className="font-semibold">Phone:</span> {(card as MedicalData)?.phone}</p>
                        <p className="text-white"><span className="font-semibold">Email:</span> {(card as MedicalData)?.email}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Contact Name:</span> {(card as MedicalData)?.emergencyName}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Relation:</span> {(card as MedicalData)?.emergencyRelation}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Phone:</span> {(card as MedicalData)?.emergencyPhone}</p>
                        <p className="text-white"><span className="font-semibold">Allergy History:</span> {(card as MedicalData)?.allergyHistory}</p>
                        <p className="text-white"><span className="font-semibold">Chronic Conditions History:</span> {(card as MedicalData)?.chronicHistory}</p>
                        <p className="text-white"><span className="font-semibold">Current Medication:</span> {(card as MedicalData)?.currentMedication}</p>
                        <p className="text-white"><span className="font-semibold">Previous Surgeries:</span> {(card as MedicalData)?.previousSurgeries}</p>
                        <p className="text-white"><span className="font-semibold">Smoker:</span> {(card as MedicalData)?.smoker}</p>
                        <p className="text-white"><span className="font-semibold">Alcohol Consumption:</span> {(card as MedicalData)?.alcohol}</p>
                        <p className="text-white"><span className="font-semibold">Exercise Routine:</span> {(card as MedicalData)?.exercise}</p>
                        <p className="text-white"><span className="font-semibold">Diet:</span> {(card as MedicalData)?.diet}</p>
                        <p className="text-white"><span className="font-semibold">Mental Condition:</span> {(card as MedicalData)?.mentalCondition}</p>
                        <p className="text-white"><span className="font-semibold">Vaccination History:</span> {(card as MedicalData)?.vaccinationHistory}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Provider:</span> {(card as MedicalData)?.insuranceProvider}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Policy Number:</span> {(card as MedicalData)?.insurancePolicyNumber}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Group Number:</span> {(card as MedicalData)?.insuranceGrpNumber}</p>
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "creator":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> {(card as Creator)?.name}</p>
                        {(card as Creator)?.links.map((item: { label: string; name: string }, index: number) => (
                            <p key={index} className="text-white"><span className="font-semibold">{item.label}:</span> {item.name}</p>
                        ))}
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
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
                        <div className="bg-white rounded-xl">
                            {qrCodeDataUrl ? (
                                <img src={qrCodeDataUrl} alt={card?._id} className="rounded-lg object-cover" />
                            ) : (
                                <Loader2 />
                            )}
                        </div>
                        <div className="flex items-center justify-center mt-3 text-2xl text-black font-semibold">
                            {card?.name}
                        </div>
                    </div>
                    <button onClick={handleDownload} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Download Card
                    </button>
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
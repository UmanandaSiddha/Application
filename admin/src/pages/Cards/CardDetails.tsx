import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CardResponse } from "../../types/api-types";
import axios from "axios";
import { Animal, Creator, Medical, Personal, Tree } from "../../types/types";
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
    const [card, setCard] = useState<Tree | Personal | Medical | Creator | Animal | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCard = async () => {
        setLoading(true);

        const cachedCardsAll = window.sessionStorage.getItem('cards_all');
        if (cachedCardsAll) {
            const { data: cachedCards, expires, type: cachedType } = JSON.parse(cachedCardsAll);

            if (Date.now() < expires && type === cachedType) {
                const cachedCard = cachedCards.find((card: Tree | Personal | Medical | Creator | Animal) => card._id === id);
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
            const qrCode = createQRCode(type, card.shortCode);

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
                        <p className="text-white"><span className="font-semibold">Name:</span> - {(card as Tree)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Type:</span> - {(card as Tree)?.treeType}</p>
                        <p className="text-white"><span className="font-semibold">Scientific Name</span> - {(card as Tree)?.scientificName}</p>
                        <p className="text-white"><span className="font-semibold">Location</span> - {(card as Tree)?.location}</p>
                        <p className="text-white"><span className="font-semibold">Description</span> - {(card as Tree)?.description}</p>
                        <p className="text-white"><span className="font-semibold">Features</span> - {(card as Tree)?.features}</p>
                        <p className="text-white"><span className="font-semibold">Maintenance</span> - {(card as Tree)?.maintenance}</p>
                        <p className="text-white"><span className="font-semibold">Benefits</span> - {(card as Tree)?.benefits}</p>
                        <p className="text-white"><span className="font-semibold">FunFact</span> - {(card as Tree)?.funFact}</p>
                        <Link to={`/users/details?id=${card?.user?._id}`} className="text-white"><span className="font-semibold">User</span> - {card?.user?._id}</Link>
                        <p className="text-white"><span className="font-semibold">Card Created</span> - {String(new Date(card?.createdAt!).toDateString())}</p>
                        <p className="text-white"><span className="font-semibold">Card Updated</span> - {String(new Date(card?.updatedAt!).toDateString())}</p>
                    </>
                )
            case "individual":
                return (
                    <>
                        <p className="text-white"><span className="font-semibold">Id:</span> {card?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name:</span> - {(card as Personal)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Mobile Number:</span> - {(card as Personal)?.mobileNumer}</p>
                        <p className="text-white"><span className="font-semibold">Home Number:</span> - {(card as Personal)?.homeNumber}</p>
                        <p className="text-white"><span className="font-semibold">Work Number:</span> - {(card as Personal)?.workNumber}</p>
                        <p className="text-white"><span className="font-semibold">Other Number:</span> - {(card as Personal)?.otherNumber}</p>
                        <p className="text-white"><span className="font-semibold">Personal Email:</span> - {(card as Personal)?.personalEmail}</p>
                        <p className="text-white"><span className="font-semibold">Work Email:</span> - {(card as Personal)?.workEmail}</p>
                        <p className="text-white"><span className="font-semibold">Other Email:</span> - {(card as Personal)?.otherEmail}</p>
                        <p className="text-white"><span className="font-semibold">About Me:</span> - {(card as Personal)?.aboutMe}</p>
                        <p className="text-white"><span className="font-semibold">Date of Birth:</span> - {(card as Personal)?.dateOfBirth}</p>
                        <p className="text-white"><span className="font-semibold">Home Town:</span> - {(card as Personal)?.homeTown}</p>
                        <p className="text-white"><span className="font-semibold">Current City:</span> - {(card as Personal)?.currentCity}</p>
                        <p className="text-white"><span className="font-semibold">Languages:</span> - {(card as Personal)?.languages}</p>
                        <p className="text-white"><span className="font-semibold">Music:</span> - {(card as Personal)?.music}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Color:</span> - {(card as Personal)?.color}</p>
                        <p className="text-white"><span className="font-semibold">Favorite City:</span> - {(card as Personal)?.city}</p>
                        <p className="text-white"><span className="font-semibold">Travel Destination:</span> - {(card as Personal)?.travelDestination}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Season:</span> - {(card as Personal)?.season}</p>
                        <p className="text-white"><span className="font-semibold">Unique Skills:</span> - {(card as Personal)?.uniqueSkills}</p>
                        <p className="text-white"><span className="font-semibold">Cuisine:</span> - {(card as Personal)?.cuisine}</p>
                        <p className="text-white"><span className="font-semibold">Beverage:</span> - {(card as Personal)?.beverage}</p>
                        <p className="text-white"><span className="font-semibold">Inspirational Quotes:</span> - {(card as Personal)?.inspirationalQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Funny Quotes:</span> - {(card as Personal)?.funnyQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Motivational Quotes:</span> - {(card as Personal)?.motivationalQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Other Quotes:</span> - {(card as Personal)?.otherQuotes}</p>
                        <p className="text-white"><span className="font-semibold">Travel Mode:</span> - {(card as Personal)?.travelMode === "other" ? (card as Personal)?.travelMode_Other : (card as Personal)?.travelMode}</p>
                        <p className="text-white"><span className="font-semibold">Pet Lover:</span> - {(card as Personal)?.petLover}</p>
                        <p className="text-white"><span className="font-semibold">Party Enthusiast:</span> - {(card as Personal)?.partyEnthusiast}</p>
                        <p className="text-white"><span className="font-semibold">Smoker:</span> - {(card as Personal)?.smoker}</p>
                        <p className="text-white"><span className="font-semibold">Marital Status:</span> - {(card as Personal)?.maritalStatus}</p>
                        <p className="text-white"><span className="font-semibold">Relationship Status:</span> - {(card as Personal)?.relationshipStatus}</p>
                        <p className="text-white"><span className="font-semibold">Fitness Routine:</span> - {(card as Personal)?.fitnessRoutine}</p>
                        <p className="text-white"><span className="font-semibold">Morning Person:</span> - {(card as Personal)?.morningPerson}</p>
                        <p className="text-white"><span className="font-semibold">Diet:</span> - {(card as Personal)?.diet === "other" ? (card as Personal)?.diet_Other : (card as Personal)?.diet}</p>
                        <p className="text-white"><span className="font-semibold">Sleeping Habit:</span> - {(card as Personal)?.sleepingHabit}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Genre:</span> - {(card as Personal)?.genre === "other" ? (card as Personal)?.genre_Other : (card as Personal)?.genre}</p>
                        <p className="text-white"><span className="font-semibold">Favorite Sports:</span> - {(card as Personal)?.sports === "other" ? (card as Personal)?.sports_Other : (card as Personal)?.sports === "other"}</p>
                        <p className="text-white"><span className="font-semibold">Artistic Pursuits:</span> - {(card as Personal)?.artistisPursuits === "other" ? (card as Personal)?.artistisPursuits_Other : (card as Personal)?.artistisPursuits}</p>
                        <p className="text-white"><span className="font-semibold">Gaming:</span> - {(card as Personal)?.gaming === "other" ? (card as Personal)?.gaming_Other : (card as Personal)?.gaming}</p>
                        <p className="text-white"><span className="font-semibold">Collecting Hobby:</span> - {(card as Personal)?.collectignHobby === "other" ? (card as Personal)?.collectignHobby_Other : (card as Personal)?.collectignHobby}</p>
                        <p className="text-white"><span className="font-semibold">Coffee:</span> - {(card as Personal)?.coffee === "other" ? (card as Personal)?.coffee_Other : (card as Personal)?.coffee}</p>
                        <p className="text-white"><span className="font-semibold">Cooking Skills:</span> - {(card as Personal)?.cookingSkills === "other" ? (card as Personal)?.cookingSkills_Other : (card as Personal)?.cookingSkills}</p>
                        <p className="text-white"><span className="font-semibold">Current Occupation:</span> - {(card as Personal)?.currentOcupation}</p>
                        <p className="text-white"><span className="font-semibold">Career Aspiration:</span> - {(card as Personal)?.careerAspiation}</p>
                        <p className="text-white"><span className="font-semibold">Education:</span> - {(card as Personal)?.education}</p>
                        <p className="text-white"><span className="font-semibold">Skills:</span> - {(card as Personal)?.skills}</p>
                        <p className="text-white"><span className="font-semibold">Other Interests:</span> - {(card as Personal)?.otherInterests}</p>
                        <p className="text-white"><span className="font-semibold">Future Goals:</span> - {(card as Personal)?.futureGoals}</p>
                        <p className="text-white"><span className="font-semibold">Current Status:</span> - {(card as Personal)?.current}</p>
                        <p className="text-white"><span className="font-semibold">Unusual Experience:</span> - {(card as Personal)?.unusualExperinece}</p>
                        <p className="text-white"><span className="font-semibold">Strange Habits:</span> - {(card as Personal)?.strangeHabits}</p>
                        {(card as Personal)?.socialMedia.map((item, index) => (
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
                        <p className="text-white"><span className="font-semibold">Name:</span> {(card as Medical)?.name}</p>
                        <p className="text-white"><span className="font-semibold">Date of Birth:</span> {(card as Medical)?.dateOfBirth}</p>
                        <p className="text-white"><span className="font-semibold">Gender:</span> {(card as Medical)?.gender}</p>
                        <p className="text-white"><span className="font-semibold">Street:</span> {(card as Medical)?.street}</p>
                        <p className="text-white"><span className="font-semibold">City:</span> {(card as Medical)?.city}</p>
                        <p className="text-white"><span className="font-semibold">State:</span> {(card as Medical)?.state}</p>
                        <p className="text-white"><span className="font-semibold">Postal Code:</span> {(card as Medical)?.postalCode}</p>
                        <p className="text-white"><span className="font-semibold">Phone:</span> {(card as Medical)?.phone}</p>
                        <p className="text-white"><span className="font-semibold">Email:</span> {(card as Medical)?.email}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Contact Name:</span> {(card as Medical)?.emergencyName}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Relation:</span> {(card as Medical)?.emergencyRelation}</p>
                        <p className="text-white"><span className="font-semibold">Emergency Phone:</span> {(card as Medical)?.emergencyPhone}</p>
                        <p className="text-white"><span className="font-semibold">Allergy History:</span> {(card as Medical)?.allergyHistory}</p>
                        <p className="text-white"><span className="font-semibold">Chronic Conditions History:</span> {(card as Medical)?.chronicHistory}</p>
                        <p className="text-white"><span className="font-semibold">Current Medication:</span> {(card as Medical)?.currentMedication}</p>
                        <p className="text-white"><span className="font-semibold">Previous Surgeries:</span> {(card as Medical)?.previousSurgeries}</p>
                        <p className="text-white"><span className="font-semibold">Smoker:</span> {(card as Medical)?.smoker}</p>
                        <p className="text-white"><span className="font-semibold">Alcohol Consumption:</span> {(card as Medical)?.alcohol}</p>
                        <p className="text-white"><span className="font-semibold">Exercise Routine:</span> {(card as Medical)?.exercise}</p>
                        <p className="text-white"><span className="font-semibold">Diet:</span> {(card as Medical)?.diet}</p>
                        <p className="text-white"><span className="font-semibold">Mental Condition:</span> {(card as Medical)?.mentalCondition}</p>
                        <p className="text-white"><span className="font-semibold">Vaccination History:</span> {(card as Medical)?.vaccinationHistory}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Provider:</span> {(card as Medical)?.insuranceProvider}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Policy Number:</span> {(card as Medical)?.insurancePolicyNumber}</p>
                        <p className="text-white"><span className="font-semibold">Insurance Group Number:</span> {(card as Medical)?.insuranceGrpNumber}</p>
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
                        {(card as Creator)?.links.map((item, index) => (
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
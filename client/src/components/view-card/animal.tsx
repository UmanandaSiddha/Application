import { Animal } from "@/types/types";

interface PropsType {
    card: Animal | null;
}

const Animal = ({ card }: PropsType) => {
    return (
        <div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Animal Id:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?._id}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Species:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.species}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Name:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.name}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Age:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.age}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Gender:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.gender}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Color/Markings:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.color}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Location:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.location}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Owner:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.owner}</p></div>
            </div>
            <div className="flex">
                <div className="basis-1/2"><p className="font-Kanit font-semibold">Phone Number:</p></div>
                <div className="basis-1/2"><p className="font-Kanit">{card?.phone}</p></div>
            </div>
        </div>
    )
}

export default Animal
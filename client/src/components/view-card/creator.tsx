import { Creator } from "@/types/types";

interface PropsType {
    card: Creator | null;
}

const Creator = ({ card }: PropsType) => {
    return (
        <div className="space-y-4">
            <div className="flex">
                <div className="basis-1/2 ">
                    <p className="font-semibold font-Kanit">CreatorId:</p>
                </div>
                <div className="basis-1/2">
                    <span className="font-Kanit">{card?._id}</span>
                </div>
            </div>
            <div className="flex">
                <div className="basis-1/2 ">
                    <p className="font-semibold font-Kanit">Name:</p>
                </div>
                <div className="basis-1/2">
                    <span className="font-Kanit">{card?.name}</span>
                </div>
            </div>
            <div>
                <div className="flex justify-center items-center py-2">
                    <h1 className="text-2xl font-semibold font-Kanit underline">
                        Social Links
                    </h1>
                </div>
                {card?.links?.map((link: any, index: number) => (
                    <div className="flex">
                        <div className="basis-1/2">
                            <p key={index}>
                                <span className="font-semibold font-Kanit">
                                    {link.label}:
                                </span>
                            </p>
                        </div>
                        <div className="basis-1/2">
                            <p className="font-Kanit">
                                <a href={link.name} target="blank">{link.name}</a>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Creator
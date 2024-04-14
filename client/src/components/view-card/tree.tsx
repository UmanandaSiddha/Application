import { Tree } from "@/types/types";

interface PropsType {
    card: Tree | null;
}

const TreeComponent = ({ card }: PropsType) => {
    return (
        <div>
            <p><span className="font-semibold">TreeId:</span> {card?._id}</p>
            <p><span className="font-semibold">Name:</span> {card?.name}</p>
            <p><span className="font-semibold">Scientific Name:</span> {card?.scientificName}</p>
            <p><span className="font-semibold">Tree Type:</span> {card?.treeType}</p>
            <p><span className="font-semibold">Location:</span> {card?.location}</p>
            <p><span className="font-semibold">Description:</span> {card?.description}</p>
            <p><span className="font-semibold">Special Features:</span> {card?.features}</p>
            <p><span className="font-semibold">Maintenance:</span> {card?.maintenance}</p>
            <p><span className="font-semibold">Benefits:</span> {card?.benefits}</p>
            <p><span className="font-semibold">Fun Facts:</span> {card?.funFact}</p>
        </div>
    )
}

export default TreeComponent;
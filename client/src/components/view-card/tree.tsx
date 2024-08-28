import { Tree } from "@/types/card_types";

interface PropsType {
    card: Tree | null;
}

const TreeComponent = ({ card }: PropsType) => {

    const data = [
        { 
            title: "Tree Name",
            value: card?.name
        },
        {
            title: "Scientific Name",
            value: card?.scientificName
        },
        {
            title: "Tree type",
            value: card?.treeType
        },
        {
            title: "Tree Location",
            value: card?.location
        },
        {
            title: "Tree Description",
            value: card?.description
        },
        {
            title: "Tree Features",
            value: card?.features
        },
        {
            title: "Tree Maintenance",
            value: card?.maintenance
        },
        {
            title: "Tree Benefits",
            value: card?.benefits
        },
        {
            title: "Tree Fun Fact",
            value: card?.funFact
        },
    ]

    return (
        <div className="bg-green-100">
            <div className="bg-green-500 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p>BOTANICAL DATA</p>
                </div>
                <div className="font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>

            <div className="py-6 flex justify-center w-full">
                <div className="w-[90%]">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col gap-y-2 py-2 font-Kanit">
                            <p className="text-lg font-normal">{item.title}:</p>
                            <p className="bg-white border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TreeComponent;
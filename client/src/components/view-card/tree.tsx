import { Tree } from "@/types/card_types";

interface PropsType {
    card: Tree | null;
}

const TreeComponent = ({ card }: PropsType) => {

    const data = [
        {
            title: "Plant Name",
            value: card?.name
        },
        {
            title: "Scientific Name",
            value: card?.scientificName
        },
        {
            title: "Family",
            value: card?.family
        },
        {
            title: "Origin",
            value: card?.origin
        },
        {
            title: "Habitat",
            value: card?.habitat
        },
        {
            title: "Description",
            value: card?.description
        },
        {
            title: "Height",
            value: card?.height
        },
        {
            title: "Leaf Type",
            value: card?.leafType
        },
        {
            title: "Flower Color",
            value: card?.flowerColor
        },
        {
            title: "Uses",
            value: card?.uses
        },
        {
            title: "Care Instructions",
            value: card?.careInstructions
        },
        {
            title: "Special Features",
            value: card?.specialFeatures
        },
        {
            title: "Caretaker Mobile Number",
            value: card?.caretakerMobileNumber
        },
        {
            title: "Additional Notes",
            value: card?.additionalNotes
        }
    ];
    

    return (
        <div className="bg-[#F5EDA8] relative bg-opacity-45 pb-32 md:pb-6 overflow-x-hidden">
            <img src="/botany_bg.png" alt="" className="absolute md:left-16 max-sm:top-20 rotate-6 z-10" />
            <div className="relative rounded-[10px]">
                {/* <img src="/botany_header.png" alt="" className="w-full h-80" /> */}
                <img src="/botany_header.png" alt="" className="w-full h-80 hidden sm:block" />
                <img src="/tree_header_mobile.png" alt="" className="w-full sm:hidden" />
                <div className=" pt-10 pl-5 absolute top-5">
                    <div className="flex justify-start pl-6 sm:py-4">
                        <p className="text-black font-bold text-lg">Botanical Data</p>
                    </div>
                    <div className="text-black text-5xl  lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div>
                </div>
            </div>

            <div className="py-6 flex justify-center w-full">
                <div className="w-[90%]">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col  gap-y-2 py-2">
                            <p className="text-lg font-semibold">{item.title}:</p>
                            <p className="bg-white border-2 border-slate-200 w-full h-12 rounded-lg px-3 py-1 text-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TreeComponent;
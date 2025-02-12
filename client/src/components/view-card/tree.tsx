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
        <div className=" relative bg-opacity-45 pb-32 md:pb-20  overflow-x-hidden">
            <div className="relative flex justify-center items-center">
                <img src="/botanical_cover.png" alt="" className="w-full h-80 block md:hidden" />
                <img src="/botanical_cover_lg.png" alt="" className="hidden md:block w-full h-80"/>
                <div className="absolute top-5">
                    <div className="flex flex-col justify-center items-center sm:py-4">
                        <img src="/person_img.png" alt="" className="w-32" />
                        <p className="text-white font-bold text-4xl pt-3">Cactus</p>

                    </div>
                    {/* <div className="text-black text-5xl  lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div> */}
                </div>
            </div>

            <div className="py-6 flex flex-col items-center justify-center w-[85%] bg-[#F7F7F7] mx-auto border-2 mt-10 rounded-3xl ">
                <div className="sm:w-[40%] w-[80%]">
                    {data.map((item, index) => (
                        <div key={index} className="flex ">
                            <p className="text-lg font-semibold w-60 py-3">{item.title}:</p>
                            <p className=" border-b-[2px] border-dashed border-gray-500 ml-5 w-full px-3 py-1 text-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col justify-center items-center mt-10 pb-10">
                    <p className="pb-3 text-xl font-semibold">Made with</p>
                    <img src="/voolata_long_r.png" alt="" className="w-36" />
                </div>
            </div>

        </div>
    );
};

export default TreeComponent;
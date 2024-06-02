import { Tree } from "@/types/types";

interface PropsType {
  card: Tree | null;
}

const TreeComponent = ({ card }: PropsType) => {
  return (
    <>
      <div className="relative flex flex-col w-full bg-green-300 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
        <div className="flex justify-start font-Kanit pl-6 py-4">
          <p className="">Botanical Data</p>
        </div>
        <div className="flex justify-start font-Kanit text-5xl font-bold mb-10">
          <h1 className="font-Alice pl-6">{card?.name}</h1>
        </div>
      </div>
      <div className="relative flex justify-center lg:mb-2 lg:rounded-b-xl bg-yellow-100 font-Kanit -mt-[4rem]">
        <div className="flex flex-col w-[90%] mt-[6rem]">
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Tree Name:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.name}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Scientific Name:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.scientificName}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Tree type:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.treeType}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Location:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.location}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Description:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.description}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Features:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.features}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Maintenance:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.maintenance}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Benefits:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.benefits}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full pt-2 pb-2 lg:mb-[12rem]">
            <div className="flex justify-start">
              <label htmlFor="">Fun Facts:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg"
                defaultValue={card?.funFact}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TreeComponent;

import { Tree } from "@/types/types";

interface PropsType {
  card: Tree | null;
}

const TreeComponent = ({ card }: PropsType) => {
  return (
    <>
      <div className="flex flex-col w-full bg-green-300 py-4">
        <div className="flex justify-start font-Kanit pl-6 py-4">
          <p className="">Botanical Data</p>
        </div>
        <div className="flex justify-center font-Kanit text-4xl font-bold mb-10">
          <h1 className="pr-10">WaterMelon</h1>
        </div>
      </div>
      <div className="flex justify-center bg-yellow-200 font-Kanit">
        <div className="flex flex-col w-[90%]">
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Tree Name:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
                defaultValue={card?.benefits}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col w-full py-2">
            <div className="flex justify-start">
              <label htmlFor="">Fun Facts:</label>
            </div>
            <div className="w-full flex justify-center pt-2">
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-md pl-3 py-1 text-lg"
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

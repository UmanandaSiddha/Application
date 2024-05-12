import { MedicalType } from "@/types/types";
import { MdLocationOn } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";

interface PropsType {
  card: MedicalType | null;
}

const MedicalComponent = ({ card }: PropsType) => {
  const birthDate = card?.personalInfo.birth
    ? new Date(card.personalInfo.birth)
    : null;
  const formattedDate = birthDate ? birthDate.toLocaleDateString() : "";
  const healthHabits = [
    {
      name: "Smoker",
      value: card?.healthHabits?.smoker,
    },
    {
      name: "Alcohol Consumption",
      value: card?.healthHabits?.alcohol,
    },
    {
      name: "Exercise Routine",
      value: card?.healthHabits?.exercise,
    },
    {
      name: "Dietary Preferences",
      value: card?.healthHabits?.diet,
    },
    {
      name: "Mental Condition",
      value: card?.healthHabits?.mentalCondition,
    },
    {
      name: "Vaccination History",
      value: card?.healthHabits?.vaccinationHistory,
    },
  ];
  return (
    <>
      <div className="relative flex flex-col w-full bg-blue-800 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
            <div className="flex justify-start font-Kanit pl-6 py-4">
                <p className="font-bold text-white">
                    Medical Data
                </p>
            </div>
            <div className="lex justify-start font-Kanit text-5xl font-bold mb-10">
                <h1 className="font-Alice pl-6 text-white">
                    {card?.personalInfo.name}
                </h1>
            </div>
        </div>

      <div className="relative flex justify-center bg-violet-400 font-Kanit -mt-[4rem] pb-10">
        <div className="w-[90%] bg-slate-300 mt-[6rem] rounded-3xl shadow-xl">
          <div className="flex justify-center px-4 pt-8 pb-4">
            <div className="w-[90%] bg-white p-4 rounded-3xl">
              <div className="">
                <p className="font-Kanit text-2xl font-bold">
                  {card?.personalInfo.name}
                </p>
              </div>
              <div className="">
                <p className="font-Alice text-slate-400">
                  {card?.personalInfo.gender}
                </p>
              </div>
              <hr className="text-slate-400 my-3" />
              <div className="flex">
                <div className="basis-1/2 flex justify-center">
                  Date of Birth:
                </div>
                <div className="basis-1/2 flex justify-start">
                  {formattedDate}
                </div>
              </div>
              <div className="flex">
                <div className="basis-1/2 flex justify-center">
                  Phone Number:
                </div>
                <div className="basis-1/2 flex justify-start">
                  {card?.personalInfo.phone}
                </div>
              </div>
              <div className="flex">
                <div className="basis-1/2 flex justify-center">
                  Email Address:
                </div>
                <div className="basis-1/2 flex justify-start">
                  {card?.personalInfo.email}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[90%] pl-4">
              <div className="font-Kanit font-bold text-lg">
                Emergency Contact:
              </div>
              <div className="flex justify-start pt-3">
                <div className="w-[40%] bg-white rounded-xl shadow-xl">
                  <div className="py-2 flex flex-col justify-center items-center">
                    <p className="text-lg">
                      {card?.personalInfo.emergency.name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {card?.personalInfo.emergency.relation}
                    </p>
                  </div>
                  <div className="flex justify-center pb-3">
                    <button className="w-[90%] bg-green-400 text-white rounded-md">
                      Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* address details */}
          <div className="flex justify-center py-4">
            <div className="w-[80%] bg-white p-4 rounded-xl shadow-xl">
              <div className="flex">
                <div className="">
                  <p className="text-lg font-bold">Address</p>
                </div>
                <div className="pl-3">
                  <MdLocationOn className="text-[1.5rem] text-red-500" />
                </div>
              </div>
              <hr className="text-slate-400 my-2" />
              <div className="text-slate-500">
                <p className="pl-2">{card?.personalInfo?.address?.street}</p>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">City:</div>
                <div className="basis-1/2">
                  {card?.personalInfo?.address?.city}
                </div>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">State:</div>
                <div className="basis-1/2">
                  {card?.personalInfo?.address?.state}
                </div>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">
                  Postal Code:
                </div>
                <div className="basis-1/2">
                  {card?.personalInfo?.address?.postalCode}
                </div>
              </div>
            </div>
          </div>
          {/* known allergies */}
          <div className="flex justify-center pb-4 -mt-1">
            <div className="w-[90%] pl-4">
              <div className="">
                <p className="text-xl font-bold pl-2">Known Allergies:</p>
              </div>
              <div className="w-[80%] pl-2 py-2">
                <input
                  type="text"
                  className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                  readOnly
                  defaultValue={card?.healthHistory.allergy}
                />
              </div>
            </div>
          </div>
          {/* chronic */}
          <div className="flex justify-center pb-4 -mt-1">
            <div className="w-[90%] pl-4">
              <div className="">
                <p className="text-xl font-bold pl-2">
                  Chronic Medical Conditions:
                </p>
              </div>
              <div className="w-[80%] pl-2 py-2">
                <input
                  type="text"
                  className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                  readOnly
                  defaultValue={card?.healthHistory.chronic}
                />
              </div>
            </div>
          </div>
          {/* current medications */}
          <div className="flex justify-center pb-4 -mt-1">
            <div className="w-[90%] pl-4">
              <div className="">
                <p className="text-xl font-bold pl-2">Current Medications:</p>
              </div>
              <div className="w-[80%] pl-2 py-2">
                <input
                  type="text"
                  className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                  readOnly
                  defaultValue={card?.currentMedication}
                />
              </div>
            </div>
          </div>
          {/* health habits */}
          <div className="flex justify-center pb-4 -mt-1">
            <div className="w-[90%] pl-4">
              {healthHabits.map((health, idx) => (
                <>
                  <div className="" key={idx}>
                    <div className="">
                      <p className="text-xl font-bold pl-2">{health.name}:</p>
                    </div>
                    <div className="w-[80%] pl-2 py-2">
                      <input
                        type="text"
                        className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                        readOnly
                        defaultValue={health.value}
                      />
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
          {/* insuranceInfo */}
          <div className="flex justify-center pt-4 pb-8">
            <div className="w-[80%] bg-white p-4 rounded-xl shadow-xl">
              <div className="flex">
                <div className="">
                  <p className="text-lg font-bold">Insurance Information:</p>
                </div>
                <div className="pl-2">
                  <LuNewspaper className="text-red-500 text-xl" />
                </div>
              </div>
              <hr className="text-slate-400 my-2" />
              <div className="flex flex-row text-black">
                <div className="basis-1/2 flex justify-center">Provider:</div>
                <div className="basis-1/2">{card?.insuranceInfo?.provider}</div>
              </div>
              <div className="flex flex-row text-black">
                <div className="basis-1/2 flex justify-center">
                  Policy Number:
                </div>
                <div className="basis-1/2">
                  {card?.insuranceInfo?.policyNumber}
                </div>
              </div>
              <div className="flex flex-row text-black">
                <div className="basis-1/2 flex justify-center">
                  Group Number:
                </div>
                <div className="basis-1/2">
                  {card?.insuranceInfo?.grpNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalComponent;

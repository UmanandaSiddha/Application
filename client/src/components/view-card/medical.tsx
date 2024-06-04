import { MedicalType } from "@/types/types";
import { MdLocationOn } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";

interface PropsType {
  card: MedicalType | null;
}

const MedicalComponent = ({ card }: PropsType) => {
  const birthDate = card?.dateOfBirth
    ? new Date(card.dateOfBirth)
    : null;
  const formattedDate = birthDate ? birthDate.toLocaleDateString() : "";
  const healthHabits = [
    {
      name: "Smoker",
      value: card?.smoker,
    },
    {
      name: "Alcohol Consumption",
      value: card?.alcohol,
    },
    {
      name: "Exercise Routine",
      value: card?.exercise,
    },
    {
      name: "Dietary Preferences",
      value: card?.diet,
    },
    {
      name: "Mental Condition",
      value: card?.mentalCondition,
    },
    {
      name: "Vaccination History",
      value: card?.vaccinationHistory,
    },
  ];
  return (
    <>
      <div className="relative flex flex-col w-full bg-blue-800 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
        <div className="flex justify-start font-Kanit pl-6 py-4">
          <p className="font-bold text-white">Medical Data</p>
        </div>
        <div className="lex justify-start font-Kanit text-5xl font-bold mb-10">
          <h1 className="font-Alice pl-6 text-white">
            {card?.name}
          </h1>
        </div>
      </div>

      <div className="relative flex justify-center bg-violet-400 lg:rounded-b-xl lg:mb-2 font-Kanit -mt-[4rem] pb-10">
        <div className="w-[90%] lg:hidden bg-slate-300 mt-[6rem] rounded-3xl shadow-xl">
          <div className=" flex justify-center px-4 pt-8 pb-4">
            {/* introduction */}
            <div className="w-[90%] bg-white p-4 rounded-3xl">
              <div className="">
                <p className="font-Kanit text-2xl font-bold">
                  {card?.name}
                </p>
              </div>
              <div className="">
                <p className="font-Alice text-slate-400">
                  {card?.gender}
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
                  {card?.phone}
                </div>
              </div>
              <div className="flex">
                <div className="basis-1/2 flex justify-center">
                  Email Address:
                </div>
                <div className="basis-1/2 flex justify-start">
                  {card?.email}
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
                      {card?.emergencyName}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {card?.emergencyRelation}
                    </p>
                  </div>
                  <div className="flex justify-center pb-3">
                    <button className="w-[90%] bg-green-400 text-white rounded-lg">
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
                <p className="pl-2">{card?.street}</p>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">City:</div>
                <div className="basis-1/2">
                  {card?.city}
                </div>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">State:</div>
                <div className="basis-1/2">
                  {card?.state}
                </div>
              </div>
              <div className="flex flex-row text-slate-500">
                <div className="basis-1/2 flex justify-center">
                  Postal Code:
                </div>
                <div className="basis-1/2">
                  {card?.postalCode}
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
                <textarea
                  // type="text"
                  className="w-full flex justify-center px-4 spin-button-none py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                  readOnly
                  defaultValue={card?.allergyHistory}
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
                <textarea
                  // type="text"
                  className="w-full flex justify-center px-4 spin-button-none py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                  readOnly
                  defaultValue={card?.chronicHistory}
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
                <textarea
                  // type="text"
                  className="w-full flex justify-center px-4 py-3 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl spin-button-none"
                  readOnly
                  defaultValue={card?.currentMedication}
                />
                {/* <div className="w-full pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl">
                    {card?.currentMedication}
                </div> */}
              </div>
            </div>
          </div>
          {/* health habits */}
          <div className="flex justify-center pb-4 -mt-1">
            <div className="w-[90%] pl-4">
              {healthHabits.map((health, idx) => (
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
              ))}
            </div>
          </div>
          {/* insuranceInfo */}
          <div className="flex justify-center pt-4 pb-8 lg:pb-20">
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
                <div className="basis-1/2">{card?.insuranceProvider}</div>
              </div>
              <div className="flex flex-row text-black">
                <div className="basis-1/2 flex justify-center">
                  Policy Number:
                </div>
                <div className="basis-1/2">
                  {card?.insurancePolicyNumber}
                </div>
              </div>
              <div className="flex flex-row text-black">
                <div className="basis-1/2 flex justify-center">
                  Group Number:
                </div>
                <div className="basis-1/2">
                  {card?.insuranceGrpNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block mt-[5rem] w-full">
          <div className="flex flex-row w-full">
            <div className="basis-1/2 flex justify-end mr-4">
              <div className="bg-white w-[95%] p-4 rounded-3xl">
                <div className="flex justify-center">
                  <p className="font-Philosopher text-2xl font-bold">
                    {card?.name}
                  </p>
                </div>
                <div className="flex justify-center">
                  <p className="font-Alice text-slate-400">
                    {card?.gender}
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
                    {card?.phone}
                  </div>
                </div>
                <div className="flex">
                  <div className="basis-1/2 flex justify-center">
                    Email Address:
                  </div>
                  <div className="basis-1/2 flex justify-start">
                    {card?.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/2 flex justify-start">
              <div className="bg-white w-[80%] p-4 rounded-3xl shadow-xl">
                <div className="flex justify-center">
                  <div className="">
                    <p className="text-base font-bold">Address</p>
                  </div>
                  <div className="pl-3">
                    <MdLocationOn className="text-[1.3rem] text-red-500" />
                  </div>
                </div>
                <hr className="text-slate-400 my-2" />
                <div className="flex flex-row text-slate-500">
                  <div className="basis-1/2 flex justify-center">Street:</div>
                  <div className="basis-1/2">
                    <textarea readOnly className="w-full" defaultValue={card?.street} />

                  </div>
                </div>
                <div className="flex flex-row text-slate-500">
                  <div className="basis-1/2 flex justify-center">City:</div>
                  <div className="basis-1/2">
                    <textarea readOnly className="w-full" defaultValue={card?.city} />
                  </div>
                </div>
                <div className="flex flex-row text-slate-500">
                  <div className="basis-1/2 flex justify-center">State:</div>
                  <div className="basis-1/2">
                    {card?.state}
                  </div>
                </div>
                <div className="flex flex-row text-slate-500">
                  <div className="basis-1/2 flex justify-center">
                    Postal Code:
                  </div>
                  <div className="basis-1/2">
                    {card?.postalCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className=" w-full flex justify-center">
              <div className="w-[90%] pl-3 ml-[3rem] mt-4 py-2">
                <div className="font-Philosopher flex justify-start font-bold text-xl">
                  Emergency Contacts:
                </div>
                <div className="pt-3">
                  <div className="w-[40%] bg-white rounded-xl shadow-xl">
                    <div className="py-2 flex flex-col justify-center items-center">
                      <p className="text-lg">
                        {card?.emergencyName}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {card?.emergencyRelation}
                      </p>
                    </div>
                    <div className="flex justify-center pb-3">
                      <button className="w-[90%] bg-green-400 text-white rounded-lg">
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex justify-center">
              <div className="flex justify-center pb-4 w-[90%] ml-4 mt-4">
                <div className="w-full pl-4">
                  <div className="">
                    <p className="text-xl font-bold pl-2 font-Philosopher">
                      Known Allergies:
                    </p>
                  </div>
                  <div className="w-[80%] pl-2 py-2">
                    <textarea
                      // type="text"
                      className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                      readOnly
                      defaultValue={card?.allergyHistory}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* chronic */}
            <div className="flex justify-center">
              <div className="flex justify-center pb-4 w-[90%] ml-4">
                <div className="w-full pl-4">
                  <div className="">
                    <p className="text-xl font-bold pl-2 font-Philosopher">
                      Chronic Medical Conditions:
                    </p>
                  </div>
                  <div className="w-[80%] pl-2 py-2">
                    <textarea
                      // type="text"
                      className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                      readOnly
                      defaultValue={card?.chronicHistory}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* current medications */}
            <div className="flex justify-center">
              <div className="flex justify-center pb-4 w-[90%] ml-4">
                <div className="w-full pl-4">
                  <div className="">
                    <p className="text-xl font-bold pl-2 font-Philosopher">
                      Current Medications:
                    </p>
                  </div>
                  <div className="w-[80%] pl-2 py-2">
                    <textarea
                      // type="text"
                      className="w-full flex justify-center pl-4 py-2 rounded-lg text-white font-Kanit bg-blue-400 shadow-xl"
                      readOnly
                      defaultValue={card?.currentMedication}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* health habits */}
            <div className="flex justify-center">
              <div className="flex justify-center pb-4 w-[90%] ml-4">
                <div className="w-full pl-4">
                  {healthHabits.map((health, idx) => (
                    <>
                      <div className="mt-2" key={idx}>
                        <div className="">
                          <p className="text-xl font-bold pl-2 font-Philosopher">
                            {health.name}:
                          </p>
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
            </div>

            <div className="flex justify-center">
              <div className="flex justify-center pt-4 pb-8 lg:pb-20 w-[80%]">
                <div className="w-full bg-white p-4 rounded-xl shadow-xl">
                  <div className="flex">
                    <div className="">
                      <p className="text-lg font-bold font-Philosopher">
                        Insurance Information:
                      </p>
                    </div>
                    <div className="pl-2">
                      <LuNewspaper className="text-red-500 text-xl" />
                    </div>
                  </div>
                  <hr className="text-slate-400 my-2" />
                  <div className="flex flex-row text-black">
                    <div className="basis-1/2 flex justify-center font-Philosopher underline">
                      Provider:
                    </div>
                    <div className="basis-1/2 ml-4">
                      {card?.insuranceProvider}
                    </div>
                  </div>
                  <div className="flex flex-row text-black">
                    <div className="basis-1/2 flex justify-center font-Philosopher underline">
                      Policy Number:
                    </div>
                    <div className="basis-1/2 ml-4">
                      {card?.insurancePolicyNumber}
                    </div>
                  </div>
                  <div className="flex flex-row text-black">
                    <div className="basis-1/2 flex justify-center font-Philosopher underline">
                      Group Number:
                    </div>
                    <div className="basis-1/2 ml-4">
                      {card?.insuranceGrpNumber}
                    </div>
                  </div>
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

import { CgProfile } from "react-icons/cg";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { IoPawSharp } from "react-icons/io5";
import { GiPlantsAndAnimals } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DashButtons = () => {
    const navigate = useNavigate();
    const { user } = useSelector(
        (state: RootState) => state.userReducer
      );

  return (
    <>
      <div
        className={`sm:justify-start flex flex-wrap justify-center lg:border-r-2 lg:py-[4rem] lg:pr-4 lg:border-r-slate-300 mt-20`}
      >
        <div className="w-full flex justify-center pt-4">
          <div className="w-[100%] text-white">
            <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
              <div className="basis-1/7 pl-2 sm:py-3 lg:py-1">
                <CgProfile className="w-[1.5rem] h-[1.5rem] text-black" />
              </div>
              <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.3rem] font-bold text-black py-3">
                Individual
              </div>
              <button
                className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                disabled={!user?.isVerified}
                onClick={() => {
                  navigate("/dashboard/cards?type=individual");
                }}
              >
                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
              </button>
            </div>
          </div>
        </div>
        {/* Botany */}
        <div className="w-full flex justify-center pt-4">
          <div className="w-[100%] text-white">
            <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
              <div className="basis-1/7 pl-2 py-3">
                <GiPlantsAndAnimals className="w-[1.5rem] h-[1.5rem] text-black" />
              </div>
              <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                Botany
              </div>
              <button
                className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                disabled={!user?.isVerified}
                onClick={() => {
                  navigate("/dashboard/cards?type=botanical");
                }}
              >
                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* medical cards */}
        <div className="w-full flex justify-center pt-4">
          <div className="w-[100%] text-white">
            <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
              <div className="basis-1/7 pl-2 py-3">
                <FaBriefcaseMedical className="w-[1.5rem] h-[1.5rem] text-black" />
              </div>
              <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                Medical
              </div>
              <button
                className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                disabled={!user?.isVerified}
                onClick={() => {
                  navigate("/dashboard/cards?type=medical");
                }}
              >
                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* creator cards */}
        <div className="w-full flex justify-center pt-4">
          <div className="w-[100%] text-white">
            <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
              <div className="basis-1/7 pl-2 py-3">
                <MdOutlineSubscriptions className="w-[1.5rem] h-[1.5rem] text-black" />
              </div>
              <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                Creator
              </div>
              <button
                className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                disabled={!user?.isVerified}
                onClick={() => {
                  navigate("/dashboard/cards?type=creator");
                }}
              >
                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* animal cards */}
        <div className="w-full flex justify-center pt-4">
          <div className="w-[100%] text-white">
            <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
              <div className="basis-1/7 pl-2 py-3">
                <IoPawSharp className="w-[1.5rem] h-[1.5rem] text-black" />
              </div>
              <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                Animal
              </div>
              <button
                className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                disabled={!user?.isVerified}
                onClick={() => {
                  navigate("/dashboard/cards?type=animal");
                }}
              >
                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashButtons;

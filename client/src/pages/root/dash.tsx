import { Button } from "@/components/ui/button";
import { Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { requestVerifyUser } from "@/redux/api/userApi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { IoPawSharp } from "react-icons/io5";
import { GiPlantsAndAnimals } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { MdQrCodeScanner } from "react-icons/md";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import AllCards from "../cards/all-cards-md";
import { Animal, Creator, MedicalType, Personal, Tree, User } from "../../types/types";
import {useWindowWidth} from "@react-hook/window-size"
// import AllCards from "../cards/all-cards";

const Dashboard = () => {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );
  const [load, setLoad] = useState<boolean>(false);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  const handleRequestVerify = useCallback(async () => {
    try {
      await requestVerifyUser();
      toast.success("Email Sent!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [navigate]);

//   useEffect(() => {
//     if(type){
//         switch(type){
//             case "animal":
//                 navigate("/dashboard/cards?type=animal");
//                 break;
//             case "tree":
//                 navigate("/dashboard/cards?type=tree");
//                 break;
//             case "medical":
//                 navigate("/dashboard/cards?type=medical");
//                 break;
//             case "personal":
//                 navigate("/dashboard/cards?type=personal");
//                 break;
//             case "creator":
//                 navigate("/dashboard/cards?type=creator");
//                 break;
//             default:
//                 navigate("/dashboard");
//                 break;
//         }
//     }
//   }, []);

  return (
    <>
      {/* <div className="">
        <p className="text-2xl pl-[3rem] font-Philosopher">Hello, {`${user?.name}`}</p>
      </div> */}
      {/* <div className="pt-4 font-Kanit pl-4 text-2xl">
        <div className="pl-5 font-bold">Dashboard</div> 
        <div className=" flex justify-center">
          <hr className="w-[90%] border-blue-400 border-4 rounded-xl" />
        </div>
      </div> */}
      <div className="flex flex-col justify-center gap-8 items-center">
        {loading ? (
          <Loader />
        ) : (
          <>
            {!user?.isVerified && (
              <div className="flex flex-col justify-center items-center space-y-4">
                <p className="text-red-600 font-semibold">
                  You are not verified
                </p>
                <Button onClick={handleRequestVerify}>Verify Email</Button>
              </div>
            )}
            <div className="sm:flex sm:flex-col sm:w-full md:flex-row">

              <div className={`${!type && "md:basis-1/4"} sm:justify-start flex flex-wrap justify-center md:border-r-2 md:py-[4rem] md:border-r-slate-300 mt-20`}>

                <div className="w-full flex justify-center pt-4">
                    <div className="w-[90%] text-white">
                        <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                            <div className="basis-1/7 pl-2 sm:py-3 lg:py-1">
                                <CgProfile className="w-[1.5rem] h-[1.5rem] text-black" />
                            </div>
                            <div className="basis-5/7 flex justify-start pl-6 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                                Individual
                            </div>
                            <button className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3" disabled={!user?.isVerified} onClick={() => {
                                navigate("/dashboard/cards?type=personal")
                            }} >
                                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Botany */}
                <div className="w-full flex justify-center pt-4">
                    <div className="w-[90%] text-white">
                        <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                            <div className="basis-1/7 pl-2 py-3">
                                <GiPlantsAndAnimals className="w-[1.5rem] h-[1.5rem] text-black" />
                            </div>
                            <div className="basis-5/7 flex justify-start pl-6 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                                Botany
                            </div>
                            <button className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3" disabled={!user?.isVerified} onClick={() => {
                                navigate("/dashboard/cards?type=tree")
                            }} >
                                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* medical cards */}
                <div className="w-full flex justify-center pt-4">
                    <div className="w-[90%] text-white">
                        <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                            <div className="basis-1/7 pl-2 py-3">
                                <FaBriefcaseMedical className="w-[1.5rem] h-[1.5rem] text-black" />
                            </div>
                            <div className="basis-5/7 flex justify-start pl-6 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                                Medical
                            </div>
                            <button className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3" disabled={!user?.isVerified} onClick={() => {
                                navigate("/dashboard/cards?type=medical")
                            }} >
                                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* creator cards */}
                <div className="w-full flex justify-center pt-4">
                    <div className="w-[90%] text-white">
                        <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                            <div className="basis-1/7 pl-2 py-3">
                                <MdOutlineSubscriptions className="w-[1.5rem] h-[1.5rem] text-black" />
                            </div>
                            <div className="basis-5/7 flex justify-start pl-4 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                                Creator
                            </div>
                            <button className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3" disabled={!user?.isVerified} onClick={() => {
                                navigate("/dashboard/cards?type=creator")
                            }} >
                                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* animal cards */}
                <div className="w-full flex justify-center pt-4">
                    <div className="w-[90%] text-white">
                        <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                            <div className="basis-1/7 pl-2 py-3">
                                <IoPawSharp className="w-[1.5rem] h-[1.5rem] text-black" />
                            </div>
                            <div className="basis-5/7 flex justify-start pl-4 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                                Animal
                            </div>
                            <button className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3" disabled={!user?.isVerified} onClick={() => {
                                navigate("/dashboard/cards?type=animal")
                            }} >
                                <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                            </button>
                        </div>
                    </div>
                </div>
              </div>

              
                {(!type) && (
                    <div className="hidden sm:block md:basis-3/4 w-full md:flex md:justify-center md:items-center max-h-screen" id="rightSection">
                        <div className="">
                        <MdQrCodeScanner className="w-[10rem] h-[10rem] text-slate-400" />
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                        <p className="">
                            Click on any five
                        </p>
                        </div>
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                        <p className="">
                            options on the left to
                        </p>
                        </div>
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                        <p className="">
                            view your VCards.
                        </p>
                        </div>
                    </div>
                    </div>
                    )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;

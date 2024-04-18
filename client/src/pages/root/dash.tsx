import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { requestVerifyUser } from "@/redux/api/userApi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { IoPawSharp } from "react-icons/io5";
import { GiPlantsAndAnimals } from "react-icons/gi";

import { toast } from "react-toastify";
import { useCallback } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const handleRequestVerify = useCallback(async () => {
    try {
      await requestVerifyUser();
      toast.success("Email Sent!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [navigate]);

  return (
    <>
    <div className="">
        <p className="font-Kanit text-2xl pl-4">Hello, {`${user?.name}`}</p>
      </div>
      <div className="pt-4 font-Kanit pl-4 text-2xl">
        <div className="pl-5 font-bold">Dashboard</div>
        <div className=" flex justify-center">
          <hr className="w-[90%] border-blue-400 border-4 rounded-xl" />
        </div>
      </div>
    <div className="flex flex-col justify-center gap-8 items-center mt-8">
      {loading ? (
        <Loader />
      ) : (
        <>
          {!user?.isVerified && (
            <div className="flex flex-col justify-center items-center space-y-4">
              <p className="text-red-600 font-semibold">You are not verified</p>
              <Button onClick={handleRequestVerify}>Verify Email</Button>
            </div>
          )}
          <div className="flex flex-wrap justify-center">
          <div className="w-full flex justify-center pt-4">
              <div className="w-[90%] bg-green-700 rounded-md text-white">
                <div className="flex flex-row pt-2 font-Kanit">
                  <div className="basis-1/6 pl-2 flex items-center">
                    <GiPlantsAndAnimals className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <div className="basis-3/6 flex justify-start">
                    <p className="">Botany</p>
                  </div>
                  <div className="basis-2/6">Edit Info</div>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    className="w-[90%] px-4 py-2 bg-white rounded-md hover:cursor-pointer text-black font-Kanit"
                    disabled={!user?.isVerified}
                    onClick={() => {
                      navigate("/dashboard/cards?type=tree");
                    }}
                  >
                    Add Another Card
                  </button>
                </div>
                <div className=""></div>
              </div>
            </div>
            
            {/* personal button */}
            <div className="w-full flex justify-center py-4">
              <div className="w-[90%] bg-blue-500 rounded-md text-white">
                <div className="flex flex-row pt-2 font-Kanit">
                  <div className="basis-1/6 pl-2 flex items-center">
                    <CgProfile className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <div className="basis-3/6 flex justify-start">
                    <p className="">Individual</p>
                  </div>
                  <div className="basis-2/6">Edit Info</div>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    className="w-[90%] px-4 py-2 bg-white rounded-md hover:cursor-pointer text-black font-Kanit"
                    disabled={!user?.isVerified}
                    onClick={() => {
                      navigate("/dashboard/cards?type=personal");
                    }}
                  >
                    Add Another Card
                  </button>
                </div>
                <div className=""></div>
              </div>
            </div>


            {/* medical cards */}
            <div className="w-full flex justify-center py-4">
              <div className="w-[90%] bg-blue-800 rounded-md text-white">
                <div className="flex flex-row pt-2 font-Kanit">
                  <div className="basis-1/6 pl-2 flex items-center">
                    <FaBriefcaseMedical className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <div className="basis-3/6 flex justify-start">
                    <p className="">Medical</p>
                  </div>
                  <div className="basis-2/6">Edit Info</div>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    className="w-[90%] px-4 py-2 bg-white rounded-md hover:cursor-pointer text-black font-Kanit"
                    disabled={!user?.isVerified}
                    onClick={() => {
                      navigate("/dashboard/cards?type=medical");
                    }}
                  >
                    Add Another Card
                  </button>
                </div>
                <div className=""></div>
              </div>
            </div>

            {/* creator cards */}
            <div className="w-full flex justify-center py-4">
              <div className="w-[90%] bg-blue-300 rounded-md text-white">
                <div className="flex flex-row pt-2 font-Kanit">
                  <div className="basis-1/6 pl-2 flex items-center">
                    <MdOutlineSubscriptions className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <div className="basis-3/6 flex justify-start">
                    <p className="">Creator</p>
                  </div>
                  <div className="basis-2/6">Edit Info</div>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    className="w-[90%] px-4 py-2 bg-white rounded-md hover:cursor-pointer text-black font-Kanit"
                    disabled={!user?.isVerified}
                    onClick={() => {
                      navigate("/dashboard/cards?type=creator");
                    }}
                  >
                    Add Another Card
                  </button>
                </div>
                <div className=""></div>
              </div>
            </div>
            
            {/* animal cards */}
            <div className="w-full flex justify-center py-4">
              <div className="w-[90%] bg-red-300 rounded-md text-white">
                <div className="flex flex-row pt-2 font-Kanit">
                  <div className="basis-1/6 pl-2 flex items-center">
                    <IoPawSharp className="w-[1.5rem] h-[1.5rem]" />
                  </div>
                  <div className="basis-3/6 flex justify-start">
                    <p className="">Animal</p>
                  </div>
                  <div className="basis-2/6">Edit Info</div>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    className="w-[90%] px-4 py-2 bg-white rounded-md hover:cursor-pointer text-black font-Kanit"
                    disabled={!user?.isVerified}
                    onClick={() => {
                      navigate("/dashboard/cards?type=animal");
                    }}
                  >
                    Add Another Card
                  </button>
                </div>
                <div className=""></div>
              </div>
            </div>


          </div>
        </>
      )}
    </div>
    </>
  );
};

export default Dashboard;

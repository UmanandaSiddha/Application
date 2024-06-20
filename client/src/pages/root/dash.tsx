import DashButtons from "@/components/rest/dash.buttons";
import { MdQrCodeScanner } from "react-icons/md";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";

const Dashboard = () => {
  const navigate = useNavigate();

  const [load, setLoad] = useState<boolean>(false);
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");

  const handleRequestVerify = useCallback(async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/request/verification`,
        { withCredentials: true }
      );
      toast.success("Email Sent!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [navigate]);
  return (
    <>
      <div className="flex flex-row justify-center gap-8 items-center">
        {loading ? (
          <Loader />
        ) : (
          <>
            {!user?.isVerified ? (
              <div className="flex flex-col justify-center items-center space-y-4 mt-[2rem]">
                <p className="text-red-600 font-semibold font-Philosopher">
                  You are not verified
                </p>
                {/* <Button onClick={handleRequestVerify} className="font-Philosopher text-lg">Verify Email</Button> */}
                <p className="font-Philosopher text-lg hover:underline">
                  <Link to="/profile">
                    Go to the Profile Page to verify your email
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`flex flex-col lg:basis-1/4 sm:w-full lg:w-full lg:flex-row ${
                    location.pathname === `/dashboard/${type}/create` &&
                    "lg:w-[80%]"
                  }`}
                >
                  <DashButtons />
                </div>
              </>
            )}
          </>
        )}
        {location.pathname === "/dashboard" && (
          <div
            className="hidden lg:basis-3/4 w-full lg:flex lg:justify-center lg:items-center max-h-screen"
            id="rightSection"
          >
            <div className="">
              <MdQrCodeScanner className="w-[10rem] h-[10rem] text-slate-400" />
              <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                <p className="">Click on any five</p>
              </div>
              <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                <p className="">options on the left to</p>
              </div>
              <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                <p className="">view your VCards.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;

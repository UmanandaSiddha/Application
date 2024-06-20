import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

import Header from "./components/rest/header";
import Footer from "./components/rest/footer";
import Loader from "./components/rest/loader";
import ProtectedRoute from "./components/rest/protected-route";

const Home = lazy(() => import("./pages/root/home"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const NotFound = lazy(() => import("./pages/root/not-found"));
const Dashboard = lazy(() => import("./pages/root/dash"));
const Profile = lazy(() => import("./pages/root/profile"));
const Verify = lazy(() => import("./pages/auth/verify"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const PlanPage = lazy(() => import("./pages/plans/plan"));
const AdminPlan = lazy(() => import("./pages/admin-plan"));
const BillingPage = lazy(() => import("./pages/plans/billing"));
const RecieptPage = lazy(() => import("./pages/plans/reciept"));
const Onboarding = lazy(() => import("./pages/auth/onboarding"));
const OrgRegister = lazy(() => import("./pages/auth/orgRegister"));
const Donation = lazy(() => import("./pages/donation/donation"));
const Checkout = lazy(() => import("./pages/plans/checkout"));

const AllCards = lazy(() => import("./pages/cards/all-cards"));
const ViewCard = lazy(() => import("./pages/cards/view-card"));
const DisplayCard = lazy(() => import("./pages/cards/display-card"));

const CreateTree = lazy(() => import("./pages/cards/inputs/tree"));
const CreatePersonal = lazy(() => import("./pages/cards/inputs/personal"));
const MedicalInput = lazy(() => import("./pages/cards/inputs/medical"));
const CreatorInput = lazy(() => import("./pages/cards/inputs/creator"));
const CreateAnimal = lazy(() => import("./pages/cards/inputs/animal"));

const RequestCustom = lazy(() => import("./pages/plans/request-custom"));
const ViewCustom = lazy(() => import("./pages/plans/view-custom"));

const DonationLogin = lazy(() => import("./pages/donation/login"));
const DonationCheckout = lazy(() => import("./pages/donation/checkout"));
const DonatorDashboard = lazy(() => import("./pages/donation/dash"));

const UnBlockPage = lazy(() => import("./pages/auth/unblock"));

const ContactUs = lazy(() => import("./pages/others/contact"));
const ReportPage = lazy(() => import("./pages/others/report"));

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DonatorResponse, UserResponse } from "./types/api-types";
import axios from "axios";
import ErrorBoundary from "./components/rest/error-boundary";
import { useWindowWidth } from "@react-hook/window-size";
import { donatorExist, donatorNotExist } from "./redux/reducer/donatorReducer";

const App = () => {
  const width = useWindowWidth();
  const isMobile = width < 1030;
  const [search] = useSearchParams();
  const type = search.get("type");
  const id = search.get("id");
  const location = useLocation();

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true });
      dispatch(userExist(data.user));
    } catch (error: any) {
      dispatch(userNotExist());
    }
  };

  const fetchDonator = async () => {
    try {
        const { data }: { data: DonatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/donate/me`, { withCredentials: true });
        dispatch(donatorExist(data.donator));
    } catch (error: any) {
        dispatch(donatorNotExist());
    }
};

  useEffect(() => {
    fetchUser();
    fetchDonator();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ErrorBoundary>
      {!["/login", "/register"].includes(location.pathname) && (<Header />)}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home user={user!} />} />
            <Route path="/plans" element={<PlanPage />} />
            <Route path="/display" element={<DisplayCard />} />
            <Route path="/onboarding" element={<Onboarding />} />






            <Route path="/donation/login" element={<DonationLogin />} />
            <Route path="/donation/checkout" element={<DonationCheckout />} />
            <Route path="/donation/dashboard" element={<DonatorDashboard />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/unblock" element={<UnBlockPage />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* only for org  */}
            <Route path="/request-custom" element={<RequestCustom />} />
            <Route path="/view-custom" element={<ViewCustom />} />








            {/* Not logged In Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/organization/register" element={<OrgRegister />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/donation" element={<Donation />} />

            {/* Logged In User Routes */}
            <Route
              element={<ProtectedRoute isAuthenticated={user ? true : false} redirect="/login" />}
            >
              <Route path="/receipt" element={<RecieptPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/admin-plan" element={<AdminPlan />} />
              <Route path="/billing" element={<BillingPage />} />

              <Route path="/dashboard" element={
                !isMobile ? (
                  <>
                    <div className="flex justify-center">
                      <div className="w-[80%]">
                        <Dashboard />
                      </div>
                    </div>
                  </>
                ) : (
                  <Dashboard />
                )
              } />

              <Route
                path="/dashboard/cards"
                element={
                  !isMobile ? (
                    <>
                      <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className="basis-3/4 lg:max-h-screen">
                            {type && <AllCards />}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <AllCards />
                  )
                }
              />
              <Route
                path="/dashboard/cards/card"
                element={
                  !isMobile ? (
                    <>
                      <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                            {type && id && <ViewCard />}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <ViewCard />
                  )
                }
              />

              <Route
                path="/dashboard/botanical/create"
                element={
                  !isMobile ? (
                    <>
                    <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                          <CreateTree />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row">
                        <div className="basis-1/3">
                          <Dashboard />
                        </div>
                        <div className="basis-2/3">
                          <CreateTree />
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <CreateTree />
                  )
                }
              />

              <Route
                path="/dashboard/individual/create"
                element={
                  !isMobile ? (
                    <>
                    <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                          <CreatePersonal />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row">
                        <div className="basis-1/3">
                          <Dashboard />
                        </div>
                        <div className="basis-2/3">
                          <CreatePersonal />
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <CreatePersonal />
                  )
                }
              />
              <Route
                path="/dashboard/medical/create"
                element={
                  !isMobile ? (
                    <>
                    <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                          <MedicalInput />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row">
                        <div className="basis-1/3">
                          <Dashboard />
                        </div>
                        <div className="basis-2/3">
                          <MedicalInput />
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <MedicalInput />
                  )
                }
              />
              <Route
                path="/dashboard/creator/create"
                element={
                  !isMobile ? (
                    <>
                    <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                          <CreatorInput />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row">
                        <div className="basis-1/3">
                          <Dashboard />
                        </div>
                        <div className="basis-2/3">
                          <CreatorInput />
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <CreatorInput />
                  )
                }
              />
              <Route
                path="/dashboard/animal/create"
                element={
                  !isMobile ? (
                    <>
                    <div className="flex justify-center">
                        <div className="flex flex-row w-[80%]">
                          <div className="basis-1/4">
                            <Dashboard />
                          </div>
                          <div className={`basis-3/4 lg:max-h-screen`}>
                          <CreateAnimal />
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row">
                        <div className="basis-1/3">
                          <Dashboard />
                        </div>
                        <div className="basis-2/3">
                          <CreateAnimal />
                        </div>
                      </div> */}
                    </>
                  ) : (
                    <CreateAnimal />
                  )
                }
              />

              {/* <Route path="/pay" element={<Checkout />} /> */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* <Footer /> */}
      </ErrorBoundary>
    </div>
  );
};

export default App;

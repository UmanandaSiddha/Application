import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

import Header from "./components/rest/header";
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

const Donation = lazy(() => import("./pages/donation/donation"));
const DonationLogin = lazy(() => import("./pages/donation/login"));
const DonationCheckout = lazy(() => import("./pages/donation/checkout"));
const DonatorDashboard = lazy(() => import("./pages/donation/dash"));
const DonationBilling = lazy(() => import("./pages/donation/billing"));

const UnBlockPage = lazy(() => import("./pages/auth/unblock"));

const ContactUs = lazy(() => import("./pages/others/contact"));
const ReportPage = lazy(() => import("./pages/others/report"));

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DonatorResponse, UserResponse } from "./types/api-types";
import axios from "axios";
import ErrorBoundary from "./components/rest/error-boundary";
import { donatorExist, donatorNotExist } from "./redux/reducer/donatorReducer";

const App = () => {
    const location = useLocation();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { donator, loading:lod2 } = useSelector(
        (state: RootState) => state.donatorReducer
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
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/unblock" element={<UnBlockPage />} />

                        {/* Not logged In Route */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/organization/register" element={<OrgRegister />} />
                        <Route path="/reset" element={<ResetPassword />} />
                        <Route path="/donation" element={<Donation />} />
                        <Route path="/receipt" element={<RecieptPage />} />

                        <Route
                            element={<ProtectedRoute isAuthenticated={!lod2 && donator ? true : false} redirect="/donation/login" />}
                        >                         
                            <Route path="/donation/checkout" element={<DonationCheckout />} />
                            <Route path="/donation/dashboard" element={<DonatorDashboard />} />
                            <Route path="/donation/billing" element={<DonationBilling />} />
                        </Route>

                        {/* Logged In User Routes */}
                        <Route
                            element={<ProtectedRoute isAuthenticated={user ? true : false} redirect="/login" />}
                        >
                            {/* only for org  */}
                            <Route path="/request-custom" element={<RequestCustom />} />
                            <Route path="/view-custom" element={<ViewCustom />} />

                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/admin-plan" element={<AdminPlan />} />
                            <Route path="/billing" element={<BillingPage />} />

                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dashboard/cards" element={<AllCards />} />
                            <Route path="/dashboard/cards/card" element={<ViewCard />} />
                            <Route path="/dashboard/botanical/create" element={<CreateTree />} />
                            <Route path="/dashboard/individual/create" element={<CreatePersonal />} />
                            <Route path="/dashboard/medical/create" element={<MedicalInput />} />
                            <Route path="/dashboard/creator/create" element={<CreatorInput />} />
                            <Route path="/dashboard/animal/create" element={<CreateAnimal />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default App;

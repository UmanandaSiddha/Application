import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

import Header from "./components/rest/header";
import Loader from "./components/rest/loader";
import ProtectedRoute from "./components/rest/protected-route";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DonatorResponse, UserResponse } from "./types/api-types";
import axios from "axios";
import ErrorBoundary from "./components/rest/error-boundary";
import { donatorExist, donatorNotExist } from "./redux/reducer/donatorReducer";

import CreatorInput from "./pages/cards/inputs/creator";
import CreatePersonal from "./pages/cards/inputs/personal";
import MedicalInput from "./pages/cards/inputs/medical";
import CreateAnimal from "./pages/cards/inputs/animal";
import CreateTree from "./pages/cards/inputs/tree";
import NotFound from "./pages/root/not-found";
import RequestCustom from "./pages/plans/request-custom";
import ViewCustom from "./pages/plans/view-custom";
import Checkout from "./pages/plans/checkout";
import Profile from "./pages/root/profile";
import Verify from "./pages/auth/verify";
import BillingPage from "./pages/plans/billing";
import Dashboard from "./pages/root/dash";
import AllCards from "./pages/cards/all-cards";
import ViewCard from "./pages/cards/view-card";
import HomePage from "./pages/root/home";
import PlanPage from "./pages/plans/plan";
import DonationCheckout from "./pages/donation/checkout";
import DonatorDashboard from "./pages/donation/dash";
import DonationBilling from "./pages/donation/billing";
import RecieptPage from "./pages/plans/reciept";
import Donation from "./pages/donation/donation";
import ResetPassword from "./pages/auth/reset-password";
import OrgRegister from "./pages/auth/org-resgister";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import UnBlockPage from "./pages/auth/unblock";
import ReportPage from "./pages/others/report";
import DisplayCard from "./pages/cards/display-card";
import OnBoarding from "./pages/auth/onboarding";
import ContactUs from "./pages/others/contact";
import DonationLogin from "./pages/donation/login";
import { io } from "socket.io-client";
import ReFundPolicyPage from "./pages/others/refund";
import PrivacyPolicyPage from "./pages/others/privacy";
import TermsAndConditions from "./pages/others/terms";
import Footer from "./components/rest/footer";

const App = () => {
    const location = useLocation();

    const noPaddingTopRoutes = ["/login", "/register", "/org/register"];
    const isWhiteSmokeRoute = ["/profile", "/billing", "/donation/billing", "/receipt", "/donation/dashboard"];

    const containerClass = noPaddingTopRoutes.includes(location.pathname)
        ? ""
        : "custom-padding";

    document.body.style.backgroundColor = isWhiteSmokeRoute.includes(location.pathname) ? "#f5f5f5" : "#ffffff";

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { donator, loading: lod2 } = useSelector(
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

    useEffect(() => {
        if (user) {
            const newSocket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
                query: {
                    userId: user._id,
                },
            });
    
            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    return (
        <div className={containerClass}>
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
                {!["/login", "/register", "/org/register"].includes(location.pathname) && (<Header />)}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/plans" element={<PlanPage />} />
                    <Route path="/d/:shortId" element={<DisplayCard />} />
                    <Route path="/onboarding" element={<OnBoarding />} />
                    <Route path="/donation/login" element={<DonationLogin />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/report" element={<ReportPage />} />
                    <Route path="/unblock" element={<UnBlockPage />} />

                    <Route path="/refund-policy" element={<ReFundPolicyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-conditions" element={<TermsAndConditions />} />

                    {/* Not logged In Route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/org/register" element={<OrgRegister />} />
                    <Route path="/reset" element={<ResetPassword />} />
                    <Route path="/donation" element={<Donation />} />
                    <Route path="/receipt" element={<RecieptPage />} />


                    <Route
                        element={lod2 ? (
                            <Loader />
                        ) : (
                            <ProtectedRoute isAuthenticated={!!donator} redirect="/donation/login" />
                        )}
                    >
                        <Route path="/donation/checkout" element={<DonationCheckout />} />
                        <Route path="/donation/dashboard" element={<DonatorDashboard />} />
                        <Route path="/donation/billing" element={<DonationBilling />} />
                    </Route>

                    <Route
                        element={loading ? (
                            <Loader />
                        ) : (
                            <ProtectedRoute isAuthenticated={!!user} redirect="/login" />
                        )}
                    >
                        <Route path="/request-custom" element={<RequestCustom />} />
                        <Route path="/view-custom" element={<ViewCustom />} />

                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/verify" element={<Verify />} />
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
                {!["/login", "/register", "/org/register"].includes(location.pathname) && (<Footer />)}
            </ErrorBoundary>
        </div>
    );
};

export default App;

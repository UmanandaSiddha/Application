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
const Confirm = lazy(() => import("./pages/root/confirm"));
const Subscription = lazy(() => import("./pages/root/subscription"));
const AdminPlan = lazy(() => import("./pages/admin-plan"));
const DonationPage = lazy(() => import ("./pages/root/donation"));
const BillingPage = lazy(() => import ("./pages/root/billing"));

const AllCards = lazy(() => import ("./pages/cards/all-cards"));
const ViewCard = lazy(() => import ("./pages/cards/view-card"));
const DisplayCard = lazy(() => import ("./pages/cards/display-card"));

const CreateTree = lazy(() => import("./pages/cards/inputs/tree"));
const CreatePersonal = lazy(() => import("./pages/cards/inputs/personal"));
const MedicalInput = lazy(() => import("./pages/cards/inputs/medical"));
const CreatorInput = lazy(() => import("./pages/cards/inputs/creator"));
const CreateAnimal = lazy(() => import("./pages/cards/inputs/animal"));

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserResponse } from "./types/api-types";
import axios from "axios";
import ErrorBoundary from "./components/rest/error-boundary";

const App = () => {

    let location = useLocation();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const dispatch = useDispatch();

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true });
            dispatch(userExist(data.user));
        } catch (error: any) {
            dispatch(userNotExist());
        }
    }

    useEffect(() => {
        gotUser();
    }, [location.pathname]);

    return (
        loading ? (
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
                <Header user={user} />
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<Home user={user} />} />
                            <Route path="/display" element={<DisplayCard />} />
                            <Route path="/donate" element={<DonationPage />} />
                        
                            {/* Not logged In Route */}
                            <Route
                                path="/login"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <Login />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <Register />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reset"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <ResetPassword />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Logged In User Routes */}
                            <Route
                                element={<ProtectedRoute isAuthenticated={user ? true : false} />}
                            >
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/plans" element={<Subscription />} />
                                <Route path="/verify" element={<Verify />} />
                                <Route path="/confirm" element={<Confirm />} />
                                <Route path="/admin-plan" element={<AdminPlan />} />
                                <Route path="/billing" element={<BillingPage />} />

                                <Route path="/dashboard/cards" element={<AllCards />} />
                                <Route path="/dashboard/cards/card" element={<ViewCard />} />

                                <Route path="/dashboard/tree/create" element={<CreateTree />} />
                                <Route path="/dashboard/personal/create" element={<CreatePersonal />} />
                                <Route path="/dashboard/medical/create" element={<MedicalInput />} /> 
                                <Route path="/dashboard/creator/create" element={<CreatorInput />} />
                                <Route path="/dashboard/animal/create" element={<CreateAnimal />} />

                                {/* <Route path="/pay" element={<Checkout />} /> */}
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </div>
        )
    )
}

export default App;
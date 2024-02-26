import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

import Header from "./components/rest/header";
import Loader from "./components/rest/loader";
import ProtectedRoute from "./components/rest/protected-route";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const NotFound = lazy(() => import("./pages/not-found"));
const Dashboard = lazy(() => import("./pages/dash"));
const Profile = lazy(() => import ("./pages/profile"));
const Plans = lazy(() => import ("./pages/plans"));
const Verify = lazy(() => import ("./pages/verify"));
const ResetPassword = lazy(() => import ("./pages/reset-password"));

const Tree = lazy(() => import ("./pages/tree/tree"));
const ViewTree = lazy(() => import ("./pages/tree/view-tree"));
const DisplayTree = lazy(() => import ("./pages/tree/display-tree"));
const CreateTree = lazy(() => import ("./pages/tree/create-tree"));

const Personal = lazy(() => import ("./pages/personal/personal"));
const InputVCard = lazy(() => import ("./pages/personal/input-vcard"));
const DisplayPersonal = lazy(() => import ("./pages/personal/display-personal"));
const ViewPersonal = lazy(() => import ("./pages/personal/view-personal"));

const Medical = lazy(() => import ("./pages/medical/medical"));
const MedicalInput = lazy(() => import ("./pages/medical/medical-input"));
const DisplayMedical = lazy(() => import ("./pages/medical/display-medical"));
const ViewMedical = lazy(() => import ("./pages/medical/view-medical"));

const Creator = lazy(() => import ("./pages/creator/creator"));
const CreatorInput = lazy(() => import ("./pages/creator/creator-input"));
const ViewCreator = lazy(() => import ("./pages/creator/view-creator"));
const DisplayCreator = lazy(() => import("./pages/creator/display-creator"));

const Animal = lazy(() => import ("./pages/animal/animal"));
const ViewAnimal = lazy(() => import ("./pages/animal/view-animal"));
const CreateAnimal = lazy(() => import ("./pages/animal/create-animal"));
const DisplayAnmial = lazy(() => import ("./pages/animal/display-animal"));

// const Checkout = lazy(() => import ("./pages/checkout"));

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserResponse } from "./types/api-types";
import axios from "axios";

const App = () => {

    let location = useLocation();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const dispatch = useDispatch();

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true } );
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
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/display/tree" element={<DisplayTree />} />
                    <Route path="/display/creator" element={<DisplayCreator />} />
                    <Route path="/display/personal" element={<DisplayPersonal />} />
                    <Route path="/display/medical" element={<DisplayMedical />} />
                    <Route path="/display/animal" element={<DisplayAnmial />} />
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
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/verify" element={<Verify />} />

                        <Route path="/dashboard/tree" element={<Tree />} />
                        <Route path="/dashboard/tree/view" element={<ViewTree />} />
                        <Route path="/dashboard/tree/create" element={<CreateTree />} />

                        <Route path="/dashboard/personal" element={<Personal />} />
                        <Route path="/dashboard/personal/view" element={<ViewPersonal />} />
                        <Route path="/dashboard/personal/input" element={<InputVCard />} />

                        <Route path="/dashboard/medical" element={<Medical />} />
                        <Route path="/dashboard/medical/view" element={<ViewMedical />} />
                        <Route path="/dashboard/medical/input" element={<MedicalInput />} />

                        <Route path="/dashboard/creator" element={<Creator />} />
                        <Route path="/dashboard/creator/view" element={<ViewCreator />} />
                        <Route path="/dashboard/creator/input" element={<CreatorInput />} />

                        <Route path="/dashboard/animal" element={<Animal />} />
                        <Route path="/dashboard/animal/view" element={<ViewAnimal />} />
                        <Route path="/dashboard/animal/create" element={<CreateAnimal />} />

                        {/* <Route path="/pay" element={<Checkout />} /> */}
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
        )
    )
}

export default App;
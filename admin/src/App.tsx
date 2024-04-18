import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { UserResponse } from "./types/api-types";
import axios from "axios";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";

import Header from "./components/header";
import Loader from "./components/loader";
import ProtectedRoute from "./components/protected-route";
import ErrorBoundary from "./components/error-boundary";

const NotFound = lazy(() => import("./pages/not-found"));
const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Plan = lazy(() => import ("./pages/plan"));

const App = () => {

    const dispatch = useDispatch();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true });
                dispatch(userExist(data.user));
            } catch (error: any) {
                dispatch(userNotExist());
            }
        }

        fetchUser();
    }, [user]);

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
                <ErrorBoundary>
                    <Header user={user} />
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            {/* Not logged In Route */}
                            <Route
                                path="/login"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <Login />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Logged In User Routes */}
                            <Route
                                element={<ProtectedRoute isAuthenticated={user?.role === "admin" ? true : false} />}
                            >
                                <Route path="/" element={<Home />} />
                                <Route path="/plan" element={<Plan />} />
                                <Route path="/dashboard" element={<Dashboard />} />
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
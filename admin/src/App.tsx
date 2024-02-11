import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import Header from "./components/rest/header";
import Loader from "./components/rest/loader";
import ProtectedRoute from "./components/rest/protected-route";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Pannel = lazy(() => import ("./pages/pannel"));

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import axios from "axios";
import { UserResponse } from "./types/api-types";

const App = () => {

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
    }, []);

    return (
        loading ? (
            <Loader />
        ) : (
            <BrowserRouter>
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
                        <Route path="/" element={<Home />} />
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
                            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
                        >
                            <Route path="/pannel" element={<Pannel />} />
                        </Route>
                    </Routes>


                </Suspense>
            </BrowserRouter>
        )
    )
}

export default App;
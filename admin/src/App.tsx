import { Route, Routes } from 'react-router-dom';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { Suspense, lazy, useEffect } from 'react';
import { UserResponse } from './types/api-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "./redux/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PageTitle from './components/PageTitle';
import Loader from './components/Loader';
import ErrorBoundary from './components/error-boundary';
import ProtectedRoute from './components/protected-route';
import ErrorPage from './pages/404/ErrorPage';

const SignIn = lazy(() => import("./pages/Authentication/SignIn"));
const ECommerce = lazy(() => import("./pages/Dashboard/ECommerce"));
const UserDetails = lazy(() => import("./pages/Users/UserDetails"));
const Cards = lazy(() => import("./pages/Cards/Cards"));
const CardDetails = lazy(() => import("./pages/Cards/CardDetails"));
const Plans = lazy(() => import("./pages/Plans/Plans"));
const PlanDetails = lazy(() => import("./pages/Plans/PlanDetails"));
const NewPlan = lazy(() => import("./pages/Plans/NewPlan"));
const Custom = lazy(() => import("./pages/CustomRequest/Customs"));
const CustomDetails = lazy(() => import("./pages/CustomRequest/CustomDetails"));

const Users = lazy(() => import("./pages/Users/Users"));
const Donators = lazy(() => import("./pages/Donators/Donators"));
const Subscriptions = lazy(() => import("./pages/Subscriptions/Subscriptions"));
const SubscriptionDetail = lazy(() => import("./pages/Subscriptions/SubscriptionDetail"));
const Transactions = lazy(() => import("./pages/Transactions/Transactions"));
const Contacts = lazy(() => import("./pages/Contacts/Contacts"));
const ContactDetails = lazy(() => import("./pages/Contacts/ContactDetails"));
const Logs = lazy(() => import("./pages/Logz/Logs"));
const DonatorDetails = lazy(() => import("./pages/Donators/DonatorDetails"));
const TransactionDetails = lazy(() => import("./pages/Transactions/TransactionDetails"));

const App = () => {

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
    }, []);

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
                    <Suspense fallback={<Loader />}>
                        <Routes>

                            <Route
                                path="/auth/signin"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true} redirect='/'>
                                        <>
                                            <PageTitle title="Signin | Voolata" />
                                            <SignIn />
                                        </>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                element={<ProtectedRoute isAuthenticated={user ? true : false} redirect='/auth/signin' />}
                            >
                                <Route
                                    index
                                    element={
                                        <>
                                            <PageTitle title="Admin Dashboard | Voolata" />
                                            <ECommerce />
                                        </>
                                    }
                                />
                                <Route
                                    path='/users'
                                    element={
                                        <>
                                            <PageTitle title="All Users | Voolata" />
                                            <Users />
                                        </>
                                    }
                                />
                                <Route
                                    path='/donators'
                                    element={
                                        <>
                                            <PageTitle title="All Donators | Voolata" />
                                            <Donators />
                                        </>
                                    }
                                />
                                <Route
                                    path='/donators/details'
                                    element={
                                        <>
                                            <PageTitle title="Donator Details | Voolata" />
                                            <DonatorDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/subscriptions'
                                    element={
                                        <>
                                            <PageTitle title="All Subscriptions | Voolata" />
                                            <Subscriptions />
                                        </>
                                    }
                                />
                                <Route
                                    path='/subscriptions/details'
                                    element={
                                        <>
                                            <PageTitle title="Subscription Details | Voolata" />
                                            <SubscriptionDetail />
                                        </>
                                    }
                                />
                                <Route
                                    path='/transactions'
                                    element={
                                        <>
                                            <PageTitle title="All Transactions | Voolata" />
                                            <Transactions />
                                        </>
                                    }
                                />
                                <Route
                                    path='/transactions/details'
                                    element={
                                        <>
                                            <PageTitle title="Transaction Details | Voolata" />
                                            <TransactionDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/contacts'
                                    element={
                                        <>
                                            <PageTitle title="All Contacts | Voolata" />
                                            <Contacts />
                                        </>
                                    }
                                />
                                <Route
                                    path='/contacts/details'
                                    element={
                                        <>
                                            <PageTitle title="Contact Details | Voolata" />
                                            <ContactDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/logs'
                                    element={
                                        <>
                                            <PageTitle title="All Logs | Voolata" />
                                            <Logs />
                                        </>
                                    }
                                />
                                <Route
                                    path='/users/details'
                                    element={
                                        <>
                                            <PageTitle title="User Details | Voolata" />
                                            <UserDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/cards'
                                    element={
                                        <>
                                            <PageTitle title="All Cards | Voolata" />
                                            <Cards />
                                        </>
                                    }
                                />
                                <Route
                                    path='/cards/details'
                                    element={
                                        <>
                                            <PageTitle title="Card Details | Voolata" />
                                            <CardDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/plans'
                                    element={
                                        <>
                                            <PageTitle title="All Plans | Voolata" />
                                            <Plans />
                                        </>
                                    }
                                />
                                <Route
                                    path='/plans/details'
                                    element={
                                        <>
                                            <PageTitle title="Plan Details | Voolata" />
                                            <PlanDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='/plans/new'
                                    element={
                                        <>
                                            <PageTitle title="Create Plan | Voolata" />
                                            <NewPlan />
                                        </>
                                    }
                                />
                                <Route
                                    path='/requests'
                                    element={
                                        <>
                                            <PageTitle title="Create Plan | Voolata" />
                                            <Custom />
                                        </>
                                    }
                                />
                                <Route
                                    path='/requests/details'
                                    element={
                                        <>
                                            <PageTitle title="Create Plan | Voolata" />
                                            <CustomDetails />
                                        </>
                                    }
                                />
                                <Route
                                    path='*'
                                    element={
                                        <>
                                            <PageTitle title="404 | Voolata" />
                                            <ErrorPage />
                                        </>
                                    }
                                />
                            </Route>
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </div>
        )
    )
}

export default App;
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

const SignIn = lazy(() => import ("./pages/Authentication/SignIn"));
const Profile = lazy(() => import ("./pages/Profile"));
const ECommerce = lazy(() => import ("./pages/Dashboard/ECommerce"));
const Tables = lazy(() => import ("./pages/Tables"));
const AllUsers = lazy(() => import ("./pages/Users/Users"));
const UserDetails = lazy(() => import ("./pages/Users/UserDetails"));

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
                      <PageTitle title="Signin | VCards App" />
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
                      <PageTitle title="Admin Dashboard | VCards App" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path='/all-users'
                  element={
                    <>
                      <PageTitle title="All Users | VCards App" />
                      <AllUsers />
                    </>
                  }
                />
                <Route
                  path='/user-details'
                  element={
                    <>
                      <PageTitle title="User Details | VCards App" />
                      <UserDetails />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <PageTitle title="Profile | VCards App" />
                      <Profile />
                    </>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <>
                      <PageTitle title="Tables | VCards App" />
                      <Tables />
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
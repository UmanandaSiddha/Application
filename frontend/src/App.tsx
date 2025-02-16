import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/root/error-boundary";
import Header from "./components/root/header";
import { useMediaQuery } from "react-responsive";
import HomePage from "./pages/root/home";
import Footer from "./components/root/footer";
import Login from "./pages/auth/login";
import { donatorExist, donatorNotExist } from "./store/reducer/donatorReducer";
import { useEffect } from "react";
import { userExist, userNotExist } from "./store/reducer/userReducer";
import { RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import API from "./config/apiConfig";
import { IDonator, IUser } from "./types/type";

interface UserResponse {
    success: boolean;
    user: IUser;
};

interface DonatorResponse {
    success: boolean;
    donator: IDonator;
}

const App = () => {
	const location = useLocation();
    const isDesktop = useMediaQuery({ maxWidth: 1024 });

    const weirdHeader = location.pathname.startsWith("/dashboard/cards/card/") && !(location.pathname.startsWith("/dashboard/cards/card/medical") && !isDesktop);

    // const noPaddingTopRoutes = ["/login", "/register", "/org/register"];
    const noPaddingTopRoutes = ["/login", "/register", "/org/register", "/contact", "/", "/about-us", "/plans"];
    const isWhiteSmokeRoute = ["/profile", "/billing", "/donation/billing", "/receipt", "/donation/dashboard"];

    const containerClass = noPaddingTopRoutes.includes(location.pathname) || weirdHeader
        ? ""
        : "custom-padding";


    document.body.style.backgroundColor = isWhiteSmokeRoute.includes(location.pathname) || location.pathname.startsWith("/dashboard/cards/card/medical") ? "#f5f5f5" : "#ffffff";

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    // const { donator, loading: lod2 } = useSelector(
    //     (state: RootState) => state.donatorReducer
    // );

    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const { data }: { data: UserResponse } = await API.get(`/user/me`);
            dispatch(userExist(data.user));
        } catch (error: any) {
            dispatch(userNotExist());
        }
    };

    // const fetchDonator = async () => {
    //     try {
    //         const { data }: { data: DonatorResponse } = await API.get(`/donate/me`);
    //         dispatch(donatorExist(data.donator));
    //     } catch (error: any) {
    //         dispatch(donatorNotExist());
    //     }
    // };

    useEffect(() => {
        fetchUser();
        // fetchDonator();
    }, []);

	return (
		<div className={containerClass}>
			<ToastContainer
				position="top-right"
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
				{!(["/login", "/register", "/org/register"].includes(location.pathname) || weirdHeader) && <Header />}
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/about-us" element={<HomePage />} />

					<Route path="/login" element={user === null ? <Login /> : <Navigate to={user?.account.isVerified ? "/profile" : "/verify"} />} />
                    {/* <Route path="/register" element={<Register />} />
                    <Route path="/org/register" element={<OrgRegister />} />
                    <Route path="/reset/:token/:user" element={<ResetPassword />} />
                    <Route path="/donation" element={<Donation />} />
                    <Route path="/receipt/:type/:id" element={<RecieptPage />} /> */}

				</Routes>
				{["/", "/about-us"].includes(location.pathname) && (<Footer />)}
			</ErrorBoundary>
		</div>
	)
}

export default App;
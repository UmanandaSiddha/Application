import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { getGoogleAuthUrl } from "../../lib/google";
import { Loader2 } from "lucide-react";
import ForgotPasswordModal from "../../components/auth/forget-password-modal";
import TextInput from "../../components/auth/text-input";
import { useLogin } from "../../hook/useLogin";

const Login = () => {
    const location = useLocation();
    const { login, forgotPassword, loading } = useLogin();
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    return (
        <div className="flex justify-center h-screen bg-white dark:bg-gray-900">
            <div className="hidden lg:block w-1/2 bg-cover bg-gray-900 bg-opacity-40" style={{ backgroundImage: "url(/login-bg.jpg)" }}>
                <div className="flex items-center h-full px-16">
                    <img src="/voolata_long_w_r.png" className="w-36 pb-5" alt="Logo" />
                    <p className="text-gray-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                </div>
            </div>

            <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} onSubmit={forgotPassword} loading={loading} />

            <div className="flex flex-col justify-center w-full max-w-md px-6 lg:w-1/2">
                <img src="/voolata_long_r.png" className="w-36 mx-auto pb-5" alt="Logo" />

                <form onSubmit={(e) => { e.preventDefault(); login(userData.email, userData.password, from); }}>
                    <TextInput
                        label="Email Address"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        isPassword={true}
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />

                    <button type="submit" className="w-full mt-4 px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-500">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
                    </button>
                </form>

                <p className="text-center mt-4">or sign in with <a href={getGoogleAuthUrl()} className="text-purple-500">Google</a></p>
                <p className="text-center mt-2">Don't have an account? <Link to="/onboarding" className="text-purple-500">Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;
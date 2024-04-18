import { ReactElement } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

interface Props {
    children?: ReactElement;
    isAuthenticated: boolean;
}

const ProtectedRoute = ({
    isAuthenticated,
    children,
}: Props) => {

    let location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
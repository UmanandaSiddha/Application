import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

interface Props {
    children?: ReactElement;
    isAuthenticated: boolean;
}

const ProtectedRoute = ({
    isAuthenticated,
    children,
}: Props) => {

    if (!isAuthenticated) return window.location.href = '/';

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
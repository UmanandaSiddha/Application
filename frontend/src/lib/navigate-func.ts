import { useLocation, useNavigate } from "react-router-dom";

export const navigateFunc = (redirect: string) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === redirect) {
        return;
    } 

    return navigate(redirect);
}
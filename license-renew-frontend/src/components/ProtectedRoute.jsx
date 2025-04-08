import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated ? <Outlet /> : <Navigate to="/sign_in" />;
};

export default ProtectedRoute;

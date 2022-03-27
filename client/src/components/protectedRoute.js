import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const useAuth = () => {
	const user = { loggedIn: false };
	if (localStorage.getItem("token")) {
		user.loggedIn = true;
	}
	return user && user.loggedIn;
};

const ProtectedRoute = () => {
	const location = useLocation();
	const isAuth = useAuth();
	return isAuth ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;

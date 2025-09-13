import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../../constant/APP_ROUTES";
import { useAppDispatch, useAppSelector } from "../../hooks";
import React from "react";
import { useGetMeQuery } from "../../redux/features/authApi";
import { loginSuccess, logoutSuccess } from "../../redux/features/authSlice";

const PublicRouteWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((s) => s.auth);
  const { data, error, isLoading } = useGetMeQuery({});

  // Keep Redux in sync with backend
  React.useEffect(() => {
    if (data?.success && data.data) {
      dispatch(
        loginSuccess({
          id: data.data._id,
          email: data.data.email,
          role: data.data.role,
          isLoggedIn: true,
          token: localStorage.getItem("token") || undefined, // only if storing JWT in localStorage
        })
      );
    } else if (error) {
      dispatch(logoutSuccess());
      localStorage.removeItem("token");
    }
  }, [data, error, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // spinner or skeleton
  }

  // If logged in, block public routes
  if (isLoggedIn) {
    return <Navigate to={APP_ROUTES.APP.HOME} replace />;
  }

  // Otherwise show public pages (sign in, sign up, etc.)
  return <Outlet />;
};

export default PublicRouteWrapper;

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { APP_ROUTES } from "../../constant/APP_ROUTES";
import { useGetMeQuery } from "../../redux/features/authApi";
import { loginSuccess, logoutSuccess } from "../../redux/features/authSlice";

const PrivateRouteWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedIn, userData } = useAppSelector((s) => s.auth);

  const { data, error, isLoading } = useGetMeQuery({});

  // 🔹 Sync Redux with backend /auth/me
  useEffect(() => {
    if (data?.success && data.data) {
      console.log(data.data)
      dispatch(
        loginSuccess({
          id: data.data._id, // or data.data.id if mapped in backend
          email: data.data.email,
          name: data.data?.name,
          role: data.data.role,
          isLoggedIn: true,
          token: localStorage.getItem("token") || undefined,
        })
      );
    } else if (error) {
      dispatch(logoutSuccess());
      localStorage.removeItem("token");
    }
  }, [data, error, dispatch]);

  // 🔹 Role-based redirect (runs only when logged in)
  useEffect(() => {
    if (isLoggedIn) {
      if (userData?.role === "TRAINER") {
        navigate("/dashboard/trainer", { replace: true });
      } else if (userData?.role === "ADMIN") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/upcoming", { replace: true });

      }
    }
  }, [isLoggedIn, userData, navigate]);

  // 🔹 Now handle returns safely AFTER hooks
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTES.AUTH.SIGN_IN} replace />;
  }

  return <Outlet />;
};

export default PrivateRouteWrapper;

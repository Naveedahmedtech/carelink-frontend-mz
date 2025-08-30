// src/routes/PrivateRouteWrapper.tsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { APP_ROUTES } from "../../constant/APP_ROUTES";

const PrivateRouteWrapper = () => {
  const { isLoggedIn, userData } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (userData?.role === "trainer") {
        navigate("/dashboard/trainer", { replace: true });
      } else {
        navigate("/dashboard/upcoming", { replace: true });
      }
    }
  }, [isLoggedIn, userData, navigate]);

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTES.AUTH.SIGN_IN} replace />;
  }

  return <Outlet />;
};

export default PrivateRouteWrapper;

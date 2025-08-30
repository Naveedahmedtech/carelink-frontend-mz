// src/routes/PublicRouteWrapper.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { APP_ROUTES } from "../../constant/APP_ROUTES";

const PublicRouteWrapper = () => {
  const { isLoggedIn } = useAppSelector((s) => s.auth);

  // If logged in, prevent access to public pages (redirect to dashboard/home)
  if (isLoggedIn) {
    return <Navigate to={APP_ROUTES.APP.HOME} replace />;
  }

  // Otherwise show the public page (e.g. Sign In, Sign Up)
  return <Outlet />;
};

export default PublicRouteWrapper;

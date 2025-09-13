import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { useGetMeQuery } from "../../redux/features/authApi";
import { loginSuccess, logoutSuccess } from "../../redux/features/authSlice";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, error } = useGetMeQuery({});

  useEffect(() => {
    if (data?.success && data.data) {
      dispatch(
        loginSuccess({
          id: data.data._id,
          email: data.data.email,
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

  return <>{children}</>;
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const authApi = createApi({
  reducerPath: REDUCER_PATHS.AUTH_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // 🔹 allows cookies if we store token in cookie
    // prepareHeaders: (headers) => {
    //   // If storing JWT in localStorage, attach it here:
    //   const token = localStorage.getItem("token");
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ["Auth"], // 🔹 define tags for cache control
  endpoints: (builder) => ({
    setPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/set-password",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"], // 🔹 clears cached /me on login
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"], // 🔹 mark /me response with tag
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"], // 🔹 clears cached /me on logout
    }),
  }),
});

export const {
  useSetPasswordMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
} = authApi;

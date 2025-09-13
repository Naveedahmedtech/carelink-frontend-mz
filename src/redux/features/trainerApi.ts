// src/redux/services/trainerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

export const trainerApi = createApi({
  reducerPath: REDUCER_PATHS.TRAINER_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Trainer"],
  endpoints: (builder) => ({
    // Step 1–4: onboarding (create + update)
    upsertTrainer: builder.mutation({
      query: (body: any) => {
        const formData = new FormData();

        Object.entries(body).forEach(([key, value]) => {
          if (key === "documents" && value && typeof value === "object") {
            Object.entries(value).forEach(([docKey, docValue]) => {
              if (
                docValue &&
                typeof docValue === "object" &&
                "file" in docValue
              ) {
                const file = (docValue as any).file;
                if (file instanceof File) {
                  formData.append(docKey, file);
                }
                if ((docValue as any).expiry) {
                  formData.append(`${docKey}Expiry`, (docValue as any).expiry);
                }
              }
            });
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(`${key}[]`, v));
          } else if (value && typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });

        return {
          url: "/trainer/onboarding",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Trainer"],
    }),

    // Get current trainer profile
    getTrainerProfile: builder.query({
      query: () => "/trainers/me",
      providesTags: ["Trainer"],
    }),

    // Get all trainers (paginated + search + filters)
    getAllTrainers: builder.query<
      any, // you can replace `any` with a proper type
      {
        page?: number;
        limit?: number;
        q?: string;
        email?: string;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 10, q, email, status }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (q) params.append("q", q);
        if (email) params.append("email", email);
        if (status) params.append("status", status);

        return `/trainer?${params.toString()}`;
      },
      providesTags: ["Trainer"],
    }),

    updateTrainerStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/trainer/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Trainer"],
    }),
  }),
});

export const {
  useUpsertTrainerMutation,
  useGetTrainerProfileQuery,
  useGetAllTrainersQuery,
  useUpdateTrainerStatusMutation,
} = trainerApi;

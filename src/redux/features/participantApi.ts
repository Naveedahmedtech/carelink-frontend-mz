import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";
import { AnyCnameRecord } from "node:dns";

export const participantApi = createApi({
  reducerPath: REDUCER_PATHS.PARTICIPANT_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Participant"],
  endpoints: (builder) => ({
    // Step 1–2: onboarding (create + update)
    upsertParticipant: builder.mutation({
      query: (body: any) => ({
        url: "/participant/onboarding",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Participant"],
    }),

    // Get participant profile (current logged-in participant)
    getParticipantProfile: builder.query({
      query: () => "/participants/me",
      providesTags: ["Participant"],
    }),

    getParticipants: builder.query<any, any | void>({
      query: (params) => ({
        url: "/participant",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          q: params?.q,
          email: params?.email,
          status: params?.status,
        },
      }),
    }),
  }),
});

export const { useUpsertParticipantMutation, useGetParticipantProfileQuery, useGetParticipantsQuery } =
  participantApi;

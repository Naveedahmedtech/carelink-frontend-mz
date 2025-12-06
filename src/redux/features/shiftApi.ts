// src/redux/apis/shiftApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant/BASE_URL";
import { REDUCER_PATHS } from "../../constant/REDUCER_PATH";

/* =========================
   Types (shifts - existing)
   ========================= */
export type ShiftStatus = "PENDING" | "APPROVED" | "DECLINED";
export interface ShiftRequest {
  _id: string;
  participantId: string;
  trainerId?: string | null;
  date: string;            // ISO date
  timeFrom: string;        // e.g. "09:00"
  timeTo: string;          // e.g. "11:00"
  status: ShiftStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/* =========================
   Types (timesheets - new)
   ========================= */
export type TimesheetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PAID" | "REOPENED";

export interface TimesheetItem {
  shiftId: string;
  participantId: string;
  date: string;       // ISO
  service: string;
  hours: number;      // billable hours
  km?: number;
  amountCents: number;
  mileageCents?: number;
  totalCents: number;
}

export interface Timesheet {
  _id: string;
  trainerId: string;
  weekStart: string;  // ISO Monday 00:00 UTC
  weekEnd: string;    // ISO Sunday 23:59:59.999 UTC
  status: TimesheetStatus;
  items: TimesheetItem[];
  totals: {
    hours: number;
    km: number;
    amountCents: number;
    mileageCents: number;
    totalCents: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   API
   ========================= */
export const shiftApi = createApi({
  reducerPath: REDUCER_PATHS.SHIFT_API,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    // If you switch to JWT in headers later, just re-enable:
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem("token");
    //   if (token) headers.set("Authorization", `Bearer ${token}`);
    //   return headers;
    // },
  }),
tagTypes: ["ShiftRequests", "Timesheets", "Dashboard"],
  endpoints: (builder) => ({

    /* =========================
       Shifts (existing)
       ========================= */

    // 🧍 Participant: Request a new shift
    requestShift: builder.mutation<{ message: string; request: ShiftRequest }, Partial<ShiftRequest>>({
      query: (body) => ({
        url: "/shifts/request",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ShiftRequests", id: "LIST" },
        { type: "ShiftRequests", id: "MINE" },
        { type: "ShiftRequests", id: "PARTICIPANT_MINE" },
      ],
    }),

    // 🧍 Trainer: Clock in shift
    clockInShift: builder.mutation<{ message: string; request: ShiftRequest }, Partial<ShiftRequest>>({
      query: (body) => ({
        url: "/shifts/trainer/clock-in",
        method: "POST",
        body,
      }),
  invalidatesTags: [
    { type: "ShiftRequests", id: "LIST" },
    { type: "ShiftRequests", id: "MINE" },
    { type: "ShiftRequests", id: "PARTICIPANT_MINE" },

    // 🔁 Past shifts list
    { type: "ShiftRequests", id: "PAST" },

    // 🔁 Dashboards (trainer + admin)
    { type: "Dashboard", id: "TRAINER_SUMMARY" },
    { type: "Dashboard", id: "ADMIN_SUMMARY" },
  ],
    }),

    // 🧍 Trainer: Clock out shift (now also invalidates Timesheets)
    clockOutShift: builder.mutation<{ message?: string; request?: ShiftRequest; shift?: any; timesheet?: Timesheet }, Partial<ShiftRequest> & { report?: any }>({
      query: (body) => ({
        url: "/shifts/trainer/clock-out",
        method: "POST",
        body,
      }),
invalidatesTags: [
    { type: "ShiftRequests", id: "LIST" },
    { type: "ShiftRequests", id: "MINE" },
    { type: "ShiftRequests", id: "PARTICIPANT_MINE" },

    // ⬇ you already had this; keep it
    { type: "Timesheets", id: "LIST" },

    // 🔁 Past shifts list
    { type: "ShiftRequests", id: "PAST" },

    // 🔁 Dashboards (trainer + admin)
    { type: "Dashboard", id: "TRAINER_SUMMARY" },
    { type: "Dashboard", id: "ADMIN_SUMMARY" },
  ],
    }),

    // 👨‍💼 Admin: Fetch all shift requests
    getShiftRequests: builder.query<Paginated<ShiftRequest>, {
      page?: number;
      limit?: number;
      status?: ShiftStatus | "all";
      q?: string;
      dateFrom?: string;
      dateTo?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: "/shifts/admin/list",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "ShiftRequests", id: "LIST" }],
    }),

    // 👨‍💼 Admin: Approve + assign to trainer
    approveShiftRequest: builder.mutation<{ message: string }, { requestId: string; trainerId: string }>({
      query: (body) => ({
        url: "/shifts/admin/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ShiftRequests", id: "LIST" },
        { type: "ShiftRequests", id: "MINE" },
        { type: "ShiftRequests", id: "TRAINER_MINE" },
        { type: "ShiftRequests", id: "PARTICIPANT_MINE" },
      ],
    }),

    // 👨‍💼 Admin: Decline
    declineShiftRequest: builder.mutation<{ message: string }, { requestId: string; reason?: string }>({
      query: (body) => ({
        url: "/shifts/admin/decline",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ShiftRequests", id: "LIST" },
        { type: "ShiftRequests", id: "MINE" },
        { type: "ShiftRequests", id: "PARTICIPANT_MINE" },
      ],
    }),

    // 🧍 Participant: My shift requests
    getParticipantShiftRequests: builder.query<Paginated<ShiftRequest>, {
      page?: number;
      limit?: number;
      status?: ShiftStatus | "all";
      q?: string;
      dateFrom?: string;
      dateTo?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: "/shifts/participant/mine",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "ShiftRequests", id: "PARTICIPANT_MINE" }],
    }),

    // 🧑‍🏫 Trainer: My assigned shifts/requests
    getTrainerShiftRequests: builder.query<Paginated<ShiftRequest>, {
      page?: number;
      limit?: number;
      status?: ShiftStatus | "all";
      q?: string;
      dateFrom?: string;
      dateTo?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: "/shifts/trainer/mine",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "ShiftRequests", id: "TRAINER_MINE" }],
    }),

    // 👤 Auth user: My shifts (generic)
    getMyShiftRequests: builder.query<Paginated<ShiftRequest>, {
      page?: number;
      limit?: number;
      status?: ShiftStatus | "all";
      q?: string;
      dateFrom?: string;
      dateTo?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: "/shifts/mine",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "ShiftRequests", id: "MINE" }],
    }),

    /* =========================
       Timesheets (new)
       Base path: /shifts/timesheets...
       ========================= */

    // List (trainer: own; admin: can filter by trainerId)
    listTimesheets: builder.query<
      { data: Timesheet[]; pagination?: any },
      { status?: TimesheetStatus; weekStart?: string; page?: number; pageSize?: number; trainerId?: string } | void
    >({
      query: (params) => ({
        url: "/shifts/timesheets",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Timesheets", id: "LIST" }],
    }),

    // Get by id
    getTimesheetById: builder.query<{ success: true; data: Timesheet }, string>({
      query: (id) => `/shifts/timesheets`,
      providesTags: (_r, _e, id) => [{ type: "Timesheets", id }],
    }),

    // Submit (trainer)
    submitTimesheet: builder.mutation<{ success: true; data: Timesheet }, string>({
      query: (id) => ({
        url: `/shifts/timesheets/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Timesheets", id }, { type: "Timesheets", id: "LIST" }],
    }),

    // Approve (admin)
    approveTimesheet: builder.mutation<{ success: true; data: Timesheet }, string>({
      query: (id) => ({
        url: `/shifts/timesheets/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Timesheets", id }, { type: "Timesheets", id: "LIST" }],
    }),

    // Reopen (admin)
    reopenTimesheet: builder.mutation<{ success: true; data: Timesheet }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/shifts/timesheets/${id}/reopen`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Timesheets", id }, { type: "Timesheets", id: "LIST" }],
    }),

    // Export CSV/PDF (returns Blob)
    exportTimesheet: builder.query<Blob, { id: string; format: "csv" | "pdf" }>({
      query: ({ id, format }) => ({
        url: `/shifts/timesheets/${id}/export`,
        method: "GET",
        params: { format },
        // @ts-expect-error RTKQ custom response handler
        responseHandler: (response: Response) => response.blob(),
      }),
      // no tags; consumers can refetch if needed
    }),
    // --- Endpoints (add inside endpoints: (builder) => ({ ... })) ---
getPastShifts: builder.query<
  PastShiftsResponse,
  {
    page?: number;
    pageSize?: number;
    dateFrom?: string;
    dateTo?: string;
    trainerId?: string;      // ADMIN only filter (Trainer._id or User._id)
    participantId?: string;  // ADMIN only filter (Participant._id or User._id)
  } | void
>({
  query: (params) => ({
    url: "/shifts/past",
    method: "GET",
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      dateFrom: params?.dateFrom,
      dateTo: params?.dateTo,
      trainerId: params?.trainerId,
      participantId: params?.participantId,
    },
  }),
  // Add tags if you want cache linkage; leaving uncached is fine:
  providesTags: [{ type: "ShiftRequests", id: "PAST" }],
}),

// 🔹 Trainer dashboard summary
getTrainerDashboardSummary: builder.query<
  { success: true; data: any; message?: string },
  { trainerId?: string } | void
>({
  query: (params) => ({
    url: "/shifts/dashboard",
    method: "GET",
    params: params ?? {},
  }),
  providesTags: [{ type: "Dashboard", id: "TRAINER_SUMMARY" }],
}),
// endpoint (inside endpoints: (builder) => ({ ... }))
getAdminDashboardSummary: builder.query<{ success: true; data: any; message?: string }, { dateFrom?: string; dateTo?: string } | void>({
  query: (params) => ({
    url: "/shifts/admin/dashboard",
    method: "GET",
    params: params ?? {},
  }),
  providesTags: [{ type: "Dashboard", id: "ADMIN_SUMMARY" }],
}),

  }),
});

export const {
  // Participant
  useRequestShiftMutation,
  useGetParticipantShiftRequestsQuery,

  // Trainer
  useGetTrainerShiftRequestsQuery,

  // Generic "mine"
  useGetMyShiftRequestsQuery,

  // Admin
  useGetShiftRequestsQuery,
  useApproveShiftRequestMutation,
  useDeclineShiftRequestMutation,

  // Trainer actions
  useClockInShiftMutation,
  useClockOutShiftMutation,

  // Timesheets
  useListTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useSubmitTimesheetMutation,
  useApproveTimesheetMutation,
  useReopenTimesheetMutation,
  useExportTimesheetQuery,
  useLazyExportTimesheetQuery,
  useGetPastShiftsQuery,
  useGetTrainerDashboardSummaryQuery,
  useGetAdminDashboardSummaryQuery,
} = shiftApi;

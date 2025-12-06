// src/utils.ts

import { Note } from "../components/support-notes/NoteCard";

export type ShiftStatus =
  | "Pending"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type Shift = {
  id: string;
  title: string;
  date: string;    // YYYY-MM-DD
  time: string;    // e.g. "10:00 AM – 1:00 PM"
  duration: string;
  worker?: string; // Trainer
  participant?: string; // NEW — Participant
  status: ShiftStatus;
  notes?: string;
};

// mock data store (for demo, later replaced with API)
export const mockShifts: Shift[] = [
  // --- Previous Shifts ---
  {
    id: "101",
    title: "Community Outing",
    date: "2025-07-15",
    time: "9:00 AM – 12:00 PM",
    duration: "3h",
    worker: "Michael Brown",
    participant: "Alice Johnson",
    status: "Pending",
    notes: "Attended local community event",
  },
  {
    id: "102",
    title: "Physiotherapy Session",
    date: "2025-07-18",
    time: "2:00 PM – 3:30 PM",
    duration: "1.5h",
    worker: "John Doe",
    participant: "Bob Williams",
    status: "In Progress",
    notes: "Stretching and mobility exercises",
  },
  {
    id: "103",
    title: "Morning Shift",
    date: "2025-07-20",
    time: "8:00 AM – 11:00 AM",
    duration: "3h",
    worker: "Sarah Lee",
    participant: "Charlie Kim",
    status: "Cancelled",
    notes: "Cancelled by participant due to illness",
  },
  {
    id: "104",
    title: "Cooking Assistance",
    date: "2025-07-22",
    time: "5:00 PM – 7:00 PM",
    duration: "2h",
    worker: "Emily Clark",
    participant: "Diana Smith",
    status: "Completed",
    notes: "Prepared dinner and meal planning",
  },

  // --- Upcoming / Current Shifts ---
  {
    id: "1",
    title: "Morning Shift",
    date: "2025-08-26",
    time: "10:00 AM – 1:00 PM",
    duration: "3h",
    worker: "John Doe",
    participant: "Ethan Brown",
    status: "Completed", // already past
    notes: "General support session",
  },
  {
    id: "2",
    title: "Afternoon Shift",
    date: "2025-08-28",
    time: "2:00 PM – 5:00 PM",
    duration: "3h",
    worker: "Sarah Lee",
    participant: "Fiona Davis",
    status: "Completed", // already past
    notes: "Requested by participant",
  },
  {
    id: "6",
    title: "Weekend Support",
    date: "2025-08-30",
    time: "9:00 AM – 3:00 PM",
    duration: "6h",
    worker: "Michael Brown",
    participant: "George Miller",
    status: "In Progress", // today’s shift
    notes: "Assisting with weekend activities",
  },
  {
    id: "3",
    title: "Community Activity",
    date: "2025-09-05",
    time: "1:00 PM – 4:00 PM",
    duration: "3h",
    worker: "Michael Brown",
    participant: "Hannah Wilson",
    status: "Approved",
    notes: "Visit to local community center",
  },
  {
    id: "4",
    title: "Shopping Assistance",
    date: "2025-09-10",
    time: "10:00 AM – 12:00 PM",
    duration: "2h",
    worker: "Emily Clark",
    participant: "Ian Thompson",
    status: "Pending",
    notes: "Weekly grocery shopping trip",
  },
  {
    id: "5",
    title: "Evening Shift",
    date: "2025-09-15",
    time: "6:00 PM – 9:00 PM",
    duration: "3h",
    worker: "John Doe",
    participant: "Julia Roberts",
    status: "Approved",
    notes: "Dinner prep and evening routine support",
  },
];

// central helper to map status → style

export const getStatusStyle = (status: ShiftStatus) => {
  switch (status) {
    case "approved":
    case "completed":
      return {
        bg: "linear-gradient(135deg, var(--color-success), #27ae60)",
        chip: "var(--color-success)",
      };
    case "pending":
      return {
        bg: "linear-gradient(135deg, var(--color-pending), #f39c12)",
        chip: "var(--color-pending)",
      };
    case "in progress":
      return {
        bg: "linear-gradient(135deg, #2980b9, #3498db)", // Blue
        chip: "#2980b9",
      };
    case "cancelled":
      return {
        bg: "linear-gradient(135deg, var(--color-error), #c0392b)",
        chip: "var(--color-error)",
      };
    default:
      return { bg: "var(--color-border)", chip: "var(--color-border)" };
  }
};

// Mock notes (replace with API)
export const notes: Note[] = [
  {
    id: "1",
    date: "2025-08-20",
    time: "10:00 AM – 12:00 PM",
    trainer: "Sarah Lee",
    activities: "Cooking class – prepared pasta and salad",
    progress: "Improved independence in using kitchen tools safely",
    incidents: "No incidents reported",
  },
  {
    id: "2",
    date: "2025-08-18",
    time: "2:00 PM – 4:00 PM",
    trainer: "Michael Brown",
    activities: "Fitness session – treadmill, light cardio, and stretching",
    progress: "Participant increased treadmill time by 10 minutes",
    incidents: "Mild fatigue, resolved with short rest",
  },
  {
    id: "3",
    date: "2025-08-15",
    time: "1:00 PM – 3:00 PM",
    trainer: "Anna Wilson",
    activities: "Community outing – visited the library and local park",
    progress: "Engaged well with public staff, improved social interaction",
    incidents: "None",
  },
  {
    id: "4",
    date: "2025-08-12",
    time: "9:00 AM – 11:00 AM",
    trainer: "James Carter",
    activities: "Arts & Crafts – painting and clay modeling",
    progress: "Showed creativity and fine motor improvement",
    incidents: "Minor paint spill, quickly cleaned up",
  },
  {
    id: "5",
    date: "2025-08-10",
    time: "3:00 PM – 5:00 PM",
    trainer: "Sarah Lee",
    activities: "Cooking session – baking muffins",
    progress: "Able to follow recipe steps with minimal support",
    incidents: "No incidents reported",
  },
  {
    id: "6",
    date: "2025-08-08",
    time: "11:00 AM – 1:00 PM",
    trainer: "Michael Brown",
    activities: "Personal training – light weights and balance exercises",
    progress: "Improved posture and maintained balance during exercises",
    incidents: "None",
  },
];


import { format, startOfWeek, endOfWeek } from "date-fns";

export interface ShiftEntry {
  id: string;
  trainerId: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  kilometres: number;
}

export interface Timesheet {
  trainerId: string;
  weekStart: string;
  weekEnd: string;
  entries: ShiftEntry[];
  totalHours: number;
  totalKilometres: number;
}

export const getMockTimesheet = (trainerId: string): Timesheet => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const entries: ShiftEntry[] = [
    {
      id: "1",
      trainerId,
      clientId: "Client A",
      date: format(weekStart, "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "12:00",
      hours: 3,
      kilometres: 12,
    },
    {
      id: "2",
      trainerId,
      clientId: "Client B",
      date: format(weekEnd, "yyyy-MM-dd"),
      startTime: "13:00",
      endTime: "16:00",
      hours: 3,
      kilometres: 8,
    },
  ];

  return {
    trainerId,
    weekStart: format(weekStart, "yyyy-MM-dd"),
    weekEnd: format(weekEnd, "yyyy-MM-dd"),
    entries,
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    totalKilometres: entries.reduce((sum, e) => sum + e.kilometres, 0),
  };
};

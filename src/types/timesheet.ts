// src/types/timesheet.ts
export interface ShiftEntry {
  id: string;
  trainerId: string;
  clientId: string;
  date: string;           // ISO date
  startTime: string;      // "09:00"
  endTime: string;        // "13:00"
  hours: number;
  kilometres: number;
  notes?: string;
}

export interface Timesheet {
  trainerId: string;
  weekStart: string;      // ISO date for Monday
  weekEnd: string;        // ISO date for Sunday
  entries: ShiftEntry[];
  totalHours: number;
  totalKilometres: number;
}

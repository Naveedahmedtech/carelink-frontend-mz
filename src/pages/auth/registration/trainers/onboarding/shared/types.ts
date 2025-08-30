// -----------------------------------------------
// src/pages/trainers/onboarding/shared/types.ts
export type DaySlot = { start: string; end: string };
export type Availability = Record<string, DaySlot[]>; // e.g., Mon: [{start: "09:00", end: "12:00"}]

export type TrainerRegistrationValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  availability: Availability;
  travelAreas: string[];
  specialisations: string[];
  documents: Record<string, { file?: File | null }>;
};

export type TrainerRegistrationErrors = Partial<{
  fullName: string;
  email: string;
  phone: string;
  address: string;
  availability: string;
  travelAreas: string;
  specialisations: string;
  documents: string;
}>;

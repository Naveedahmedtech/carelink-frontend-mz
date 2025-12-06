export type DaySlot = { start: string; end: string };
export type Availability = Record<string, DaySlot[]>; // e.g., Mon: [{start: "09:00", end: "12:00"}]

export type AgreementData = {
  tos: boolean;
  privacy: boolean;
  consent: boolean;
  signature: {
    dataUrl: string | null;
    date: string;
  };
};

export type TrainerRegistrationValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  availability: Availability;
  travelAreas: string[];
  specialisations: string[];
  documents: Record<string, { file?: File | null }>;
  agreement?: AgreementData; // ✅ new
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
  agreement: string; // ✅ new
}>;

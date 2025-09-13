// src/redux/features/trainerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrainerRegistrationValues } from "../../pages/auth/registration/trainers/onboarding/shared/types";


export interface TrainerState extends TrainerRegistrationValues {
  userId: string | null;
  trainerId: string | null;
  onboardingStep: number;
}

const initialState: TrainerState = {
  userId: null,
  trainerId: null,
  onboardingStep: 0,
  fullName: "",
  email: "",
  phone: "",
  address: "",
  availability: {},   // ✅ matches Availability type
  travelAreas: [],
  specialisations: [],
  documents: {},      // ✅ matches documents type
};

const saved = localStorage.getItem("trainerProfile");
if (saved) {
  Object.assign(initialState, JSON.parse(saved));
}

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    setTrainerProfile: (state, action: PayloadAction<Partial<TrainerState>>) => {
      Object.assign(state, action.payload);
      localStorage.setItem("trainerProfile", JSON.stringify(state));
    },
    clearTrainerProfile: (state) => {
      Object.assign(state, {
        userId: null,
        trainerId: null,
        onboardingStep: 0,
        fullName: "",
        email: "",
        phone: "",
        address: "",
        availability: {},
        travelAreas: [],
        specialisations: [],
        documents: {},
      });
      localStorage.removeItem("trainerProfile");
    },
  },
});

export const { setTrainerProfile, clearTrainerProfile } = trainerSlice.actions;
export default trainerSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../../types/types';

// If you already have this elsewhere, import it; otherwise declare here:
export type FundingType = 'plan' | 'self' | 'ndia';

type BaseDraft = {
  role?: Role;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  language?: string;
  timezone?: string;
  password?: string;
};

// ✅ Participant-specific fields used in Step 1
type ParticipantDraft = BaseDraft & {
  fullName?: string;
  ndisNumber?: string;
  dob?: string;                 // ISO date string
  address?: string;

  // Guardian (minors)
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  isMinor?: boolean;

  // Preferences
  interests?: string[];
  availability?: Record<string, string>;

  // Funding
  fundingType?: FundingType;
  planManagerName?: string;
  planManagerEmail?: string;
};

// Future: add trainer/admin drafts as needed
type TrainerDraft = BaseDraft & {
  // trainer-specific fields (placeholder)
};
type AdminDraft = BaseDraft & {
  // admin-specific fields (placeholder)
};

// Union keeps type-safety across roles
export type AccountDraft = ParticipantDraft | TrainerDraft | AdminDraft;

type RegistrationState = {
  role: Role | null;
  step: number;
  accountDraft: AccountDraft;   // can start empty because all fields optional
};

const initialState: RegistrationState = {
  role: null,
  step: 0,
  accountDraft: {},
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setRole: (s, a: PayloadAction<Role>) => { s.role = a.payload; },
    // Merge any subset of fields into the draft
    setAccountDraft: (s, a: PayloadAction<Partial<AccountDraft>>) => {
      s.accountDraft = { ...s.accountDraft, ...a.payload };
    },
    nextStep: (s) => { s.step += 1; },
    prevStep: (s) => { s.step = Math.max(0, s.step - 1); },
    resetRegistration: () => initialState,
  },
});

export const { setRole, setAccountDraft, nextStep, prevStep, resetRegistration } = registrationSlice.actions;
export default registrationSlice.reducer;
export type { RegistrationState };

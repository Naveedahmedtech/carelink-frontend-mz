export type FundingType = 'plan' | 'self' | 'ndia';

export type RegistrationValues = {
  fullName: string;
  ndisNumber: string;
  dob: string;
  address: string;
  email: string;
  phone: string;

  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;

  interests: string[];
  availability: any;

  planManagerName: string;
  planManagerEmail: string;

  password?: string;
  confirmPassword?: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

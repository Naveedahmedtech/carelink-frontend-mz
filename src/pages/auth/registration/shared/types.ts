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
  availability: Record<string, string>;

  planManagerName: string;
  planManagerEmail: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

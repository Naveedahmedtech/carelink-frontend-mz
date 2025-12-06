// -----------------------------------------------
// src/pages/trainers/onboarding/shared/constants.ts
export const TRAINER_STEPS = [
  {
    key: "identity",
    short: "Details",
    title: "Your Details",
    subtitle: "Contact info and address",
  },
  {
    key: "availability",
    short: "Availability",
    title: "Availability & Travel",
    subtitle: "When and where you can work",
  },
  {
    key: "specialisations",
    short: "Specialisations",
    title: "Areas of Specialisation",
    subtitle: "Tell us your strengths",
  },
  {
    key: "documents",
    short: "Documents",
    title: "Upload Documents",
    subtitle: "Provide screening & certificates",
  },
  {
    key: "training",
    short: "Training",
    title: "Training & Assessment",
    subtitle: "Complete modules and quizzes",
  },
  {
    key: "agreement", // 🔹 new step
    short: "Agreement",
    title: "Employment Agreement",
    subtitle: "Review and sign your employment agreement",
  },
] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const SPECIALISATIONS = [
  "Autism",
  "Physical Disabilities",
  "Mental Health",
  "Intellectual Disabilities",
  "Challenging Behaviours",
  "Community Participation",
  "Fitness & Outdoors",
  "Cooking & Life Skills",
];

export const COMPULSORY_DOCS = ["ndisCheck", "wwcc", "licence"] as const;
export const OPTIONAL_DOCS = ["firstAid", "cpr", "qualification"] as const;

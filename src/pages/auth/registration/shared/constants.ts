export const STEPS = [
  {
    title: "Registration Form",
    description: "Tell us about you and your preferences.",
    path: "/auth/register/participant", // or whatever route you use
  },
  {
    title: "Service Agreement",
    description: "Review and sign the agreement.",
    path: "/auth/register/participant/agreement",
  },
  {
    title: "Create Login",
    description: "Choose your username and password.",
    path: "/auth/register/participant/create-login",
  },
  // {
  //   title: "Book Interview",
  //   description: "Activate your account after the interview.",
  //   path: "/auth/register/participant/book-interview",
  // },
];


export const INTERESTS = [
  'Boxing', 'Fitness', 'Outdoors', 'Cooking', 'Community Participation', 'Arts & Crafts'
] as const;

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

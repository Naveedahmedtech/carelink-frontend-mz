// src/pages/trainers/onboarding/shared/trainingModules.ts

export type Question = {
  id: string;
  text: string;
  type?: "mcq" | "short";
  options?: string[];
  answer: number | string;
};

export type TrainingModule = {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  slides?: string[];
  questions: Question[];
};

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "orientation",
    title: "Company Orientation",
    content:
      "Welcome to CareLink! In this module you’ll learn about our mission, how we support participants, and the values that guide our services.",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    slides: [
      "https://picsum.photos/id/1011/800/450",
      "https://picsum.photos/id/1012/800/450",
    ],
    questions: [
      {
        id: "q1",
        text: "What is CareLink’s primary mission?",
        type: "mcq",
        options: ["Compliance only", "Empowering participants", "Financial goals"],
        answer: 1,
      },
    ],
  },
  {
    id: "disabilities",
    title: "Dealing with People with Disabilities",
    content:
      "Learn respectful communication, building trust, and providing support that encourages independence. Always focus on abilities, not limitations.",
    videoUrl: "https://www.youtube.com/embed/9zOJtQlYj6U",
    slides: [
      "https://picsum.photos/id/1015/800/450",
      "https://picsum.photos/id/1016/800/450",
    ],
    questions: [
      {
        id: "q1",
        text: "Best practice when supporting a client is to:",
        type: "mcq",
        options: ["Assume needs", "Ask politely", "Ignore differences"],
        answer: 1,
      },
      {
        id: "q2",
        text: "Write one key value we uphold when working with people with disabilities.",
        type: "short",
        answer: "respect",
      },
    ],
  },
  {
    id: "processes",
    title: "Our Processes",
    content:
      "CareLink has clear processes to ensure accountability. You’ll need to clock in/out of shifts, complete shift reports, and log mileage accurately.",
    videoUrl: "https://www.youtube.com/embed/hs6DqPoVMO0",
    slides: [
      "https://picsum.photos/id/1018/800/450",
      "https://picsum.photos/id/1019/800/450",
    ],
    questions: [
      {
        id: "q1",
        text: "Shift reports must be completed:",
        type: "mcq",
        options: ["At end of shift", "Weekly", "Only if issues arise"],
        answer: 0,
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Confidentiality",
    content:
      "Data privacy is critical. All participant information must be confidential and comply with the Australian Privacy Act 1988 and NDIS requirements.",
    videoUrl: "https://www.youtube.com/embed/k-H7XLPo9jY",
    slides: [
      "https://picsum.photos/id/1020/800/450",
      "https://picsum.photos/id/1021/800/450",
    ],
    questions: [
      {
        id: "q1",
        text: "What law ensures participant data protection in Australia?",
        type: "short",
        answer: "privacy act",
      },
    ],
  },
  {
    id: "values",
    title: "Our Mission & Values",
    content:
      "CareLink is built on respect, inclusion, and empowerment. As a trainer, you represent these values in every interaction.",
    videoUrl: "https://www.youtube.com/embed/5h4H1a4X1UI",
    slides: [
      "https://picsum.photos/id/1022/800/450",
      "https://picsum.photos/id/1023/800/450",
    ],
    questions: [
      {
        id: "q1",
        text: "Which of these is a CareLink value?",
        type: "mcq",
        options: ["Respect", "Profit", "Exclusivity"],
        answer: 0,
      },
    ],
  },
];

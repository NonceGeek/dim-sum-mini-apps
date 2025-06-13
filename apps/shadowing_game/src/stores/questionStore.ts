import { create } from "zustand";

interface QuestionState {
  questions: [] | null;
  setQuestions: (questions: []) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: null,
  setQuestions:async (questions: [] | null) => {
    set({ questions });
  },
}));

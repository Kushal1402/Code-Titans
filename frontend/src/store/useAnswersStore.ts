import { create } from "zustand";

interface Answer {
  id: string;
  content: string;
  userName: string;
  createdAt: string;
  votes: number;
  userVote: "up" | "down" | null;
}

interface AnswersState {
  answers: Answer[];
  totalAnswers: number;
  isLoading: boolean;
  error: string | null;

  setAnswers: (answers: Answer[]) => void;
  setTotalAnswers: (total: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  fetchAnswers: (questionId: string) => Promise<void>;
  addAnswer: (questionId: string, content: string) => Promise<boolean>;
  voteAnswer: (answerId: string, voteType: "up" | "down") => Promise<boolean>;
  deleteAnswer: (answerId: string) => Promise<boolean>;
}

export const useAnswersStore = create<AnswersState>((set, get) => ({
  answers: [],
  totalAnswers: 0,
  isLoading: false,
  error: null,

  setAnswers: (answers) => set({ answers }),
  setTotalAnswers: (total) => set({ totalAnswers: total }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchAnswers: async (questionId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Commented out API call
      // const response = await api.get(`/api/questions/${questionId}/answers`);
      // set({ 
      //   answers: response.answers,
      //   totalAnswers: response.total,
      //   isLoading: false 
      // });

      // Mock data instead of API call
      const mockAnswers = [
        {
          id: "1",
          content: `
            <p>Let me break down the key differences and best practices for React Server Components (RSC) vs Client Components:</p>

            <h4>Server Components:</h4>
            <ul>
              <li>Run only on the server and never get shipped to the client</li>
              <li>Can directly access backend resources (DB, filesystem)</li>
              <li>Help reduce bundle size since they don't get sent to the client</li>
              <li>Great for static content and data fetching</li>
            </ul>

            <h4>Client Components:</h4>
            <ul>
              <li>Run on both server (during SSR) and client</li>
              <li>Required for interactivity (useState, event handlers)</li>
              <li>Need the 'use client' directive at the top</li>
              <li>Should be used sparingly to minimize bundle size</li>
            </ul>

            <p>Best practices:</p>
            <ol>
              <li>Start with Server Components by default</li>
              <li>Move to Client Components only when you need interactivity or client-side APIs</li>
              <li>Keep Client Components at the leaves of your component tree when possible</li>
            </ol>
          `,
          userName: "NextjsExpert",
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          votes: 15,
          userVote: null
        },
        {
          id: "2",
          content: "This is another mock answer for testing purposes.",
          userName: "TestUser",
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          votes: 5,
          userVote: null
        }
      ];

      set({
        answers: mockAnswers,
        totalAnswers: mockAnswers.length,
        isLoading: false
      });

    } catch (error) {
      console.error('Error fetching answers:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch answers',
        isLoading: false 
      });
    }
  },

  // Add new answer
  addAnswer: async (questionId: string, content: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Commented out API call
      // const response = await api.post(`/api/questions/${questionId}/answers`, {
      //   content
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add mock answer to state
      const newAnswer = {
        id: Date.now().toString(),
        content,
        userName: "CurrentUser",
        createdAt: new Date().toISOString(),
        votes: 0,
        userVote: null
      };

      set(state => ({
        answers: [...state.answers, newAnswer],
        totalAnswers: state.totalAnswers + 1,
        isLoading: false
      }));

      return true;
    } catch (error) {
      console.error('Error adding answer:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add answer',
        isLoading: false 
      });
      return false;
    }
  },

  // Vote on answer
  voteAnswer: async (answerId: string, voteType: 'up' | 'down') => {
    try {
      // Commented out API call
      // await api.post(`/api/answers/${answerId}/vote`, { voteType });

      // Update the vote count in the local state
      set((state) => ({
        answers: state.answers.map(answer => 
          answer.id === answerId
            ? {
                ...answer,
                votes: voteType === 'up' 
                  ? answer.votes + (answer.userVote === 'down' ? 2 : 1)
                  : answer.votes - (answer.userVote === 'up' ? 2 : 1),
                userVote: voteType
              }
            : answer
        )
      }));

      return true;
    } catch (error) {
      console.error('Error voting on answer:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to vote' });
      return false;
    }
  },

  // Delete answer
  deleteAnswer: async (answerId: string) => {
    try {
      // Commented out API call
      // await api.delete(`/api/answers/${answerId}`);

      // Update local state
      set((state) => ({
        answers: state.answers.filter(answer => answer.id !== answerId),
        totalAnswers: state.totalAnswers - 1
      }));

      return true;
    } catch (error) {
      console.error('Error deleting answer:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete answer' });
      return false;
    }
  },
}));

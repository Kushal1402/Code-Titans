import { api } from '@/lib/api';
import { questions } from '@/lib/endPoints';
import { create } from 'zustand';

interface Tag {
  id: string;
  name: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  userName: string;
  tags: Tag[];
  answersCount: number;
  createdAt: string;
  votes: number;
  userVote: 'up' | 'down' | null;
}

interface QuestionsState {
  // Data
  questions: Question[];
  totalQuestions: number;
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Filters
  searchQuery: string;
  selectedFilters: string[];

  // Actions
  setQuestions: (questions: Question[]) => void;
  setTotalQuestions: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (perPage: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilters: (filters: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Fetch questions
  fetchQuestions: () => Promise<void>;
  // Fetch single question
  fetchQuestion: (id: string) => Promise<Question | null>;
  // Create question
  createQuestion: (title: string, content: string, tags: Tag[]) => Promise<boolean>;
  // Vote on question
  voteQuestion: (questionId: string, voteType: 'up' | 'down') => Promise<boolean>;
}

// Dummy data for development
const dummyQuestions: Question[] = [
  {
    id: '1',
    title: 'How to use Zustand in Next.js?',
    description: 'I am trying to manage state in my Next.js app. How do I use Zustand effectively?',
    userName: 'Alice',
    tags: [
      { id: '1', name: 'nextjs' },
      { id: '2', name: 'zustand' }
    ],
    answersCount: 2,
    createdAt: '2024-06-01T10:00:00Z',
    votes: 5,
    userVote: null
  },
  {
    id: '2',
    title: 'What is the best way to style React components?',
    description: 'Should I use CSS modules, styled-components, or Tailwind CSS? What are the pros and cons?',
    userName: 'Bob',
    tags: [
      { id: '3', name: 'react' },
      { id: '4', name: 'css' }
    ],
    answersCount: 5,
    createdAt: '2024-06-02T12:30:00Z',
    votes: 3,
    userVote: null
  },
  {
    id: '3',
    title: 'How to optimize performance in large React apps?',
    description: 'My React app is getting slow as it grows. What are some best practices for optimization?',
    userName: 'Charlie',
    tags: [
      { id: '3', name: 'react' },
      { id: '5', name: 'performance' }
    ],
    answersCount: 3,
    createdAt: '2024-06-03T09:15:00Z',
    votes: 8,
    userVote: null
  }
];

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  // Initial state
  questions: [],
  totalQuestions: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
  selectedFilters: ['newest'],

  // Actions
  setQuestions: (questions) => set({ questions }),
  setTotalQuestions: (total) => set({ totalQuestions: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (perPage) => set({ itemsPerPage: perPage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedFilters: (filters) => set({ selectedFilters: filters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Fetch questions with current filters and pagination
  fetchQuestions: async () => {
    const { currentPage, itemsPerPage, searchQuery, selectedFilters } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      // Commented out API call
      // const response = await api.get([questions.PAGINATED, {page:currentPage,perPage:itemsPerPage,search:searchQuery,filters:selectedFilters.join(',')}]);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch questions');
      // }
      // const data = await response.json();
      
      // Using dummy data instead
      set({
        questions: dummyQuestions,
        totalQuestions: dummyQuestions.length,
        isLoading: false
      });
    } catch (error) {
      console.log(error);
      set({
        questions: dummyQuestions,
        totalQuestions: dummyQuestions.length,
        isLoading: false
      });
    }
  },

  // Fetch single question
  fetchQuestion: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Commented out API call
      // const response = await api.get(`/api/questions/${id}`);
      // set({ isLoading: false });
      // return response.question;
      
      // Return mock data instead
      const mockQuestion: Question = {
        id,
        title: 'Understanding React Server Components vs Client Components',
        description: `
          <p>I've been working with Next.js 13+ and I'm a bit confused about when to use Server Components vs Client Components.</p>
          
          <p>Specifically, I have questions about:</p>
          <ul>
            <li>What are the main differences between Server and Client Components?</li>
            <li>When should I use 'use client' directive?</li>
            <li>How do they affect performance and SEO?</li>
            <li>What are the best practices for mixing them in a real application?</li>
          </ul>
          
          <p>I would appreciate if someone could provide a detailed explanation with examples.</p>
        `,
        userName: 'ReactLearner',
        tags: [
          { id: '1', name: 'react' },
          { id: '2', name: 'nextjs' },
          { id: '3', name: 'server-components' }
        ],
        answersCount: 3,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        votes: 42,
        userVote: null
      };
      set({ isLoading: false });
      return mockQuestion;
    } catch (error) {
      console.error('Error fetching question:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch question',
        isLoading: false 
      });
      return null;
    }
  },

  // Create new question
  createQuestion: async (title: string, content: string, tags: Tag[]) => {
    set({ isLoading: true, error: null });
    
    try {
      // Commented out API call
      // const response = await api.post(questions.QUESTION, { 
      //   title, 
      //   content,
      //   tags
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to create question');
      // }

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh questions list after creating new question
      await get().fetchQuestions();
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error creating question:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create question',
        isLoading: false 
      });
      return false;
    }
  },

  // Vote on question
  voteQuestion: async (questionId: string, voteType: 'up' | 'down') => {
    try {
      // Commented out API call
      // await api.post(`/api/questions/${questionId}/vote`, { 
      //   voteType 
      // });

      // Update the vote count in the local state
      set((state) => ({
        questions: state.questions.map(question => 
          question.id === questionId
            ? {
                ...question,
                votes: voteType === 'up' 
                  ? question.votes + (question.userVote === 'down' ? 2 : 1)
                  : question.votes - (question.userVote === 'up' ? 2 : 1),
                userVote: voteType
              }
            : question
        )
      }));

      return true;
    } catch (error) {
      console.error('Error voting on question:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to vote' });
      return false;
    }
  }
})); 
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
    createdAt: '2024-06-01T10:00:00Z'
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
    createdAt: '2024-06-02T12:30:00Z'
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
    createdAt: '2024-06-03T09:15:00Z'
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
      const response = await api.get([questions.PAGINATED, {page:currentPage,perPage:itemsPerPage,search:searchQuery,filters:selectedFilters.join(',')}]);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      
      set({
        questions: data.questions,
        totalQuestions: data.total,
        isLoading: false
      });
    } catch (error) {
        console.log(error);
        set({
          questions: dummyQuestions,
          totalQuestions: dummyQuestions.length,
        //   error: error instanceof Error ? error.message : 'An error occurred',
          isLoading: false
        });
    }
  }
})); 
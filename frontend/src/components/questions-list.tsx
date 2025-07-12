"use client";

import useSWR, { useSWRConfig } from "swr";
import React from "react";
import Link from "next/link";
import Pagination from "./pagination";
import StatusWrapper from "./status-wrapper";
import { ChevronUpIcon, ChevronDownIcon, Trash2Icon } from 'lucide-react';
import { useAppStore } from "@/store/useAppStore";
import axios from "@/lib/axios";
import { useQuestionsStore } from "@/store/useQuestionsStore";
import { questionEndpoint } from "@/lib/endPoints";

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

interface QuestionsResponse {
  questions: Question[];
  totalQuestions: number;
}


export default function QuestionsList() {
  const { isAuthenticated, isAdmin } = useAppStore();
  const { mutate } = useSWRConfig();
  const {fetchQuestions,questions,currentPage,itemsPerPage,setCurrentPage,setItemsPerPage} = useQuestionsStore();

  const {  error, isLoading } = useSWR<QuestionsResponse>(
    `${questionEndpoint.PAGINATED}?page=${currentPage}&perPage=${itemsPerPage}`,
    async (url: string) => {
      await fetchQuestions(url);
      return { questions, totalQuestions: questions.length };
    }
  );
  const questionsList = questions || [];
  const totalQuestions = questions.length || 0;
  const currentPageStart = (currentPage - 1) * itemsPerPage + 1;
  const currentPageEnd = Math.min(currentPage * itemsPerPage, totalQuestions);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1)
  };

  const handleVote = async (e: React.MouseEvent, questionId: string, voteType: 'up' | 'down') => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }

    const currentQuestions = [...questionsList];
    const questionIndex = currentQuestions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const question = currentQuestions[questionIndex];
    const oldVote = question.userVote;
    const voteChange = 
      oldVote === voteType ? -1 : 
      oldVote === null ? 1 : 
      2;

    currentQuestions[questionIndex] = {
      ...question,
      votes: question.votes + (voteType === 'up' ? voteChange : -voteChange),
      userVote: oldVote === voteType ? null : voteType
    };

    try {
      await axios.post(questionEndpoint.VOTE(questionId), { voteType });
      mutate(`${questionEndpoint.PAGINATED}?page=${currentPage}&limit=${itemsPerPage}`);
    } catch (error) {
      mutate(`${questionEndpoint.PAGINATED}?page=${currentPage}&limit=${itemsPerPage}`);
      console.error('Failed to vote:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${questionEndpoint.QUESTION}/${questionId}`);
        mutate(`${questionEndpoint.PAGINATED}?page=${currentPage}&limit=${itemsPerPage}`);
      } catch (error) {
        mutate(`${questionEndpoint.PAGINATED}?page=${currentPage}&limit=${itemsPerPage}`);
        console.error('Failed to delete question:', error);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <StatusWrapper 
        onRetry={() => mutate(`${questionEndpoint.PAGINATED}?page=${currentPage}&limit=${itemsPerPage}`)}
        loading={isLoading} 
        error={error} 
        className="flex-grow h-[80vh] overflow-y-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4"
      >
        <div className="p-3 h-full space-y-6">
          {questionsList.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="group block border-2 border-indigo-100 rounded-xl p-6 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-200 transform "
            >
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-indigo-50 to-purple-50 p-3 rounded-lg">
                  <button
                    onClick={(e) => handleVote(e, question.id, 'up')}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      question.userVote === 'up' 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'text-gray-400 hover:bg-indigo-100 hover:text-indigo-600'
                    }`}
                  >
                    <ChevronUpIcon size={24} />
                  </button>
                  <span className={`text-lg font-bold ${
                    question.votes > 0 ? 'text-green-600' : 
                    question.votes < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {question.votes}
                  </span>
                  <button
                    onClick={(e) => handleVote(e, question.id, 'down')}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      question.userVote === 'down' 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'text-gray-400 hover:bg-indigo-100 hover:text-indigo-600'
                    }`}
                  >
                    <ChevronDownIcon size={24} />
                  </button>
                </div>
                        
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow pr-4">
                      <h3 className="text-xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-800 transition-colors">
                        {question.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-purple-600 whitespace-nowrap bg-purple-50 px-3 py-1 rounded-full">
                        {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDelete(e, question.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:text-red-600 hover:scale-110"
                          title="Delete question"
                        >
                          <Trash2Icon size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                        {question.userName.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-indigo-700">
                        {question.userName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full">
                      <span className="px-2 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full font-bold">
                        {question.answersCount}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {question.answersCount === 1 ? "answer" : "answers"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-4 py-1.5 text-sm bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full font-medium hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </StatusWrapper>
      <Pagination
        totalItems={totalQuestions}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        currentPageStart={currentPageStart}
        currentPageEnd={currentPageEnd}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        className="w-full mt-6"
      />
    </div>
  );
}

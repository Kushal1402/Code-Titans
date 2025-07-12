"use client";

import React from "react";
import Pagination from "./pagination";
import { useQuestionsStore } from "@/store/useQuestionsStore";
import StatusWrapper from "./status-wrapper";

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

export default function QuestionsList() {
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    fetchQuestions,
    isLoading,
    error,
    questions,
    totalQuestions,
  } = useQuestionsStore();

  const currentPageStart = (currentPage - 1) * itemsPerPage + 1;
  const currentPageEnd = Math.min(currentPage * itemsPerPage, totalQuestions);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchQuestions();
  };

  const handlePerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
    fetchQuestions();
  };

  return (
    <div className="h-full flex flex-col">
      <StatusWrapper 
        onRetry={()=>window.location.reload()}
        loading={isLoading} 
        error={error} 
        className="flex-grow min-h-[300px] max-h-[500px] overflow-y-auto"
      >
        <div className="p-3 flex flex-col gap-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow pr-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {question.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(question.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {question.userName.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {question.userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">
                      {question.answersCount}
                    </span>
                    <span className="text-sm text-gray-600">
                      {question.answersCount === 1 ? "answer" : "answers"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-colors"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
        className="w-full"
      ></Pagination>
    </div>
  );
}

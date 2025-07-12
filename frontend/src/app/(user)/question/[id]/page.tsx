'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { useAnswersStore } from '@/store/useAnswersStore';
import { useAppStore } from '@/store/useAppStore';
import Editor from '@/components/ui/editor';
import Button from '@/components/ui/button';
import StatusWrapper from '@/components/status-wrapper';
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { questionEndpoint } from '@/lib/endPoints';

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;
  const { isAuthenticated, isAdmin } = useAppStore();
  const { fetchQuestion, voteQuestion, deleteQuestion } = useQuestionsStore();
  const { 
    answers, 
    fetchAnswers, 
    addAnswer, 
    voteAnswer,
    deleteAnswer,
    isLoading: answersLoading,
    error: answersError 
  } = useAnswersStore();

  const [question, setQuestion] = useState<any>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {error,isLoading} = useSWR(questionEndpoint.SINGLE(questionId),async ()=>{
    const questionData = await fetchQuestion(questionId);
    if (questionData) {
      setQuestion(questionData);
      await fetchAnswers(questionId);
    }
  });

  const handleVoteQuestion = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }
    await voteQuestion(questionId, voteType);
  };

  const handleVoteAnswer = async (answerId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }
    await voteAnswer(answerId, voteType);
  };

  const handleDeleteQuestion = async () => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      setIsDeleting(true);
      const success = await deleteQuestion(questionId);
      setIsDeleting(false);
      
      if (success) {
        mutate((url:string)=> url && (url.includes(questionEndpoint.PAGINATED) || url.includes(questionEndpoint.SINGLE(questionId))));
        router.push('/');
      }
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
      await deleteAnswer(answerId);
      mutate((url:string)=> url && (url.includes(questionEndpoint.PAGINATED) || url.includes(questionEndpoint.SINGLE(questionId))));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!isAuthenticated) {
      alert('Please log in to submit an answer');
      return;
    }
    
    if (!answerContent.trim()) {
      alert('Please enter your answer');
      return;
    }

    setIsSubmitting(true);
    const success = await addAnswer(questionId, answerContent);
    setIsSubmitting(false);

    if (success) {
      setAnswerContent('');
      mutate((url:string)=> url && (url.includes(questionEndpoint.PAGINATED) || url.includes(questionEndpoint.SINGLE(questionId))));
    }
  };

  return (
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-5xl">
      <StatusWrapper loading={isLoading} error={error}>
        {question && (
          <div>
            {/* Question Section */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-12 transition-shadow hover:shadow-lg">
              <div className="flex md:gap-8 gap-2">
                {/* Vote buttons */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleVoteQuestion('up')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      question.userVote === 'up'
                        ? 'bg-green-100 text-green-600'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                  >
                    <ChevronUpIcon size={28} />
                  </button>
                  <span className={`text-xl font-semibold transition-colors duration-200 ${
                    question.userVote === 'up' 
                      ? 'text-green-600' 
                      : question.userVote === 'down' 
                        ? 'text-red-600' 
                        : 'text-gray-700'
                  }`}>
                    {question.votes}
                  </span>
                  <button
                    onClick={() => handleVoteQuestion('down')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      question.userVote === 'down'
                        ? 'bg-red-100 text-red-600'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                  >
                    <ChevronDownIcon size={28} />
                  </button>
                </div>

                {/* Question content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">{question.title}</h1>
                    {isAdmin && (
                      <button
                        onClick={handleDeleteQuestion}
                        disabled={isDeleting}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                        title="Delete question"
                      >
                        <TrashIcon size={22} className="group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    )}
                  </div>
                  <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.description }} />
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {question.tags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-full transition-colors duration-200 hover:bg-blue-100"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 border-t pt-4">
                    <span className="font-medium">Asked by {question.userName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>

              <StatusWrapper loading={answersLoading} error={answersError}>
                <div className="space-y-6">
                  {answers.map((answer) => (
                    <div key={answer.id} className="bg-white rounded-xl shadow-md md:p-8 p-3  transition-shadow hover:shadow-lg">
                      <div className="flex md:gap-8 gap-2">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleVoteAnswer(answer.id, 'up')}
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                              answer.userVote === 'up'
                                ? 'bg-green-100 text-green-600'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                          >
                            <ChevronUpIcon size={28} />
                          </button>
                          <span className={`text-xl font-semibold transition-colors duration-200 ${
                            answer.userVote === 'up' 
                              ? 'text-green-600' 
                              : answer.userVote === 'down' 
                                ? 'text-red-600' 
                                : 'text-gray-700'
                          }`}>
                            {answer.votes}
                          </span>
                          <button
                            onClick={() => handleVoteAnswer(answer.id, 'down')}
                            className={`p-2.5 rounded-lg transition-all duration-200 ${
                              answer.userVote === 'down'
                                ? 'bg-red-100 text-red-600'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                          >
                            <ChevronDownIcon size={28} />
                          </button>
                        </div>

                        {/* Answer content */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: answer.content }} />
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteAnswer(answer.id)}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group ml-4"
                                title="Delete answer"
                              >
                                <TrashIcon size={22} className="group-hover:scale-110 transition-transform duration-200" />
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 border-t pt-4">
                            <span className="font-medium">Answered by {answer.userName}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </StatusWrapper>
            </div>

            {/* Add Answer Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Answer</h2>
              
              {isAuthenticated ? (
                <>
                  <Editor
                    value={answerContent}
                    onChange={setAnswerContent}
                    placeholder="Write your answer here..."
                    className="mb-6"
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    loading={isSubmitting}
                    disabled={isSubmitting || !answerContent.trim()}
                    className="w-full sm:w-auto"
                  >
                    Post Your Answer
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-6 text-lg">You need to be logged in to submit an answer.</p>
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full sm:w-auto"
                  >
                    Log in to Answer
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </StatusWrapper>
    </div>
  );
} 
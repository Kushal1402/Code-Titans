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

  useEffect(() => {
    const loadData = async () => {
      const questionData = await fetchQuestion(questionId);
      if (questionData) {
        setQuestion(questionData);
        await fetchAnswers(questionId);
      }
    };
    loadData();
  }, [questionId, fetchQuestion, fetchAnswers]);

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
        router.push('/');
      }
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
      await deleteAnswer(answerId);
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
    }
  };

  return (
    <div className="min-h-screen py-8 container mx-auto px-4">
      <StatusWrapper loading={!question}>
    {question &&   <div className="container mx-auto px-4">
        {/* Question Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-6">
            {/* Vote buttons */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleVoteQuestion('up')}
                className={`p-2 rounded hover:bg-gray-100 ${
                  question.userVote === 'up' ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <ChevronUpIcon size={24} />
              </button>
              <span className="text-lg font-semibold">{question.votes}</span>
              <button
                onClick={() => handleVoteQuestion('down')}
                className={`p-2 rounded hover:bg-gray-100 ${
                  question.userVote === 'down' ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                <ChevronDownIcon size={24} />
              </button>
            </div>

            {/* Question content */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{question.title}</h1>
                {isAdmin && (
                  <button
                    onClick={handleDeleteQuestion}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete question"
                  >
                    <TrashIcon size={20} />
                  </button>
                )}
              </div>
              <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: question.description }} />
              
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <span>Asked by {question.userName}</span>
                <span className="mx-2">•</span>
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          <StatusWrapper loading={answersLoading} error={answersError}>
            {answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <div className="flex gap-6">
                  {/* Vote buttons */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleVoteAnswer(answer.id, 'up')}
                      className={`p-2 rounded hover:bg-gray-100 ${
                        answer.userVote === 'up' ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <ChevronUpIcon size={24} />
                    </button>
                    <span className="text-lg font-semibold">{answer.votes}</span>
                    <button
                      onClick={() => handleVoteAnswer(answer.id, 'down')}
                      className={`p-2 rounded hover:bg-gray-100 ${
                        answer.userVote === 'down' ? 'text-red-600' : 'text-gray-400'
                      }`}
                    >
                      <ChevronDownIcon size={24} />
                    </button>
                  </div>

                  {/* Answer content */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: answer.content }} />
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAnswer(answer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full ml-4"
                          title="Delete answer"
                        >
                          <TrashIcon size={20} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Answered by {answer.userName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StatusWrapper>
        </div>

        {/* Add Answer Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
          
          {isAuthenticated ? (
            <>
              <Editor
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here..."
                className="mb-4"
              />
              <Button
                onClick={handleSubmitAnswer}
                loading={isSubmitting}
                disabled={isSubmitting || !answerContent.trim()}
              >
                Post Your Answer
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You need to be logged in to submit an answer.</p>
              <Button onClick={() => window.location.href = '/login'}>
                Log in to Answer
              </Button>
            </div>
          )}
        </div>
      </div>}
      </StatusWrapper>
    </div>
  );
} 
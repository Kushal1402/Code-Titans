"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Editor from '@/components/ui/editor';
import { useQuestionsStore } from '@/store/useQuestionsStore';

export default function AddQuestion() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createQuestion } = useQuestionsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert comma-separated tags into array and trim whitespace
      const tags = tagsInput.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => ({
          id: tag.toLowerCase(),
          name: tag
        }));

      const success = await createQuestion(title, content, tags);

      if (success) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview tags as they're typed
  const previewTags = tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Ask a Question</h1>
          <p className="text-sm text-gray-600">Share your programming questions with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Question Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-shadow duration-200"
                placeholder="e.g., How to implement authentication in Next.js?"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Be specific and imagine you're asking a question to another programmer
              </p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Question Details
              </label>
              <Editor
                value={content}
                onChange={setContent}
                placeholder="Include all the information someone would need to answer your question..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Include any relevant code, error messages, or context
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-shadow duration-200"
                placeholder="e.g., javascript, react, typescript"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Add up to 5 tags separated by commas
              </p>
              
              {/* Tags Preview */}
              {previewTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {previewTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/')}
                disabled={isSubmitting}
                className="px-4 py-1.5 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Post Question'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
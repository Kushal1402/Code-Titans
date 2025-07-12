'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (newPage: number) => {
    onPageChange(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Show first, last, current, and neighbors with ellipsis if needed
  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1; // how many neighbors to show
    let lastPage = 0;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        if (lastPage && i - lastPage > 1) {
          pages.push(
            <span key={`ellipsis-${i}`} className="px-2 py-1 select-none">
              ...
            </span>
          );
        }
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`
                  mx-1 min-w-[35px]
                  rounded-full
                  ${i === currentPage
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-purple-700'}
                  shadow
                  border border-purple-200
                  transition `}
            style={{ height: "2.2rem" }}
          >
            {i}
          </button>
        );
        lastPage = i;
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer"
        >
          <ChevronLeft />
        </button>

        <div className="flex flex-wrap justify-center">{renderPageNumbers()}</div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
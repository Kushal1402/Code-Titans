"use client";

import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { SearchIcon, MenuIcon } from './Icons';
import Button from './ui/button';
import { useQuestionsStore } from '@/store/useQuestionsStore';

export default function SearchFilter() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { 
        searchQuery,
        selectedFilters,
        setSearchQuery,
        setSelectedFilters,
        fetchQuestions,
        setCurrentPage
    } = useQuestionsStore();

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page on search
            fetchQuestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedFilters, fetchQuestions, setCurrentPage]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleFilterSelect = (filter: string) => {
        const newFilters = selectedFilters.includes(filter)
            ? selectedFilters.filter(f => f !== filter)
            : [...selectedFilters, filter];
        
        setSelectedFilters(newFilters);
    };

    return (
        <div className="relative w-full flex flex-col sm:block" ref={dropdownRef}>
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full p-2`}>
                <div className="relative flex-grow order-1 sm:order-none">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleChange}
                        placeholder="Search"
                        aria-label="Search input"
                        style={{ fontFamily: 'inherit' }}
                        className="w-full bg-transparent px-2 py-1 rounded outline-none text-base sm:text-lg font-handdrawn border border-gray-300"
                    />
                    <span className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                        <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </span>
                    <button
                        onClick={toggleDropdown}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        aria-label="Filter menu"
                    >
                        <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
                <Button
                    onClick={() => {/* TODO: Implement new question navigation */}}
                >
                    Add Question
                </Button>
            </div>
            
            {isDropdownOpen && (
                <div className="absolute right-2 top-full mt-1 w-full sm:w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                        <button
                            onClick={() => handleFilterSelect('newest')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2`}
                        >
                            <div className={`w-4 h-4 border rounded ${selectedFilters.includes('newest') ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                {selectedFilters.includes('newest') && (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            Newest
                        </button>
                        <button
                            onClick={() => handleFilterSelect('unanswered')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2`}
                        >
                            <div className={`w-4 h-4 border rounded ${selectedFilters.includes('unanswered') ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                {selectedFilters.includes('unanswered') && (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            Unanswered
                        </button>
                        <button
                            onClick={() => handleFilterSelect('more')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2`}
                        >
                            <div className={`w-4 h-4 border rounded ${selectedFilters.includes('more') ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                {selectedFilters.includes('more') && (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 
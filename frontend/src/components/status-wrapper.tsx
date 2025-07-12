import React from "react";
import Spinner from "./ui/spinner";

type StatusWrapperProps = {
    loading?: boolean;
    error?: string | null;
    children: React.ReactNode;
    className?: string;
    onRetry?: () => void;
};

const StatusWrapper: React.FC<StatusWrapperProps> = ({
    loading,
    error,
    children,
    className = "",
    onRetry,
}) => {
    const retry = () => {
        onRetry && onRetry();
    };

    return (
        <div className={`relative transition-all duration-300 ${className}`}>
            <div
                className={`absolute inset-0 flex justify-center items-center bg-white/80 z-10 transition-opacity duration-300 ${
                    loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                style={{ minHeight: "6rem" }}
            >
                <span className="text-lg text-gray-500"><Spinner size="lg" /></span>
            </div>

            <div
                className={`absolute inset-0 flex flex-col items-center justify-center py-8 px-4 rounded-xl bg-red-50 border border-red-200 shadow text-red-700 z-20 transition-opacity duration-300 ${
                    error ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                role="alert"
                style={{ minHeight: "6rem" }}
            >
                <svg
                    className="w-8 h-8 mb-2 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                </svg>
                <span className="font-semibold text-lg">Error</span>
                <button
                    type="button"
                    onClick={retry}
                    className="mt-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                    Try Again
                </button>
            </div>

            <div className={`${(loading || error) ? "opacity-50 pointer-events-none" : "opacity-100"} transition-opacity duration-300`}>
                {children}
            </div>
        </div>
    );
};

export default StatusWrapper;
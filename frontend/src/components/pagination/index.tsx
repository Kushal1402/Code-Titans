import React from 'react';
import { PaginationControls } from './pagination-controls';
import Select from '../ui/select';

interface PaginationProps {
  className?: string;
  children?: React.ReactNode;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  currentPageStart?: number;
  currentPageEnd?: number;
  onPerPageChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}
function Pagination(props: React.PropsWithChildren<PaginationProps>) {
  const handleChange = (e: string) => {
    if (props.onPerPageChange) {
      props.onPerPageChange(e);
    }
  };
  const handlePageChange = (e: number) => {
    if (props.onPageChange) {
      props.onPageChange(e);
    }
  };

  return (
    <div className={props.className ?? ''}>
        <div className="animate-in flex flex-col justify-between fade-in duration-300 h-full">
          <div className="flex-grow">{props.children}</div>
          <div>
            <div className="flex justify-between flex-wrap items-center mb-4 px-4 mt-4 gap-2">
              <div className="text-sm text-gray-600 mb-2">
                Showing {props.currentPageStart || 0}-{props.currentPageEnd || 0} of{' '}
                {props.totalItems || 0}
              </div>
              <PaginationControls
              currentPage={props.currentPage || 0}
              totalItems={props.totalItems || 0}
              itemsPerPage={props.itemsPerPage || 10}
              onPageChange={handlePageChange}
            />
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-sm text-gray-600">Results per page</div>
                <Select
                  value={props.itemsPerPage?.toString() || '10'}
                  onChange={e => handleChange(e.target.value)}
                  options={[
                    { id: '10', name: '10' },
                    { id: '25', name: '25' },
                    { id: '50', name: '50' },
                    { id: '100', name: '100' },
                  ]}
                  style={{padding:"5px",margin:"0px"}}
                  className="w-[80px] px-1"
                />
              </div>
            </div>
           
          </div>
        </div>
    </div>
  );
}

export default Pagination;
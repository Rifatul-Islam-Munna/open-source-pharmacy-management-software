import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const delta = 2; // Pages to show around current page
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  // Always include first page
  range.push(1);

  // Add pages around current page
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  // Always include last page if more than 1 page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Add dots where there are gaps
  for (const i of range) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-end mt-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center px-3 py-2 text-sm font-medium text-dark-text bg-white border border-border-gray  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          <span className=" hidden md:block">Previous</span>
        </button>

        <div className="flex items-center space-x-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm font-medium text-dark-text"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                  currentPage === page
                    ? "bg-dark-blue text-white border-primary-blue"
                    : "bg-white text-dark-text border-border-gray "
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center px-3 py-2 text-sm font-medium text-dark-text bg-white border border-border-gray  rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {" "}
          <span className=" hidden md:block"> Next</span>
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

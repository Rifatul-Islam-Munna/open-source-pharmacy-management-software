"use client";
import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { useDebounce } from "use-debounce";
import { CreateMedicineModal } from "@/components/custom/admin/CreateMedicineModal";
import { CSVUpload } from "@/components/custom/admin/CSVUpload";
import { DownloadSampleCsvButton } from "@/components/custom/admin/DownloadSampleCsvButton";
import Pagination from "@/components/custom/Pagination";

interface Medicine {
  _id: string;
  name: string;
  dosageType: string;
  generic: string;
  strength: string;
  manufacturer: string;
  UnitPrice: string;
  PackageSize: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationResponse {
  data: Medicine[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Skeleton Components
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-[#e5e7eb] rounded w-32"></div>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-[#e5e7eb] rounded w-20"></div>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
      <div className="h-4 bg-[#e5e7eb] rounded w-24"></div>
    </td>
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
      <div className="h-4 bg-[#e5e7eb] rounded w-16"></div>
    </td>
    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
      <div className="h-4 bg-[#e5e7eb] rounded w-20"></div>
    </td>
    <td className="px-3 sm:px-6 py-4 hidden xl:table-cell">
      <div className="h-4 bg-[#e5e7eb] rounded w-28"></div>
    </td>
  </tr>
);

const StatCardSkeleton = () => (
  <div className="bg-[#ffffff] p-4 sm:p-6 rounded-lg border border-[#e5e7eb] animate-pulse">
    <div className="h-4 bg-[#e5e7eb] rounded w-24 mb-3"></div>
    <div className="h-8 bg-[#e5e7eb] rounded w-16"></div>
  </div>
);

const MedicinesPage = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const [text] = useDebounce(searchParams.name, 800);

  const { data, isLoading, error } = useQueryWrapper<PaginationResponse>(
    ["medicines", searchParams.page, searchParams.limit, text],
    `/medicine/get-all-with-pagination?name=${text}&page=${searchParams.page}&limit=${searchParams.limit}`
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => ({ ...prev, page: 1, name: searchParams.name }));
  };

  const goToPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  if (error)
    return (
      <div className="text-red-500 text-center h-64 flex items-center justify-center">
        Error loading medicines
      </div>
    );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2937]">
          Medicines
        </h1>
        <div className="flex flex-wrap gap-2">
          <CSVUpload />
          <CreateMedicineModal />
          <DownloadSampleCsvButton />
        </div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mb-6 sm:mb-8 p-4 bg-white rounded-lg border border-border-gray"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines by name..."
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#2ca3fa] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2 bg-[#2ca3fa] text-[#ffffff] rounded-lg hover:bg-[#034c81] font-medium transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchParams({ name: "", page: 1, limit: 10 })}
              className="flex-1 sm:flex-none px-6 py-2 bg-[#f9fafb] text-[#1f2937] rounded-lg hover:bg-[#e5e7eb] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-border-gray">
              <h3 className="text-sm font-medium text-gray-500">
                Total Medicines
              </h3>
              <p className="text-2xl font-bold text-dark-blue">
                {data?.totalCount || 0}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-border-gray">
              <h3 className="text-sm font-medium text-gray-500">
                Current Page
              </h3>
              <p className="text-2xl font-bold text-dark-blue">
                {data?.page || 0}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-border-gray sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-500">Total Pages</h3>
              <p className="text-2xl font-bold text-dark-blue">
                {data?.totalPages || 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Medicines Table */}
      <div className="bg-white border border-border-gray rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-gray">
            <thead className="bg-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider hidden md:table-cell">
                  Generic
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider hidden lg:table-cell">
                  Strength
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider hidden lg:table-cell">
                  Package
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-dark-text uppercase tracking-wider hidden xl:table-cell">
                  Manufacturer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-gray">
              {isLoading ? (
                <>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </>
              ) : (
                data?.data.map((medicine) => (
                  <tr key={medicine._id} className="hover:bg-white">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-medium text-dark-text text-sm">
                      {medicine.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                      {medicine.dosageType}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-dark-text hidden md:table-cell">
                      {medicine.generic}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text hidden lg:table-cell">
                      {medicine.strength}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-dark-text hidden lg:table-cell">
                      {medicine.PackageSize}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-dark-text hidden xl:table-cell">
                      {medicine.manufacturer}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={goToPage}
          hasNextPage={data.hasNextPage}
          hasPrevPage={data.hasPrevPage}
        />
      )}
    </div>
  );
};

export default MedicinesPage;

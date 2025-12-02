"use client";
import React, { useState } from "react";
// Adjust path
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading medicines...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center h-64">
        Error loading medicines
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
        <div className="flex gap-2">
          <CSVUpload />
          <CreateMedicineModal />
          <DownloadSampleCsvButton />
        </div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mb-8 p-4 bg-white rounded-lg  border"
      >
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines by name..."
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ name: "", page: 1, limit: 10 })}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg  border">
          <h3 className="text-sm font-medium text-gray-500">Total Medicines</h3>
          <p className="text-2xl font-bold text-gray-900">
            {data?.totalCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg  border">
          <h3 className="text-sm font-medium text-gray-500">Current Page</h3>
          <p className="text-2xl font-bold text-gray-900">{data?.page || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg  border">
          <h3 className="text-sm font-medium text-gray-500">Total Pages</h3>
          <p className="text-2xl font-bold text-gray-900">
            {data?.totalPages || 0}
          </p>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strength
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((medicine) => (
                <tr key={medicine._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {medicine.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.dosageType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.generic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {medicine.strength}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {medicine.PackageSize}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {medicine.manufacturer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(data.page - 1) * data.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(data.page * data.limit, data.totalCount)}
            </span>{" "}
            of <span className="font-medium">{data.totalCount}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(data.page - 1)}
              disabled={!data.hasPrevPage}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      data.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goToPage(data.page + 1)}
              disabled={!data.hasNextPage}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;

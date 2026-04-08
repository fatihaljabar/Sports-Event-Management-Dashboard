"use client";

import { useState, useEffect, useCallback } from "react";
import { ITEMS_PER_PAGE } from "../constants";
import { getPageNumbers } from "../utils";

/**
 * Custom hook for pagination logic
 * Handles page state, calculates total pages, and provides paginated data
 */
export function usePagination<T>(items: T[], itemsPerPage: number = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when items length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Pagination calculations
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Page navigation handlers
  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Generate page numbers for display
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setCurrentPage,
  };
}

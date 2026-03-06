import { useMemo, useState } from "react";

const useClientPagination = (items = [], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pagedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize, totalPages]);

  const onPageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  return { currentPage: Math.min(currentPage, totalPages), totalItems, totalPages, pageSize, pagedItems, onPageChange, setCurrentPage };
};

export default useClientPagination;

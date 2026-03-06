const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (!totalItems) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-wrap d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-3">
      <div className="text-muted small">
        Showing {start}-{end} of {totalItems}
      </div>
      <div className="btn-group" role="group" aria-label="pagination">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button type="button" className="btn btn-sm btn-primary" disabled>
          {currentPage} / {totalPages}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default TablePagination;

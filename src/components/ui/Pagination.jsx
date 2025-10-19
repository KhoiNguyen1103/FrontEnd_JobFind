import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  // Cập nhật inputPage khi currentPage thay đổi từ bên ngoài
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/, ""); // Chỉ cho nhập số
    setInputPage(value);
  };

  const handlePageChange = () => {
    let page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(currentPage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageChange();
      e.target.blur(); // Khi nhấn Enter thì bỏ focus
    }
  };

  return (
    <div className="flex items-center space-x-2 text-lg">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-full bg-green-600 text-white disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      {/* Ô nhập trang */}
      <input
        type="text"
        value={inputPage}
        onChange={handleChange}
        onBlur={handlePageChange}
        onKeyDown={handleKeyDown}
        className="w-12 text-center border rounded-md"
      />

      {/* Hiển thị tổng số trang */}
      <span>/ {totalPages}</span>

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-full text-white bg-green-600 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
export default Pagination;

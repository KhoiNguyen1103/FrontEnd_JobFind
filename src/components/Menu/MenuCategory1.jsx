import React, { useState } from "react";
import { useSelector } from "react-redux";
import ButtonCircle from "../button/ButtonCircle";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const MenuCategory1 = ({ onClick }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryIdFromUrl = Number(searchParams.get("jobCategoryId"));
  const { categories } = useSelector((state) => state.category);
  const [page, setPage] = useState(1);
  const itemPerPage = 6;
  const pageCount = Math.ceil((categories ?? []).length / itemPerPage);
  const skipCount = (page - 1) * itemPerPage;

  const handleNextPage = () => {
    setPage((prev) => {
      if (page < pageCount) return prev + 1;
    });
  };

  const handlePrevPage = () => {
    setPage((prev) => {
      if (page > 1) return prev - 1;
    });
  };

  console.log(categories);
  return (
    <div className="border bg-white rounded-xl w-56 max-w-3xl">
      <div className="h-60">
        {categories?.slice(skipCount, skipCount + itemPerPage).map((cate) => (
          <div
            key={cate.jobCategoryId}
            className={`flex justify-between items-center p-2 rounded-xl font-semibold 
            cursor-pointer group ${
              categoryIdFromUrl === cate.jobCategoryId &&
              "bg-blue-500 text-white"
            }`}
            onClick={() => onClick(cate)}
          >
            <span>{cate.name}</span>
            <FontAwesomeIcon
              icon={faAngleRight}
              className="pe-2 transition-transform duration-200 ease-in-out group-hover:translate-x-1"
            />
          </div>
        ))}
      </div>
      <hr className="pb-2" />
      <div className="flex items-center gap-2 justify-between px-2">
        <ButtonCircle
          direction="left"
          onClick={handlePrevPage}
          disabled={page === 1}
        />
        {page} / {pageCount}
        <ButtonCircle
          direction="right"
          onClick={handleNextPage}
          disabled={page === pageCount}
        />
      </div>
    </div>
  );
};

export default MenuCategory1;

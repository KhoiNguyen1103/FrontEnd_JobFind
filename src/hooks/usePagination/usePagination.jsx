import { useState } from "react";

const usePagination = (dataOrg, itemPerPage = 6) => {
  const [page, setPage] = useState(1);
  if (!Array.isArray(dataOrg)) return;
  const maxPage = Math.ceil(dataOrg.length / itemPerPage);
  const skipCount = itemPerPage * (page - 1);
  const nextPage = () => {
    if (page < maxPage) {
      setPage((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    if (page >= 2) {
      setPage((prev) => prev - 1);
    }
  };
  const dataPagination = dataOrg.slice(skipCount, skipCount + itemPerPage);

  return {
    page,
    setPage,
    maxPage,
    nextPage,
    prevPage,
    dataPagination,
  };
};

export default usePagination;

import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const TextSalary = ({ salaryMin, salaryMax }) => {
  return (
    <div className="flex gap-2 items-center">
      <FontAwesomeIcon icon={faSackDollar} className="text-blue-500 text-2xl" />
      <p className="text-primary font-bold">
        {new Intl.NumberFormat("de-DE").format(salaryMin / 1000000) +
          " - " +
          new Intl.NumberFormat("de-DE").format(salaryMax / 1000000) +
          " triệu"}
      </p>
    </div>
  );
};

export default TextSalary;

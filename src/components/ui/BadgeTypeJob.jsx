import React from "react";

const BadgeTypeJob = ({ typeJob }) => {
  return (
    <span className="py-1 px-2 text-xs font-bold whitespace-nowrap rounded-full bg-rose-400">
      {typeJob === "FULLTIME" ? "Toàn thời gian" : "Bán thời gian"}
    </span>
  );
};

export default BadgeTypeJob;

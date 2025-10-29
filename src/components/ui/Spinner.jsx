import React from "react";

const Spinner = ({ className = "", size = "md" }) => {
  let sizeClasses = "";

  if (size === "sm") sizeClasses = "w-4 h-4 border-2";
  else if (size === "md") sizeClasses = "w-6 h-6 border-2";
  else if (size === "lg") sizeClasses = "w-10 h-10 border-4";

  return (
    <div
      className={`${sizeClasses} ${className} inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-blue-500 `}
      role="status"
      aria-label="loading"
    />
  );
};

export default Spinner;

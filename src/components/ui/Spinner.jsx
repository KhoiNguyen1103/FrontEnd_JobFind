import clsx from "clsx";

const Spinner = ({ className = "", color = "blue-500", size = "5" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={clsx(
          `w-${size} h-${size} border-2 border-${color} border-t-transparent rounded-full animate-spin`,
          className
        )}
      ></div>
    </div>
  );
};

export default Spinner;

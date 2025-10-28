const Spinner = ({ className = "" }) => {
  return (
    <div
      className={`
      ms-4 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Spinner;

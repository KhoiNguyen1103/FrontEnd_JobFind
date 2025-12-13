const BadgeSalary = ({ salary }) => {
  return (
    <span className="py-1 px-2 text-xs font-bold whitespace-nowrap rounded-full bg-rose-400">
      {new Intl.NumberFormat("de-DE").format(salary[0] / 1000000) +
        " - " +
        new Intl.NumberFormat("de-DE").format(salary[1] / 1000000) +
        " triệu"}
    </span>
  );
};

export default BadgeSalary;

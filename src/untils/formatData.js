const formatData = {
  formatSalary: (salary) => {
    if (typeof salary !== "number") return "";
    const million = salary / 1_000_000;
    return `${+million.toFixed(1)} tr`;
  },
};

export default formatData;

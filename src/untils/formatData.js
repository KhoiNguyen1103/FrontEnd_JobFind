const formatData = {
  formatSalary: (salary) => {
    if (typeof salary !== "number") return "";
    const million = salary / 1_000_000;
    return `${+million.toFixed(1)} tr`;
  },

  formatDate: (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const hasTime = dateString.includes("T") || dateString.includes(" ");

    return (
      `${day}/${month}/${year}` +
      (hasTime ? ` ${hours}:${minutes}:${seconds}` : "")
    );
  },
};

export default formatData;

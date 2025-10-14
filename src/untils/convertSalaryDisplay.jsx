const convertSalaryDisplay = (salaryArray) => {
  return salaryArray.map((value, index, arr) => {
    if (value === "Tất cả") return "Tất cả";
    if (index === 1) return "Dưới 5 triệu"; // 0 -> 5 triệu
    if (value === -1) return `Trên ${arr[index - 1]} triệu`; // Trên 20 triệu
    return `${arr[index - 1]} - ${value} triệu`; // VD: 5 - 10 triệu, 10 - 15 triệu
  });
};

const convertExperienceDisplay = (experienceArray) => {
  return experienceArray.map((value, index, arr) => {
    if (value === "Tất cả") return "Tất cả";
    if (index === 1) return "Chưa có kinh nghiệm";
    if (index === arr.length - 1) return `Trên ${value} năm`; // Trên 5 năm
    return `${value} năm`; // VD: 1 - 2 năm, 2 - 3 năm
  });
};

export { convertSalaryDisplay, convertExperienceDisplay };

// WorkExperience Component
const WorkExperience = () => {
  const experiences = [
    { title: "Product Manager at Acme Inc", period: "2020-Present" },
    { title: "Marketing Manager at Acme Inc", period: "2018-2020" },
    { title: "Marketing Associate at Acme Inc", period: "2016-2018" },
  ];

  return (
    <div className="relative pl-8">
      {" "}
      {/* Container chính cho timeline, thêm padding trái để chứa chấm và đường kẻ */}
      {experiences.map((exp, index) => (
        <div key={index} className="relative mb-6">
          {" "}
          {/* Container cho mỗi mục, thêm margin dưới */}
          {/* Chấm tròn */}
          <div className="absolute left-[-20px] top-[4px] w-3 h-3 bg-[#111811] rounded-full z-10"></div>
          {/* Đường kẻ dọc (không hiển thị cho mục cuối) */}
          {index < experiences.length - 1 && (
            <div className="absolute left-[-14.5px] top-[16px] bottom-[-24px] w-px bg-gray-300"></div>
          )}
          {/* Nội dung */}
          <div className="flex flex-col">
            <p className="text-[#111811] text-base font-medium leading-normal">
              {exp.title}
            </p>
            <p className="text-[#638863] text-base font-normal leading-normal mt-1">
              {" "}
              {/* Thêm margin-top nhỏ */}
              {exp.period}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;

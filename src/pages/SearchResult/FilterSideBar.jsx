import { useState } from "react";

const experience = [
  "Tất cả",
  "Không yêu cầu",
  "Dưới 1 năm",
  "1 năm",
  "2 năm",
  "3 năm",
  "4 năm",
  "5 năm",
  "Trên 5 năm",
];

const position = ["Tất cả", "Nhân viên", "Trưởng nhóm", "Quản lý"];

const workType = ["Bán thời gian", "Toàn thời gian"];

const FilterSideBar = () => {
  const [selectedExperience, setSelectedExperience] = useState("Tất cả");
  const [selectedPosition, setSelectedPosition] = useState("Tất cả");
  const [selectedWorkType, setSelectedWorkType] = useState("Toàn thời gian");

  return (
    <div>
      {/* Kinh nghiệm */}
      <div>
        <p className="text-primary font-bold pb-2">Kinh nghiệm</p>
        <div className="grid grid-cols-2 gap-2">
          {experience.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                className="w-5 h-5"
                value={option}
                checked={selectedExperience === option}
                onChange={(e) => setSelectedExperience(e.target.value)}
              />
              <span className="ps-2">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vị trí */}
      <div className="mt-4">
        <p className="text-primary font-bold pb-2">Vị trí</p>
        <div className="grid grid-cols-2 gap-2">
          {position.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                className="w-5 h-5"
                value={option}
                checked={selectedPosition === option}
                onChange={(e) => setSelectedPosition(e.target.value)}
              />
              <span className="ps-2">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hình thức làm việc */}
      <div className="mt-4">
        <p className="text-primary font-bold pb-2">Hình thức làm việc</p>
        <div className="grid grid-cols-2 gap-2">
          {workType.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                className="w-5 h-5"
                value={option}
                checked={selectedWorkType === option}
                onChange={(e) => setSelectedWorkType(e.target.value)}
              />
              <span className="ps-2">{option}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;

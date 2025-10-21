import { useState } from "react";

// redux
import {
  updateFilterOptions,
  applyAdvancedFilters,
} from "../../redux/slices/jobSlice";
import { useDispatch } from "react-redux";

const filters = [
  {
    id: 1,
    key: "Hình thức làm việc",
    list: [
      { id: 1, name: "Tất cả" },
      { id: 2, name: "Bán thời gian" },
      { id: 3, name: "Toàn thời gian" },
    ],
  },
  {
    id: 2,
    key: "Lương",
    list: [
      { id: 1, name: "Tất cả", value: "" },
      { id: 2, name: "5 triệu", value: "5000000" },
      { id: 3, name: "10 triệu", value: "10000000" },
      { id: 4, name: "15 triệu", value: "15000000" },
      { id: 5, name: "20 triệu", value: "20000000" },
      { id: 6, name: "Trên 20 triệu", value: "20000000+" },
    ],
  },
];

const FilterSideBar = () => {
  const dispatch = useDispatch();
  const [selectedWorkType, setSelectedWorkType] = useState("Tất cả");
  const [selectedSalary, setSelectedSalary] = useState("");

  const handleWorkTypeChange = (value) => {
    setSelectedWorkType(value);
    dispatch(updateFilterOptions({ workType: value }));
    dispatch(applyAdvancedFilters());
  };

  const handleSalaryChange = (value) => {
    setSelectedSalary(value);
    dispatch(updateFilterOptions({ salary: value }));
    dispatch(applyAdvancedFilters());
  };

  return (
    <div>
      {filters.map((f) => (
        <div key={f.id} className="pb-4">
          <p className="text-primary font-bold pb-2">{f.key}</p>
          <div className="grid grid-cols-2 gap-2">
            {f.list.map((option) => (
              <div key={option.id} className="flex items-center cursor-pointer">
                {f.key === "Lương" ? (
                  // Radio button cho Lương
                  <div>
                    <input
                      type="radio"
                      id={`salary-${option.id}`}
                      className="w-4 h-4"
                      value={option.value}
                      checked={selectedSalary === option.value}
                      onChange={() => handleSalaryChange(option.value)}
                    />
                    <label
                      htmlFor={`salary-${option.id}`}
                      className="ps-2 cursor-pointer"
                    >
                      {option.name}
                    </label>
                  </div>
                ) : (
                  // Radio button cho Hình thức làm việc
                  <div>
                    <input
                      type="radio"
                      id={`workType-${option.id}`}
                      className="w-4 h-4"
                      value={option.name}
                      checked={selectedWorkType === option.name}
                      onChange={() => handleWorkTypeChange(option.name)}
                    />
                    <label
                      htmlFor={`workType-${option.id}`}
                      className="ps-2 cursor-pointer"
                    >
                      {option.name}
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSideBar;

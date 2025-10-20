import { useEffect, useState } from "react";
import { filterJob } from "../../redux/slices/jobSlice";
import { useDispatch } from "react-redux";

import filters from "../../data/filters";

const FilterSideBar = () => {
  const dispatch = useDispatch();
  // Lấy lọc theo kinh nghiệm / vị trí / hình thức làm việc
  const filter = filters.filter(
    (f) => f.key === "Vị trí" || f.key === "Hình thức làm việc"
  );

  const [selectedExperience, setSelectedExperience] = useState("Tất cả");
  const [selectedPosition, setSelectedPosition] = useState("Tất cả");
  const [selectedWorkType, setSelectedWorkType] = useState("Tất cả");

  useEffect(() => {
    // console.log(selectedExperience, selectedPosition, selectedWorkType);
  }, [selectedExperience, selectedPosition, selectedWorkType]);

  const handleFilter = (key, value) => {
    if (key === "Kinh nghiệm") {
      setSelectedExperience(value.name);
      dispatch(filterJob({ key, value }));
    }
    // Vị trí
    if (key === 5) {
      setSelectedPosition(value.name);
      dispatch(filterJob({ key, value }));
    }
    // Hình thức làm việc
    if (key === 6) {
      setSelectedWorkType(value.name);
      dispatch(filterJob({ key, value }));
    }
  };

  return (
    <div>
      {filter.map((f) => (
        <div key={f.id} className="pb-4">
          <p className="text-primary font-bold pb-2">{f.key}</p>
          <div className="grid grid-cols-2 gap-2">
            {f.list.map((option) => (
              <div
                key={option.id}
                className="flex items-center cursor-pointer"
                onClick={() => handleFilter(f.id, option)}
              >
                <input
                  type="radio"
                  className="w-5 h-5"
                  value={option.name}
                  checked={
                    f.id === 3
                      ? selectedExperience === option.name
                      : f.id === 5
                      ? selectedPosition === option.name
                      : selectedWorkType === option.name
                  }
                  onChange={() => {}}
                />
                {/* <p>{option.name}</p> */}
                <span className="ps-2">{option.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSideBar;

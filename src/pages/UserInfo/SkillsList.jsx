import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import skillApi from "../../api/skillApi";

const SkillsList = ({ skills, skillMap, isEditMode, onAddSkill, onUpdateSkill }) => {
  const [newSkills, setNewSkills] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillApi.getAll();
        const options = response.map((skill) => ({
          value: skill.skillId,
          label: skill.name,
        }));
        setSkillOptions(options);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách kỹ năng: " + err.message);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills && skillMap.size > 0) {
      setNewSkills(
        skills.map((skillId) => {
          const name = skillMap.get(skillId);
          return {
            value: skillId,
            label: name || `Skill ID: ${skillId}`,
          };
        })
      );
    }
  }, [skills, skillMap]);

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setNewSkills(selectedOptions);
    if (isEditMode) {
      onUpdateSkill(selectedIds);
    }
  };

  const handleAdd = () => {
    if (newSkills.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng!");
      return;
    }
    onAddSkill(newSkills.map((opt) => opt.value));
    setNewSkills([]);
  };

  return (
    <div className="flex flex-wrap gap-3 py-3 pr-4">
      {skills.length === 0 && !isEditMode ? (
        <p className="text-[#111811] text-sm font-normal leading-normal">
          Chưa cập nhật
        </p>
      ) : (
        skills.map((skillId) => {
          const name = skillMap.get(skillId) || `Skill ID: ${skillId}`;
          return (
            <div
              key={skillId}
              className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f4f0] pl-4 pr-4"
            >
              <p className="text-[#111811] text-sm font-medium leading-normal">
                {name}
              </p>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() =>
                    handleMultiSelectChange(
                      newSkills.filter((s) => s.value !== skillId)
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          );
        })
      )}

      {isEditMode && (
        <div className="flex items-center gap-2 w-full">
          <Select
            isMulti
            options={skillOptions}
            value={newSkills}
            onChange={handleMultiSelectChange}
            className="react-select-container w-full"
            classNamePrefix="react-select"
            placeholder="Chọn hoặc gõ kỹ năng..."
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                borderRadius: "0.375rem",
                padding: "0.25rem",
                "&:hover": { borderColor: "#3b82f6" },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#f0f4f0",
                borderRadius: "0.75rem",
              }),
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="w-8 h-8 flex items-center justify-center bg-[#d9ead3] text-[#2d572c] rounded-full font-bold text-xl hover:bg-[#c4dfbd]"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

SkillsList.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.number).isRequired,
  skillMap: PropTypes.instanceOf(Map).isRequired,
  isEditMode: PropTypes.bool,
  onAddSkill: PropTypes.func,
  onUpdateSkill: PropTypes.func,
};

export default SkillsList;
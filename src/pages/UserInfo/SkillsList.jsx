import PropTypes from "prop-types";
import { useState } from "react";

const SkillsList = ({ skills, isEditMode, onAddSkill }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill !== "") {
      onAddSkill({ name: trimmedSkill });
      setNewSkill("");
    }
  };

  return (
    <div className="flex gap-3 py-3 flex-wrap pr-4">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f4f0] pl-4 pr-4"
        >
          <p className="text-[#111811] text-sm font-medium leading-normal">
            {skill.name}
          </p>
        </div>
      ))}

      {isEditMode && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Thêm kỹ năng..."
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={handleAddSkill}
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
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isEditMode: PropTypes.bool,
  onAddSkill: PropTypes.func,
};

export default SkillsList;

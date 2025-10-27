import PropTypes from "prop-types";

const WorkExperience = ({ isEditMode, workExperiences }) => {
  // console.log("experiences", workExperiences);
  // console.log("isEditMode", isEditMode);

  return (
    <div className="relative pl-8">
      {workExperiences.map((exp, index) => (
        <div key={index} className="relative mb-6">
          {/* Chấm tròn */}
          <div className="absolute left-[-20px] top-[4px] w-3 h-3 bg-[#111811] rounded-full z-10"></div>
          {/* Đường kẻ dọc */}
          {index < workExperiences.length - 1 && (
            <div className="absolute left-[-14.5px] top-[16px] bottom-[-24px] w-px bg-gray-300"></div>
          )}

          {/* Nội dung */}
          <div className="flex items-center gap-3 mb-1">
            {/* Logo công ty */}
            {exp.logo && (
              <img
                src={exp.logo}
                alt={exp.companyName}
                className="w-8 h-8 object-contain rounded"
              />
            )}
            <div className="flex flex-col">
              <p className="text-[#111811] text-base font-medium leading-normal">
                {exp.jobTitle}
              </p>
              <p className="text-[#111811] text-sm font-normal leading-normal">
                {exp.companyName}
              </p>
            </div>
          </div>

          <p className="text-[#638863] text-sm font-normal leading-normal mt-1 ml-11">
            {exp.startDate} - {exp.endDate}
          </p>
        </div>
      ))}
    </div>
  );
};

WorkExperience.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  workExperiences: PropTypes.arrayOf(
    PropTypes.shape({
      jobTitle: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      logo: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WorkExperience;

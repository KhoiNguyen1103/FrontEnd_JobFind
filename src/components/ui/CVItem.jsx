import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

// component
import ButtonSaveJobSeeker from "../button/ButtonSaveJobSeeker";

const CVItem = ({ profile }) => {
  const { name, job, experience, salary_min, salary_max, location, education } =
    profile;
  return (
    <div className="flex rounded-md border border-green-600 p-4 bg-white">
      {/* Avatar của job seeker */}
      <div className="w-40 aspect-square flex items-center">
        <img src="https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png" />
      </div>

      <div className="ps-4 grow">
        {/* Thông tin sơ lược CV */}
        <div className="">
          {/* Header item */}
          <div className="flex justify-between items-center pb-4">
            <p className="text-primary font-semibold text-lg">{name}</p>
            <div>
              <ButtonSaveJobSeeker />
              <button type="button" className="cursor-pointer">
                <FontAwesomeIcon icon={faMessage} className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* END: header item */}

          <div className="flex items-center flex-wrap gap-4">
            <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2 ">
              {job}
            </p>
            <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
              {experience} năm
            </p>
            <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
              {salary_min + " - " + salary_max} triệu
            </p>
            <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
              {location}
            </p>
            <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
              {education}
            </p>
          </div>
        </div>
        {/* End: Thông tin sơ lược CV */}

        {/* Button Xem chi tiết - Lưu ứng viên - Chat */}
        <div className="pt-4 flex items-center gap-4">
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer font-semibold w-full"
          >
            Xem chi tiết
          </button>
        </div>
        {/* End: Button Xem chi tiết - Lưu ứng viên - Chat */}
      </div>
    </div>
  );
};
CVItem.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    salary_min: PropTypes.number.isRequired,
    salary_max: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    education: PropTypes.string.isRequired,
  }).isRequired,
};

export default CVItem;

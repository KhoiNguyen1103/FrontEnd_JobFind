import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

// component
import ButtonSaveJobSeeker from "../button/ButtonSaveJobSeeker";
import { Link, useNavigate } from "react-router-dom";

const CVItem = ({ profile }) => {
  const navigate = useNavigate();

  const {
    id,
    name,
    job,
    experience,
    salary_min,
    salary_max,
    location,
    education,
  } = profile;

  const handleClickProfileDetailButton = () => {
    navigate(`/job-seeker-profile/${id}`);
  };

  return (
    <div className="rounded-md border border-green-600 p-4 bg-white">
      {/* Thông tin sơ lược CV */}
      <div className="flex">
        {/* Avatar của job seeker */}
        <div className="w-20 aspect-square flex items-center">
          <img src="https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png" />
        </div>
        {/* END: Avatar của job seeker */}

        {/* block wrap */}
        <div className="grow">
          {/* block wrap */}
          <div className="flex justify-between pb-4">
            {/* Tên job seeker */}
            <p className="text-primary font-semibold text-lg">{name}</p>

            {/* Name + Button save + button chat */}
            <div>
              <ButtonSaveJobSeeker />
              {/* Button chat */}
              <Link to={"/"} className="cursor-pointer">
                <FontAwesomeIcon
                  icon={faMessage}
                  className="h-6 w-6 text-green-600"
                />
              </Link>
            </div>
            {/* END: Nme + Button save + button chat */}
          </div>
          {/* END: block wrap */}

          {/* Ngành nghề */}
          <p className="font-light text-base">{job}</p>
        </div>
        {/* END: block wrap */}
      </div>
      {/* END: thông tin sơ lược */}

      {/* Tag list */}
      <div className="flex items-center flex-wrap gap-4 pt-4">
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
      {/* END: Tag list */}

      {/* Button Xem chi tiết */}
      <div
        className="pt-4 flex items-center gap-4"
        onClick={handleClickProfileDetailButton}
      >
        <button
          type="button"
          className="py-2 px-4 rounded-md bg-primary text-white cursor-pointer font-semibold w-full"
        >
          Xem chi tiết
        </button>
      </div>
      {/* End: Button Xem chi tiết */}
    </div>
  );
};
CVItem.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
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

import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import ButtonSaveJobSeeker from "../button/ButtonSaveJobSeeker";
import { Link, useNavigate } from "react-router-dom";

const CVItem = ({ profile }) => {
  const navigate = useNavigate();

  const {
    profileId,
    firstName,
    lastName,
    address,
    title,
    workExperiences,
    skills,
  } = profile;

  const handleClickProfileDetailButton = () => {
    if (profileId) {
      navigate(`/job-seeker-profile/${profileId}`);
    } else {
      console.error("Profile ID is undefined or invalid");
    }
  };

  return (
    <div className="rounded-md border border-green-600 p-4 bg-white">
      {/* Thông tin sơ lược CV */}
      <div className="flex">
        {/* Avatar của job seeker */}
        <div className="w-20 aspect-square flex items-center">
          <img
            src="https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png"
            alt="Avatar"
          />
        </div>
        {/* END: Avatar của job seeker */}

        {/* Block wrap thông tin */}
        <div className="grow">
          {/* Tên job seeker và các nút action */}
          <div className="flex justify-between pb-2 pt-1">
            <p className="text-primary font-semibold text-lg">{`${firstName} ${lastName}`}</p>
            <div>
              <ButtonSaveJobSeeker profileId={profileId} />
              {/* Button chat */}
              <Link to={"/"} className="cursor-pointer">
                <FontAwesomeIcon
                  icon={faMessage}
                  className="h-6 w-6 text-green-600"
                />
              </Link>
            </div>
          </div>
          {/* Ngành nghề */}
          <p className="font-medium text-base">{title}</p>
        </div>
        {/* END: Block wrap thông tin */}
      </div>
      {/* END: Thông tin sơ lược CV */}

      {/* Tag list (Kinh nghiệm) */}
      <div className="flex items-center flex-wrap gap-4 pt-4">
        <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
          {workExperiences} năm
        </p>
        <p className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2">
          {address}
        </p>
      </div>
      {/* END: Tag list (Kinh nghiệm, Địa chỉ) */}

      {/* Skills list */}
      <div className="pt-4">
        <p className="font-semibold">Kỹ năng:</p>
        <div className="flex flex-wrap gap-4 pt-2">
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill, index) => (
              <p
                key={index}
                className="text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-2"
              >
                {skill.name}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-600">Chưa cập nhật</p>
          )}
        </div>
      </div>
      {/* END: Skills list */}

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
    </div>
  );
};

CVItem.propTypes = {
  profile: PropTypes.shape({
    profileId: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    workExperiences: PropTypes.number.isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired
};

export default CVItem;

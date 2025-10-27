import { faMessage, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import ButtonSaveJobSeeker from "../button/ButtonSaveJobSeeker";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { openChatBox } from '../../redux/slices/chatBoxSlice';

const CVItem = ({ profile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    profileId,
    userId,
    firstName,
    lastName,
    address,
    avatar,
    birthDay,
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

  const handleOpenChat = () => {
    const displayName = `${firstName} ${lastName}`;
    dispatch(openChatBox({ profileId, userId, displayName }));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={
            avatar && avatar.trim() !== ""
              ? avatar
              : "https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png"
          }
          alt="Avatar"
          className="w-20 h-20 rounded-full border object-cover"
        />

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {`${firstName} ${lastName}`}
              </p>
              <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              <ButtonSaveJobSeeker profileId={profileId} />
              <button
                onClick={handleOpenChat}
                className="text-green-600 hover:text-green-700"
              >
                <FontAwesomeIcon icon={faMessage} className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600">
            <span className="bg-slate-100 px-3 py-1 rounded-full">
              {workExperiences} năm kinh nghiệm
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">
              {address}
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">
              {new Date(profile.birthDay).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4">
        <p className="font-semibold text-gray-700 mb-2">Kỹ năng:</p>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">Chưa cập nhật</span>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleClickProfileDetailButton}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faEye} />
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
  }).isRequired,
};

export default CVItem;

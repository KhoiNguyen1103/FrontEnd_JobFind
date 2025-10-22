import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { saveJobseeker, unsaveJobseeker } from "../../redux/slices/savedJobseekerSlice";

const ButtonSaveJobSeeker = ({ profileId }) => {
  const dispatch = useDispatch();
  const savedJobSeekers = useSelector(state => state.savedJobseeker.savedList);

  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const companyId = userObject.userId;

  const isSave = savedJobSeekers.some(item => item.profileId === profileId);

  const handleSaveClick = () => {
    if (isSave) {
      dispatch(unsaveJobseeker({ profileId, companyId }));
    } else {
      dispatch(saveJobseeker({ profileId, companyId }));
    }
  };

  return (
    <button
      type="button"
      className="cursor-pointer pe-4 transition-all duration-300"
      onClick={handleSaveClick}
    >
      <FontAwesomeIcon
        icon={isSave ? faHeartSolid : faHeart}
        className="h-6 w-6 text-green-600"
      />
    </button>
  );
};

export default ButtonSaveJobSeeker;

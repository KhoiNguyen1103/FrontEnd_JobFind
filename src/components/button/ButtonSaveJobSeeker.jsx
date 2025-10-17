import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonSaveJobSeeker = () => {
  return (
    <button type="button" className="cursor-pointer pe-4">
      <FontAwesomeIcon icon={faHeart} className="h-6 w-6" />
    </button>
  );
};

export default ButtonSaveJobSeeker;

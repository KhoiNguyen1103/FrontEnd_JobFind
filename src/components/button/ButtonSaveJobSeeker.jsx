import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import savedJobSeekerApi from "../../api/savedJobSeekerApi"; 

const ButtonSaveJobSeeker = ({ profileId, savedJobSeekers }) => {
  const [isSave, setIsSave] = useState(false);
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const companyId = userObject.userId;

  useEffect(() => {
    setIsSave(savedJobSeekers.includes(profileId));
  }, [savedJobSeekers, profileId]);

  const handleSaveClick = async () => {
    try {
      if (isSave) {
        await savedJobSeekerApi.unsave(profileId, companyId); 
      } else {
        await savedJobSeekerApi.save(profileId, companyId); 
      }

      setIsSave((prev) => !prev);
    } catch (error) {
      console.error("Failed to save job seeker", error);
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

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ButtonSaveJobSeeker = () => {
  // Lấy id user để call api lưu profile
  // const { id } = prop;
  // console.log(id);

  const [isSave, setIsSave] = useState(false);
  const handleSaveClick = () => {
    setIsSave(!isSave);
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

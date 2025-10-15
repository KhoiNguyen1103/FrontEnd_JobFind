import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";

// redux
import { useDispatch, useSelector } from "react-redux";
import { likeJob } from "../../redux/slices/jobSlice";

// toastify
import { toast } from "react-toastify";

const ButtonSave = ({ job }) => {
  const dispatch = useDispatch();
  // console.log(job);

  // Lấy user
  const storedUser = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage nếu có
  const user = useSelector((state) => state.auths.user) || storedUser;

  const [isHeart, setIsHeart] = useState(false);
  const handleHeartClick = () => {
    if (user) {
      setIsHeart(!isHeart);
      dispatch(likeJob(job));
    } else {
      toast.error("Vui lòng đăng nhập để lưu công việc");
    }
    // console.log(job);
  };

  return (
    <div
      className={`rounded-full border border-slate-300 p-4 cursor-pointer flex justify-center items-center border-primary active:opacity-30`}
      style={{ width: "20px", height: "20px" }}
      onClick={handleHeartClick}
    >
      <FontAwesomeIcon
        icon={isHeart ? faHeart : faHeartRegular}
        className="text-lg text-primary"
      />
    </div>
  );
};

ButtonSave.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    salary: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default ButtonSave;

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { saveJobseeker, unsaveJobseeker } from "../../redux/slices/savedJobseekerSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ButtonSaveJobSeeker = ({ profileId }) => {
  const dispatch = useDispatch();
  const savedJobSeekers = useSelector(state => state.savedJobseeker.savedList);
  const [isSaved, setIsSaved] = useState(false);

  const user = localStorage.getItem("user");
  const userObject = user ? JSON.parse(user) : null;
  const companyId = userObject?.userId;

  const numericProfileId = Number(profileId);

  useEffect(() => {
    const saved = savedJobSeekers.some(item => item.profileId === numericProfileId);
    setIsSaved(saved);
  }, [savedJobSeekers, numericProfileId]);

  const handleSaveClick = () => {
    if (!companyId) {
      console.error("No companyId found in localStorage");
      return;
    }

    setIsSaved(!isSaved);

    if (isSaved) {
      dispatch(unsaveJobseeker({ profileId: numericProfileId, companyId }));
      toast.success("Đã bỏ lưu thành công!", { autoClose: 500 });

    } else {
      dispatch(saveJobseeker({ profileId: numericProfileId, companyId }));
      toast.success("Lưu thành công!", { autoClose: 500 });

    }
  };

  return (
    <button
      type="button"
      className="cursor-pointer pe-4 transition-all duration-300"
      onClick={handleSaveClick}
    >
      <FontAwesomeIcon
        icon={isSaved ? faHeartSolid : faHeart}
        className="h-6 w-6 text-green-600 hover:text-green-700"
      />
    </button>
  );
};

export default ButtonSaveJobSeeker;
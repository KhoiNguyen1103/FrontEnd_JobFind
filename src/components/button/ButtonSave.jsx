import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

// redux
import { useDispatch, useSelector } from "react-redux";
import { likeJob } from "../../redux/slices/jobSlice";

// toastify
import { toast } from "react-toastify";

// service
import { saveJob, unSaveJob } from "../../services/saveJob";
import { removeSavedJob } from "../../redux/slices/savedJobSlice";

const ButtonSave = ({ job }) => {
  // console.log("Job: ", job);
  const dispatch = useDispatch();
  //Lấy danh sách savedJobs từ redux
  const savedJobs = useSelector((state) => state.savedJob.savedJobs);
  // console.log("savedJobs", savedJobs);

  // Lấy user
  const storedUser = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage nếu có
  const user = useSelector((state) => state.auth.user) || storedUser;

  const [isHeart, setIsHeart] = useState(false);

  // Kiểm tra xem job đã được lưu hay chưa
  useEffect(() => {
    const isJobSaved = savedJobs?.some(
      (savedJob) => savedJob.jobId === job.jobId
    );
    setIsHeart(isJobSaved);
  }, [savedJobs, job.jobId]);

  // Xử lý lưu job
  const handleHeartClick = async () => {
    if (user) {
      if (isHeart) {
        try {
          // Call unsaveJob API với jobId và jobSeekerId
          await unSaveJob(job.jobId);
          dispatch(removeSavedJob(job.jobId)); // Dispatch redux action nếu cần
          toast.success("Đã bỏ lưu công việc thành công!", { autoClose: 500 });
        } catch (error) {
          console.error("Lỗi khi bỏ lưu công việc:", error);
          toast.error("Có lỗi xảy ra khi bỏ lưu công việc.", {
            autoClose: 500,
          });
        }
        return;
      }
      try {
        // Call saveJob API với jobId và jobSeekerId
        const response = await saveJob(job.jobId);

        if (response) {
          setIsHeart(!isHeart);
          dispatch(likeJob(job)); // Dispatch redux action nếu cần
          toast.success("Đã lưu công việc thành công!", { autoClose: 500 });
        }
      } catch (error) {
        console.error("Lỗi khi lưu công việc:", error);
        toast.error("Có lỗi xảy ra khi lưu công việc.", { autoClose: 500 });
      }
    } else {
      toast.error("Vui lòng đăng nhập để lưu công việc", { autoClose: 500 });
    }
  };

  return (
    <div
      className={`rounded-full ms-4 border border-slate-300 p-4 cursor-pointer flex justify-center items-center border-primary active:opacity-30`}
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
  job: jobPropTypes,
};

export default ButtonSave;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// redux
// import { useDispatch } from "react-redux";
// import { removeSavedJob } from "../../redux/slices/savedJobSlice";

// proptypes
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import PropTyes from "prop-types";
import savedJobApi from "../../api/savedJobApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeSavedJob } from "../../redux/slices/savedJobSlice";

const ButtonUnsaved = ({ job }) => {
  const dispatch = useDispatch();
  const handleUnSaveJob = async () => {
    // Call API to unsave job
    try {
      await savedJobApi.unsave(job.jobId);
      dispatch(removeSavedJob(job.jobId));
      toast.success("Bỏ lưu job thành công", { autoClose: 1000 });
    } catch (error) {
      toast.error("Lỗi khi bỏ lưu job");
      console.error("Lỗi khi bỏ lưu job:", error);
    }
  };

  return (
    <div
      className="py-1 px-2 ms-4 rounded-md bg-slate-200 font-sm flex justify-between items-center cursor-pointer"
      onClick={handleUnSaveJob}
    >
      <FontAwesomeIcon icon={faTrash} />
      <p className="ps-2 whitespace-nowrap">Bỏ lưu</p>
    </div>
  );
};

ButtonUnsaved.propTypes = {
  handleUnSaveJob: PropTyes.func,
  job: jobPropTypes,
};

export default ButtonUnsaved;

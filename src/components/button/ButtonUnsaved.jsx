import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// redux
import { useDispatch } from "react-redux";
import { removeSavedJob } from "../../redux/slices/savedJobSlice";

// proptypes
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

import PropTyes from "prop-types";

const ButtonUnsaved = ({ job }) => {
  const dispatch = useDispatch();
  const handleUnSaveJob = () => {
    dispatch(removeSavedJob(job.saved_job_id));
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

import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import ApplyModal from "../ui/ModalApply";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ButtonApply = ({ jobId, job }) => {
  // console.log("jobId: ", jobId);
  const jobsApplied = useSelector((state) => state.application.list);
  const [showModal, setShowModal] = useState(false);
  const [applicationList, setApplicationList] = useState([]);
  const navigate = useNavigate();

  const isApply = jobsApplied.some((job) => {
    return job.job.jobId === jobId;
  });

  const handleClick = () => {
    if (isApply) {
      navigate("/job-applied");
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        className="py-1 px-2 justify-center active:opacity-80 rounded-md bg-primary text-white font-sm cursor-pointer flex items-center w-full h-full"
        onClick={handleClick}
      >
        {isApply ? (
          <div className="flex items-center">
            <p className="px-4">Đang ứng tuyển </p>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} className="pe-4" />
            <p className="ps-2">Ứng tuyển</p>
          </>
        )}
      </div>

      {showModal && (
        <ApplyModal
          onClose={() => setShowModal(false)}
          applicationList={applicationList} // truyền danh sách hồ sơ ứng tuyển vào nếu cần
          jobId={jobId} // truyền jobId vào modal nếu cần
        />
      )}
    </>
  );
};

ButtonApply.propTypes = {
  jobId: PropTypes.number.isRequired,
};

export default ButtonApply;

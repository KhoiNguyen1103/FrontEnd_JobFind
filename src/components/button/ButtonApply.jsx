import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCalendarAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApplicationModalJSK from "../Menu/ApplicationModalJSK";
import ApplyModal from "../ui/ModalApply";
import { use } from "react";

const ButtonApply = ({ jobId, job }) => {
  // console.log("jobId: ", jobId);
  const navigate = useNavigate();

  // load data từ redux vaf localstorage
  const jobsApplied = useSelector((state) => state.application.list);
  const user = useSelector((state) => state.auth.user);

  // state
  const [showModal, setShowModal] = useState(false);
  const [applicationList, setApplicationList] = useState([]);
  const [isModalApplicationJSKOpen, setIsModalApplicationJSKOpen] =
    useState(false);

  const isApply = jobsApplied.some((job) => {
    return job.job.jobId === jobId;
  });

  const applicationIdSelected = jobsApplied.find((job) => {
    return job.job.jobId === jobId;
  });

  const handleClick = () => {
    if (isApply) {
      // Hiện modal trạng thái ứng tuyển
      setIsModalApplicationJSKOpen(true);
    } else {
      if (!user) {
        toast.error("Vui lòng đăng nhập để ứng tuyển.", { autoClose: 2000 });
        return;
      }
      setShowModal(true);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "INTERVIEWING":
        return "Đang phỏng vấn";
      case "PENDING":
        return "Đang chờ";
      case "HIRED":
        return "Đã thuê";
      case "REJECTED":
        return "Đã từ chối";
      case "REVIEWING":
        return "Đang xem xét";
      case "SHORTLISTED":
        return "Danh sách sơ tuyển";
      default:
        return status;
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
            <p className="px-4">Xem tình trạng ứng tuyển </p>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} className="pe-4" />
            <p className="ps-2">Ứng tuyển</p>
          </>
        )}
      </div>
      {isModalApplicationJSKOpen && (
        <ApplicationModalJSK
          isOpen={isModalApplicationJSKOpen}
          onClose={() => setIsModalApplicationJSKOpen(false)}
          applicationId={
            applicationIdSelected ? applicationIdSelected.applicationId : null
          }
          getStatusColor={(status) => {
            switch (status) {
              case "INTERVIEWING":
                return "bg-blue-300";
              case "PENDING":
                return "bg-yellow-300";
              case "HIRED":
                return "bg-green-200";
              case "REJECTED":
                return "bg-red-300";
              case "REVIEWING":
                return "bg-pink-300";
              default:
                return "bg-gray-300";
            }
          }}
          getStatusIcon={() => faCalendarAlt}
          getStatusText={getStatusText}
          getAvailableStatuses={(currentStatus) => {
            const statuses = [
              "PENDING",
              "REVIEWING",
              "INTERVIEWING",
              "HIRED",
              "REJECTED",
            ];
            return statuses.filter((status) => status !== currentStatus);
          }}
          formatDate={(date) => new Date(date).toLocaleDateString("vi-VN")}
          formatDateTime={(date) =>
            new Date(date).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })
          }
          calculateDuration={(start, end) => {
            const startDate = new Date(start);
            const endDate = end ? new Date(end) : new Date();
            const months =
              (endDate.getFullYear() - startDate.getFullYear()) * 12 +
              (endDate.getMonth() - startDate.getMonth());
            return months > 0 ? `${months} tháng` : "Dưới 1 tháng";
          }}
        />
      )}

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

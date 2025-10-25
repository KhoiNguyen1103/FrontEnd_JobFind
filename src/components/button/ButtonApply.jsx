import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ApplyModal from "../ui/ModalApply";
import applicationApi from "../../api/applicationApi";
import { toast } from "react-toastify";

const ButtonApply = ({ isApply }) => {
  const [showModal, setShowModal] = useState(false);
  const [applicationList, setApplicationList] = useState([]);

  // const handleOpenModal = async () => {
  //   try {
  //     const response = await applicationApi.getApplicationOfJob(jobId);
  //     setApplicationList(response?.data || []);
  //   } catch (error) {
  //     toast.error("Đã có lỗi xảy ra khi lấy danh sách hồ sơ ứng tuyển.");
  //   } finally {
  //     setShowModal(true);
  //   }
  // };

  return (
    <>
      <div className="py-1 px-2 justify-center active:opacity-80 rounded-md bg-primary text-white font-sm cursor-pointer flex items-center w-full h-full">
        {isApply ? (
          <p className="ps-2">Đang ứng tuyển</p>
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
          // jobId={jobId}
        />
      )}
    </>
  );
};

ButtonApply.propTypes = {
  isApply: PropTypes.bool.isRequired,
};

export default ButtonApply;

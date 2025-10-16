import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ApplyModal from "../ui/ModalApply";

const ButtonApply = ({ isApply }) => {
  const [showModal, setShowModal] = useState(false);

  // test

  return (
    <>
      <div
        className="py-1 px-2 justify-center active:opacity-80 rounded-md bg-primary text-white font-sm cursor-pointer flex items-center w-full h-full"
        onClick={() => setShowModal(true)} // Khi click thì mở modal
      >
        {isApply ? (
          <p className="ps-2">Đang ứng tuyển</p>
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} className="pe-4" />
            <p className="ps-2">Ứng tuyển</p>
          </>
        )}
        {/* <p className="ps-2">Ứng tuyển</p> */}
      </div>
      {showModal && <ApplyModal onClose={() => setShowModal(false)} />}{" "}
      {/* Modal */}
    </>
  );
};
ButtonApply.propTypes = {
  isApply: PropTypes.bool.isRequired,
};

export default ButtonApply;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import PropTyes from "prop-types";

const ButtonUnsaved = ({ handleUnSaveJob }) => {
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
};

export default ButtonUnsaved;

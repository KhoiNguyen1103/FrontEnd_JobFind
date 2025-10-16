import PropTypes from "prop-types";
import { useRef, useState } from "react";

// redux
import { useDispatch } from "react-redux";
import { submitCV } from "../../redux/slices/cvSlice";

// utils
import selectFile from "../../untils/handleUpLoadFile";

const ApplyModal = ({ onClose }) => {
  // Lấy danh sách cv hiện có
  // const cvList = useSelector((state) => state.cv.cvList);
  const [selectedCV, setSelectedCV] = useState(null);

  const fileInputRef = useRef(null);

  // Khi click vào button chọn cv thì mở popup chọn file lên
  const handleButtonSelectFile = () => {
    fileInputRef.current.click();
  };

  // Khi chọn được file thì lưu vào state
  const handleUploadFile = (event) => {
    const file = selectFile(event);
    setSelectedCV(file);
  };

  // khi click nộp hồ sơ
  const handleSubmit = () => {
    dispatch(submitCV());
    onClose();
  };

  // test
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-1/2 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-white text-center bg-primary rounded-t-lg p-4">
          Ứng tuyển
        </h2>

        {/* Tải CV lên từ máy tính */}
        <div className="mt-4 border rounded-lg p-4 mx-4 flex flex-col justify-center">
          <label className="flex gap-2">
            <input type="radio" name="cvOption" defaultChecked />
            <p className="text-center text-xl text-slate-700 grow">
              Tải lên CV từ máy tính
            </p>
          </label>
          <p className="font-light text-slate-500 text-center ps-4">
            Hỗ trợ định dạng .pdf, .doc
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleUploadFile}
            hidden
          />
          {/* button chọn cv */}
          <button
            onClick={handleButtonSelectFile}
            className="mt-2 px-4 py-2 bg-slate-300 hover:bg-green-500 text-white rounded-lg mx-auto"
          >
            Chọn CV
          </button>

          {/* Hiển thị tên file */}
          {selectedCV && (
            <p className="text-center text-blue-600 mt-2 hover:underline cursor-pointer">
              {selectedCV.name}
            </p>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4 mt-4 pb-4 px-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Nộp hồ sơ ứng tuyển
          </button>
        </div>
      </div>
    </div>
  );
};
ApplyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ApplyModal;

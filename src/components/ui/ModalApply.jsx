import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitCV } from "../../redux/slices/cvSlice";
import selectFile from "../../untils/handleUpLoadFile";
import applicationApi from "../../api/applicationApi";
import { toast } from "react-toastify";
import { addApplication } from "../../redux/slices/applySlice";

const ApplyModal = ({ onClose, jobId }) => {
  const dispatch = useDispatch();
  const jobSeekerKer = useSelector((state) => state.jobSeekerProfile.profile);
  const user = useSelector((state) => state.auth.user);
  const selectedJob = useSelector((state) => state.jobs.selectedJob);
  // console.log("user: ", user);
  // console.log("selected job: ", selectedJob);

  const fileInputRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("upload"); // 'upload' hoặc 'existing'
  const [selectedCV, setSelectedCV] = useState(null); // File hoặc CV object

  const handleUploadFile = (event) => {
    const file = selectFile(event);
    setSelectedCV(file);
  };

  const handleButtonSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectExistingCV = (cv) => {
    setSelectedCV(cv);
  };

  const handleSubmit = async () => {
    console.log("CV đã chọn:", selectedCV);
    // Gọi submitCV với dữ liệu phù hợp
    // dispatch(submitCV(selectedCV));
    // onClose();

    try {
      if (!user) {
        toast.error("Vui lòng đăng nhập để ứng tuyển.");
        return;
      }

      if (!selectedJob && !jobId) {
        toast.error("Vui lòng chọn một công việc để ứng tuyển.");
        return;
      }

      const response = await applicationApi.applyForJob({
        jobId: jobId || selectedJob?.jobId,
        jobSeekerProfileId: user?.id,
        resumeId: selectedCV?.resumeId || null,
      });
      console.log("response: ", response);
      toast.success("Nộp hồ sơ ứng tuyển thành công!");
      // dispatch(addApplication(response)); // Cập nhật danh sách ứng tuyển trong Redux
      window.location.reload(); // Tải lại trang để cập nhật danh sách ứng tuyển
      onClose(); // Đóng modal sau khi nộp hồ sơ thành công
    } catch (error) {
      toast.error("Đã có lỗi xảy ra trong quá trình nộp hồ sơ ứng tuyển.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-1/2 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-white text-center bg-primary rounded-t-lg p-4">
          Ứng tuyển
        </h2>

        {/* ==== CHỌN TỪ FILE ==== */}
        <div className="mt-4 border rounded-lg p-4 mx-4">
          <label className="flex gap-2">
            <input
              type="radio"
              name="cvOption"
              value="upload"
              checked={selectedOption === "upload"}
              onChange={() => {
                setSelectedOption("upload");
                setSelectedCV(null);
              }}
            />
            <p className="text-xl text-slate-700 grow cursor-pointer">
              Tải lên CV từ máy tính
            </p>
          </label>
          {selectedOption === "upload" && (
            <>
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
              <div className="flex justify-center items-center">
                <button
                  onClick={handleButtonSelectFile}
                  className="mt-2 px-4 py-2 bg-slate-300 hover:bg-green-500 text-white rounded-lg mx-auto"
                >
                  Chọn CV
                </button>
              </div>
              {selectedCV && selectedCV.name && (
                <p className="text-center text-blue-600 mt-2 hover:underline cursor-pointer">
                  {selectedCV.name}
                </p>
              )}
            </>
          )}
        </div>

        {/* ==== CHỌN TỪ DANH SÁCH CÓ SẴN ==== */}
        <div className="mt-4 border rounded-lg p-4 mx-4">
          <label className="flex gap-2">
            <input
              type="radio"
              name="cvOption"
              value="existing"
              checked={selectedOption === "existing"}
              onChange={() => {
                setSelectedOption("existing");
                setSelectedCV(null);
              }}
            />
            <p className="text-xl text-slate-700 grow cursor-pointer">
              Chọn CV từ danh sách đã lưu
            </p>
          </label>
          {selectedOption === "existing" && (
            <div className="mt-2 space-y-2">
              {(jobSeekerKer?.resumeList || []).map((cv) => (
                <div
                  key={cv.resumeId}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedCV?.resumeId === cv.resumeId
                      ? "bg-green-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectExistingCV(cv)}
                >
                  📄 {cv.resumeName || "CV chưa đặt tên"}
                </div>
              ))}
              {jobSeekerKer?.resumeList?.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Không có CV nào được lưu.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ===== Nút hành động ===== */}
        <div className="flex justify-end gap-4 mt-4 pb-4 px-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedCV}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedCV
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
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

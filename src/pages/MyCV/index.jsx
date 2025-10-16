import { useRef } from "react";
import { FaUpload } from "react-icons/fa";

// redux
import { useDispatch, useSelector } from "react-redux";
import { addCV } from "../../redux/slices/cvSlice";

const MyCV = () => {
  const dispatch = useDispatch();
  const { cvList } = useSelector((state) => state.cv);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Chỉ hỗ trợ upload file .pdf, .doc, .docx!");
        return;
      }

      // Lưu file vào Redux
      dispatch(addCV(selectedFile));
    }
  };

  // Hàm kích hoạt hộp thoại chọn file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mx-auto py-4">
      {/* CV đã tải lên */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">CV đã tải lên FindJob</h2>

          {/* input file ẩn */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />

          <button
            onClick={handleButtonClick}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaUpload /> Tải CV lên
          </button>
        </div>

        <div className="pt-6">
          {cvList.length > 0 ? (
            <ul>
              {cvList.map((cv, index) => (
                <li
                  key={index}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  📄 <strong>{cv.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <img src="/image_cv.webp" className="mx-auto" />
              <p className="text-center pt-4 text-slate-700">
                Bạn chưa tải lên CV nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCV;

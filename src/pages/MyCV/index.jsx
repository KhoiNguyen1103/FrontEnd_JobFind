import { useRef, useState } from "react";
import { FaPlus, FaUpload } from "react-icons/fa";

const MyCV = () => {
  const [file, setFile] = useState(null);
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
      setFile(selectedFile);
    }
  };

  // Hàm kích hoạt hộp thoại chọn file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Hàm download file
  const handleDownload = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(fileURL); // Giải phóng bộ nhớ
    }
  };

  return (
    <div className="">
      <div className="container mx-auto py-4">
        {/* CV đã tạo trên FindJob */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">CV đã tạo trên TopCV</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaPlus /> Tạo mới
            </button>
          </div>
          <div className="pt-6">
            <img src="/image_cv.webp" className="mx-auto" />
            <p className="text-center pt-4 text-slate-700">
              Bạn chưa có CV nào
            </p>
          </div>
        </div>
        {/* end: CV đã tạo trên FindJob */}

        {/* CV đã tải lên FindJob */}
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

            {/* button mở hộp thoại chọn file */}
            <button
              onClick={handleButtonClick}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaUpload /> Tải CV lên
            </button>
          </div>

          <div className="pt-6">
            {file ? (
              <div className="mt-3">
                <p
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={handleDownload}
                >
                  📄 <strong>{file.name}</strong>
                </p>
              </div>
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
    </div>
  );
};

export default MyCV;

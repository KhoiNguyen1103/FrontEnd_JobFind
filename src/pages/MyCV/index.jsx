import { FaPlus, FaUpload } from "react-icons/fa";

const MyCV = () => {
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

        {/* CV đã tạo trên FindJob */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">CV đã tải lên FindJob</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaUpload /> Tải CV lên
            </button>
          </div>
          <div className="pt-6">
            <img src="/image_cv.webp" className="mx-auto" />
            <p className="text-center pt-4 text-slate-700">
              Bạn chưa tải lên CV nào
            </p>
          </div>
        </div>
        {/* end: CV đã tạo trên FindJob */}
      </div>
    </div>
  );
};

export default MyCV;

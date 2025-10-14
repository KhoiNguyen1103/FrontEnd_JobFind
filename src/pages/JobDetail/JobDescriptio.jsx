import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const tags = [
  "Bán hàng",
  "Marketing",
  "Kinh doanh",
  "Tư vấn",
  "Nhân sự",
  "IT",
  "Thực tập",
  "Hành chính",
  "Tài chính",
  "Quản lý",
  "Khác",
];

const JobDescription = () => {
  return (
    <div className="p-4 rounded-lg bg-white mt-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary py-4 px-1 me-2"></div>
          <p className="font-bold text-lg">Chi tiết tin tuyển dụng</p>
        </div>
        <button className="border rounded-lg border-primary py-2 px-4 text-primary font-bold">
          <FontAwesomeIcon icon={faBell} className="pe-4" />
          <Link to="#">Gửi tôi việc làm tương tự</Link>
        </button>
      </div>
      {/* End: Header */}

      {/* Tag list */}
      <div className="flex flex-wrap w-3/5">
        {tags.map((tag, index) => (
          <Link
            to="#"
            key={index}
            className="bg-gray-200 rounded-full me-2 mt-4 px-2 py-1 hover:opacity-50"
          >
            {tag}
          </Link>
        ))}
      </div>
      {/* end: tag list */}

      {/* Mô tả công việc */}
      <div className="pt-4">
        <p className="font-bold">Mô tả công việc</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Yêu cầu ứng viên */}
      <div className="pt-4">
        <p className="font-bold">Yêu cầu ứng viên</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Thu nhập */}
      <div className="pt-4">
        <p className="font-bold">Thu nhập</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Quyền lợi */}
      <div className="pt-4">
        <p className="font-bold">Quyền lợi</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Địa điểm */}
      <div className="pt-4">
        <p className="font-bold">Địa điểm</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Nút Ứng tuyển  */}
      <button className="mt-4">
        <Link
          to="#"
          className="bg-primary rounded-lg py-2 px-4 text-white font-bold"
        >
          Ứng tuyển ngay
        </Link>
      </button>

      {/* Lưu tin  */}
      <button className="mt-4 ms-4">
        <Link
          to="#"
          className="border-primary text-primary rounded-lg py-2 px-8"
        >
          Lưu tin
        </Link>
      </button>

      {/* Việc làm liên quan */}
      <div className="mt-8">
        <div className="flex items-center">
          <div className="bg-primary py-4 px-1 me-2"></div>
          <p className="font-bold text-lg">Việc làm liên quan</p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;

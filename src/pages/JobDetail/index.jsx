import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import JobInfo from "./JobInfo";

const JobDetail = () => {
  return (
    <div className="py-4" style={{ background: "#f5f5f5" }}>
      <div className="container mx-auto">
        {/* Đường dẫn */}
        <div>
          <Link to="/" className="text-primary font-bold">
            Trang chủ
          </Link>
          <Link to="/">
            {" "}
            <FontAwesomeIcon icon={faAngleRight} />{" "}
          </Link>
          <Link to="/" className="text-primary font-bold">
            Gợi ý công việc tốt nhất
          </Link>
          <Link to="/">
            {" "}
            <FontAwesomeIcon icon={faAngleRight} />{" "}
          </Link>
          <span>Giám sát bán hàng/Sale Supervisior</span>
        </div>
        {/* end: Đường dẫn */}

        {/* Body */}
        <div className="flex justify-between pt-6">
          {/* Thông tin job - mô tả công việc */}
          <div className="p-4 rounded-lg bg-white " style={{ width: "70%" }}>
            <JobInfo />
          </div>

          {/* Thông tin chung - thông tin công ty */}
          <div className="ms-6" style={{ width: "30%" }}>
            Been phai
          </div>
        </div>
        {/* End: body */}
      </div>
    </div>
  );
};

export default JobDetail;

import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import JobInfo from "./JobInfo";
import JobDescription from "./JobDescriptio";
import JobItemv2 from "../../components/ui/JobItemv2";
import InfoCompany from "./InfoCompany";
import { useSelector } from "react-redux";

// test công việc liên quan
// import jobs from '../../data/jobs'

const JobDetail = () => {
  // Lấy dữ liệu từ job truyền qua navigate
  const location = useLocation();
  const job = location.state;

  // Lấy danh sách job liên quan
  const relatedJobs = useSelector((state) => state.jobs.relatedJobs);

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
          <span>{job.title}</span>
        </div>
        {/* end: Đường dẫn */}

        {/* Body */}
        <div className="flex justify-between pt-6">
          {/* Thông tin job - mô tả công việc */}
          <div style={{ width: "70%" }}>
            <JobInfo job={job} />
            <JobDescription job={job} />

            {/* Công việc liên quan */}
            <div className="bg-white p-4 mt-4">
              {relatedJobs.map((job) => (
                <JobItemv2 key={job.title} job={job} iconHeart={true} />
              ))}
            </div>
          </div>

          {/* Thông tin chung - thông tin công ty */}
          <div className="ms-6" style={{ width: "30%" }}>
            <InfoCompany job={job} />
          </div>
          {/* End: body */}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

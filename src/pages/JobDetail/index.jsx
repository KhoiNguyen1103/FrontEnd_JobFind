import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import JobInfo from "./JobInfo";
import JobDescription from "./JobDescriptio";
import JobItem from "./RelatedJobItem";
import InfoCompany from "./InfoCompany";
import { useSelector } from "react-redux";

const JobDetail = () => {
  // Lấy dữ liệu từ job truyền qua navigate
  const location = useLocation();
  const job = location.state;
  // console.log(job);

  // Lấy danh sách job liên quan
  const relatedJobs = useSelector((state) => state.jobs.relatedJobs);
  // const dispatch = useDispatch();
  // dispatch(relatedJob({ category: job.category }));
  // const jobs = useSelector((state) => state.jobs.filterJobs);

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
            <JobDescription />

            {/* Công việc liên quan */}
            <div className="bg-white p-4 mt-4">
              {relatedJobs.map((job) => (
                <JobItem key={job.title} job={job} />
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

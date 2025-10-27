import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import JobInfo from "./JobInfo";
import JobDescription from "./JobDescription";
import JobItemv2 from "../../components/ui/JobItemv2";
import InfoCompany from "./InfoCompany";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// test công việc liên quan
// import jobs from '../../data/jobs'

// call api
import { getJobById } from "../../services/Job";

const JobDetail = () => {
  // Lấy dữ liệu từ job truyền qua navigate
  // const location = useLocation();
  // const job = location.state;

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const jobId = parseInt(queryParams.get("id"), 10);

  const [job, setJob] = useState(null);

  // call api
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết job:", error);
      }
    };

    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

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
          <span>{job ? job.title : <div className="flex justify-center items-center mt-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>}</span>
        </div>
        {/* end: Đường dẫn */}

        {/* Body */}
        <div className="flex justify-between pt-6">
          {/* Thông tin job - mô tả công việc */}
          <div style={{ width: "70%" }}>
            {job ? (
              <>
                <JobInfo job={job} />
                <JobDescription job={job} />

                {/* Công việc liên quan */}
                <div className="bg-white p-4 mt-4">
                  {relatedJobs.map((relatedJob) => (
                    <JobItemv2
                      key={relatedJob.title}
                      job={relatedJob}
                      iconHeart={true}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div>Đang tải...</div>
            )}
          </div>

          {/* Thông tin chung - thông tin công ty */}
          <div className="ms-6" style={{ width: "30%" }}>
            {job ? <InfoCompany job={job} /> : <div>Đang tải...</div>}
          </div>
          {/* End: body */}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

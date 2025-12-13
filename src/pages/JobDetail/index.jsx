import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import InfoCompany from "./InfoCompany";
import JobItemv2 from "../../components/ui/JobItemv2";
import JobInfo from "./JobInfo";
import jobApi from "../../api/jobApi";
import JobItemv3 from "../../components/ui/JobItemv3";

const JobDetail = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const jobId = parseInt(queryParams.get("id"), 10);

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelativeJobs] = useState([]);

  // call api
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const data = await jobApi.getById(jobId);
        setJob(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết job:", error);
      }
    };

    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        const response = await jobApi.getByCategory(
          job.categories[0].jobCategoryId
        );
        // sort giảm dần theo deadline
        const data = response
          .filter((item) => item.jobId !== jobId)
          .sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

        setRelativeJobs(data);
      } catch (error) {
        console.error("Lỗi khi lấy công việc liên quan:", error);
      }
    };

    if (job && job.categories) {
      console.log(job);
      fetchRelatedJobs();
    }
  }, [job, jobId]);

  console.log(relatedJobs);
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
          <span>
            {job ? (
              job.title
            ) : (
              <div className="flex justify-center items-center mt-16">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </span>
        </div>
        {/* end: Đường dẫn */}

        {/* Body */}
        <div className="flex justify-between pt-6">
          {/* Thông tin job - mô tả công việc */}
          <div style={{ width: "65%" }}>{job && <JobInfo job={job} />}</div>

          {/* Thông tin chung - thông tin công ty */}
          <div className="ms-6" style={{ width: "35%" }}>
            {job ? (
              <>
                <InfoCompany job={job} />

                <div className="bg-white mt-2 px-2 pb-2">
                  <div className="mt-8 p-2">
                    <div className="flex items-center">
                      <p className="font-bold">Việc làm liên quan</p>
                    </div>
                  </div>
                  {relatedJobs?.slice(0, 5).map((relatedJob) => (
                    <JobItemv3
                      key={relatedJob.title}
                      job={relatedJob}
                      iconHeart={true}
                      className={"w-full"}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
          {/* End: body */}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

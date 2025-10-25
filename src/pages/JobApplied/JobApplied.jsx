import { useDispatch, useSelector } from "react-redux";
import JobAppliedItem from "./JobAppliedItem";
import { fetchApplicationByJSK } from "../../redux/slices/applySlice";
import { useEffect } from "react";

const JobApplied = () => {
  // Load application
  const user = useSelector((state) => state.auth.user);
  const jobSeekerId = user?.userId || user?.id;
  const dispatch = useDispatch();
  useEffect(() => {
    if (jobSeekerId) {
      dispatch(fetchApplicationByJSK(jobSeekerId));
    }
  }, [dispatch, jobSeekerId]);

  const jobsApplied = useSelector((state) => state.application.list);
  // console.log("jobsApplied", jobsApplied);
  // format jobsApplied cho phù hợp với component JobItemv2
  const formattedJobsApplied = jobsApplied.map((item) => ({
    jobId: item.job?.jobId,
    companyLogo: item.job?.company?.logoPath || "/logo_no_bg.png",
    companyName: item.job?.company?.companyName,
    salaryMin: item.job?.salaryMin,
    salaryMax: item.job?.salaryMax,
    jobType: item.job?.jobType,
    location: item.job?.location,
    title: item.job?.title,
    status: item.statusDTOList,
  }));

  return (
    <div className="container mx-auto py-6">
      <p className="text-2xl font-semibold pb-4" style={{ color: "#333" }}>
        Công việc đã ứng tuyển
      </p>
      {formattedJobsApplied.map((item, index) => (
        <JobAppliedItem
          key={index}
          job={item}
          iconHeart={false}
          isApply={true}
        />
      ))}
    </div>
  );
};

export default JobApplied;

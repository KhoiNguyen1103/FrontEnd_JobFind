import { useSelector } from "react-redux";
import JobItemv2 from "../../components/ui/JobItemv2";
import NotFoundItem from "../../components/ui/NotFoundItem";

const ListJob = () => {
  const jobs = useSelector((state) => state.jobs.renderJobs);
  console.log(jobs);

  return (
    <div>
      {jobs.length === 0 ? (
        <NotFoundItem title={"Không tìm thấy công việc phù hợp"} />
      ) : (
        jobs.map((job) => (
          <JobItemv2 job={job} key={job.jobId} isApply={false} />
        ))
      )}{" "}
    </div>
  );
};

export default ListJob;

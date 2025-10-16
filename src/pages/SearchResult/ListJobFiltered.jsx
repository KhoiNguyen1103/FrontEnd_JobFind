import { useSelector } from "react-redux";
import JobItemv2 from "../../components/ui/JobItemv2";

const ListJob = () => {
  // const jobsFiltered = useSelector((state) => state.jobs.filterJobs);
  const jobs = useSelector((state) => state.jobs.jobs);
  // console.log(jobsFiltered);

  return (
    <div>
      {jobs.map((job) => (
        <JobItemv2 job={job} key={job.job_id} isApply={false} />
      ))}
    </div>
  );
};

export default ListJob;

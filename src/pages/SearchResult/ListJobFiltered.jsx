import { useSelector } from "react-redux";
import JobItemFiltered from "../../components/ui/JobItemFiltered";

const ListJob = () => {
  const jobsFiltered = useSelector((state) => state.jobs.filterJobs);
  // console.log(jobsFiltered);

  return (
    <div>
      {jobsFiltered.map((job) => (
        <JobItemFiltered job={job} key={job.id} />
      ))}
    </div>
  );
};

export default ListJob;

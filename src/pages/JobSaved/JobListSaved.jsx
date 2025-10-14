import JobItemSaved from "../../components/ui/JobItemSaved";
import { useSelector } from "react-redux";

const JobList = () => {
  const savedJobs = useSelector((state) => state.jobs.jobsSaved);
  return (
    <div>
      <div className="container mx-auto">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => <JobItemSaved key={job.title} job={job} />)
        ) : (
          <p className="text-center">Chưa có công việc nào được lưu</p>
        )}
      </div>
    </div>
  );
};

export default JobList;

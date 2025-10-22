import JobItemv2 from "../../components/ui/JobItemv2";
// redux
import { useSelector } from "react-redux";

const JobList = () => {
  const savedJobs = useSelector((state) => state.savedJob.savedJobs);
  return (
    <div>
      <div className="container mx-auto">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <JobItemv2
              key={job.saved_job_id}
              job={job}
              isApply={false}
              isButtonSave={true}
            />
          ))
        ) : (
          <p className="text-center">Chưa có công việc nào được lưu</p>
        )}
      </div>
    </div>
  );
};

export default JobList;

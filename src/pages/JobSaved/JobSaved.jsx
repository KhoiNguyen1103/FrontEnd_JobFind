// api
import JobItemv2 from "../../components/ui/JobItemv2";
import { useSelector } from "react-redux";

const JobSaved = () => {
  const savedJobs = useSelector((state) => state.savedJob.savedJobs);
  return (
    <div className="py-8">
      <div className="container mx-auto">
        <p className="font-bold text-2xl text-primary py-4">Việc làm đã lưu</p>
        <div>
          <div className="container mx-auto">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <JobItemv2
                  key={job.jobId}
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
      </div>
    </div>
  );
};

export default JobSaved;

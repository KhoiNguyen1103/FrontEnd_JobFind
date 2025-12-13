import JobItemv2 from "../../components/ui/JobItemv2";
import { useSelector } from "react-redux";
import Spinner from "../../components/ui/Spinner";

const JobSaved = () => {
  const { savedJobs, loading } = useSelector((state) => state.savedJob);
  return (
    <div className="py-8">
      <div className="container mx-auto">
        {loading ? (
          <Spinner size="20" />
        ) : savedJobs.length > 0 ? (
          <>
            <p className="font-bold text-2xl text-primary py-4">
              Việc làm đã lưu ({savedJobs.length + " công việc"})
            </p>
            <div className="grid grid-cols-2 gap-4 container mx-auto">
              {savedJobs.map((job) => (
                <JobItemv2
                  key={job.jobId}
                  job={job}
                  isApply={false}
                  isButtonSave={true}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">Chưa có công việc nào được lưu</p>
        )}
      </div>
    </div>
  );
};

export default JobSaved;

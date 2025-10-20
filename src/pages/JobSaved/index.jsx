// import JobListSaved from "./JobListSaved";

// api
import { getListSavedJob } from "../../services/saveJob";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JobItemv2 from "../../components/ui/JobItemv2";

const JobSaved = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const data = await getListSavedJob();
        // console.log("data", data);
        setSavedJobs(data);
      } catch (error) {
        toast.error("Lỗi khi lấy danh sách job đã lưu");
        console.error("Lỗi khi lấy danh sách job đã lưu:", error);
      }
    };

    fetchSavedJobs();
  }, []);

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

import { useSelector } from "react-redux";
import JobItemv2 from "../../components/ui/JobItemv2";

const ListJob = () => {
  // const filterJobs = useSelector((state) => state.jobs.filterJobs);
  const jobs = useSelector((state) => state.jobs.renderJobs);
  // console.log(jobs);

  return (
    <div>
      {jobs.length === 0 ? (
        <div className="text-center text-xl font-bold py-4">
          Không có việc làm nào phù hợp với tìm kiếm của bạn
        </div>
      ) : (
        jobs.map((job) => (
          <JobItemv2 job={job} key={job.jobId} isApply={false} />
        ))
      )}{" "}
    </div>
  );
};

export default ListJob;

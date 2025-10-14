import JobListSaved from "./JobListSaved";

const JobSaved = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto">
        <p className="font-bold text-2xl text-primary py-4">Việc làm đã lưu</p>
        <JobListSaved />
      </div>
    </div>
  );
};

export default JobSaved;

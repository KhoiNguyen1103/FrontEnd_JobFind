import { useSelector } from "react-redux";
import JobItemv2 from "../../components/ui/JobItemv2";
import usePagination from "../../hooks/usePagination/usePagination";
import ButtonCircle from "../../components/button/ButtonCircle";

const JobApplied = () => {
  const jobsApplied = useSelector((state) => state.application.list);
  const formattedJobsApplied = jobsApplied.map((item) => ({
    jobId: item.job?.jobId,
    companyLogo: item.job?.company?.logoPath || "/logo_no_bg.png",
    companyName: item.job?.company?.companyName,
    salaryMin: item.job?.salaryMin,
    salaryMax: item.job?.salaryMax,
    jobType: item.job?.jobType,
    location: item.job?.location,
    title: item.job?.title,
    status: item.statusDTOList,
  }));

  // phân trang
  const { page, maxPage, nextPage, prevPage, dataPagination } =
    usePagination(formattedJobsApplied);

  return (
    <div className="container mx-auto py-6">
      <p className="text-2xl font-semibold pb-4" style={{ color: "#333" }}>
        Công việc đã ứng tuyển
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dataPagination.map((item, index) => (
          <JobItemv2
            key={index}
            job={item}
            iconHeart={false}
            isApply={true}
            hasTime={false}
            type={"JOB_APPLIED"}
            className={""}
          />
        ))}
      </div>
      <div className="flex gap-2 justify-center items-center px-2">
        <ButtonCircle
          direction="left"
          onClick={prevPage}
          disabled={page === 1}
        />
        {page} / {maxPage}
        <ButtonCircle
          direction="right"
          onClick={nextPage}
          disabled={page === maxPage}
        />
      </div>
    </div>
  );
};

export default JobApplied;

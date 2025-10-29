import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Thêm useSelector
import { setSelectedJob } from "../../redux/slices/jobSlice";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import createSlug from "../../untils/createSlug";
import ButtonSave from "../button/ButtonSave";
import ButtonApply from "../button/ButtonApply";
import formatData from "../../untils/formatData";

const JobItemVertical = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Lấy thông tin vai trò từ Redux store
  const userRole = useSelector((state) => state.auth?.user?.role || null);

  // Navigate to job detail
  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    const slug = createSlug(job.title);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
  };

  // format experience
  // Navigate to applications page for this job
  // const navigateToApplications = () => {
  //   navigate(`/applications/${job.jobId}`);
  // };

  return (
    <div className="p-4 rounded-md border border-gray-300 bg-white border-primary flex flex-col h-full">
      {/* Thông tin công ty */}
      <div className="flex cursor-pointer" onClick={navigateToJobDetail}>
        {/* Logo công ty */}
        <div
          className="border border-slate-300 rounded-lg p-1"
          style={{ width: "62px", height: "62px" }}
        >
          <img src={job.company.logoPath} alt="logo" />
        </div>
        {/* Thông tin công ty */}
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company.companyName}</p>
        </div>
      </div>

      {/* Tag: địa điểm, lương */}
      <div className="flex justify-between items-center pt-2 text-sm whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-2">
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {formatData.formatSalary(job.salaryMin) +
              " - " +
              formatData.formatSalary(job.salaryMax)}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.location || "Hồ Chí Minh"}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.yearsOfExperience
              ? formatData.formatExperience(job.yearsOfExperience)
              : "Không yêu cầu kinh nghiệm"}
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center mt-auto">
        {userRole === "COMPANY" ? (
          <div></div>
        ) : (
          <>
            <ButtonApply jobId={job.jobId} />
            <ButtonSave job={job} />
          </>
        )}
      </div>
    </div>
  );
};

JobItemVertical.propTypes = {
  job: jobPropTypes.isRequired,
};

export default JobItemVertical;

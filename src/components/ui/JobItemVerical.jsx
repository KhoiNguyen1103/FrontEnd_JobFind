import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "../../redux/slices/jobSlice";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import createSlug from "../../untils/createSlug";
import ButtonSave from "../button/ButtonSave";
import ButtonApply from "../button/ButtonApply";
import formatData from "../../untils/formatData";

const JobItemVertical = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // navigate to job detail
  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    const slug = createSlug(job.title);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
  };

  return (
    <div className="p-4 rounded-md border border-gray-300 bg-white border-primary flex flex-col h-full">
      {/* thông tin công ty */}
      <div className="flex cursor-pointer" onClick={navigateToJobDetail}>
        {/* logo công ty */}
        <div
          className="border border-slate-300 rounded-lg p-1"
          style={{ width: "62px", height: "62px" }}
        >
          <img src={job.company.logoPath} alt="logo" />
        </div>
        {/* thông tin công ty */}
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company.companyName}</p>
        </div>
      </div>

      {/* tag: địa điểm, lương */}
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
            {job.yearOfExperience || 5} năm kinh nghiệm
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center mt-auto">
        <ButtonApply jobId={job.jobId} />
        <ButtonSave job={job} />
      </div>
    </div>
  );
};

JobItemVertical.propTypes = {
  job: jobPropTypes.isRequired,
};

export default JobItemVertical;

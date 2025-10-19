import PropTypes from "prop-types";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

// component
import ButtonApply from "../button/ButtonApply";
import ButtonSave from "../button/ButtonSave";
import ButtonUnsaved from "../button/ButtonUnsaved";

// redux
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "../../redux/slices/jobSlice";
import createSlug from "../../untils/createSlug";

const JobItemv2 = ({ job, iconHeart, isApply, isButtonSave }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    navigate(`/job-detail/${createSlug(job.title)}`, { state: job });
    scrollTop();
  };

  return (
    <div className="flex justify-between border border-slate-200 rounded-lg p-4 mb-4 h-40">
      <div className="cursor-pointer" onClick={navigateToJobDetail}>
        <img
          src={job.company.logoPath}
          alt="logo"
          className="h-32 w-32 object-cover"
        />
      </div>

      {/* Thông tin job */}
      <div
        className="grow ps-4 h-full cursor-pointer"
        onClick={navigateToJobDetail}
      >
        <p className="font-bold pb-2">{job.title}</p>
        <p className="pb-2 text-slate-600">{job.company.companyName}</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.location}
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.jobType}
          </span>
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-primary font-bold">
          {job.salaryMin + " - " + job.salaryMax + " triệu"}
        </p>
        <div className="flex items-center gap-2">
          <ButtonApply isApply={isApply} />
          {iconHeart && <ButtonSave job={job} />}
          {isButtonSave && <ButtonUnsaved job={job} />}
        </div>
      </div>
    </div>
  );
};

JobItemv2.propTypes = {
  iconHeart: PropTypes.bool,
  isApply: PropTypes.bool,
  isButtonSave: PropTypes.bool,
  job: jobPropTypes.isRequired,
};

export default JobItemv2;

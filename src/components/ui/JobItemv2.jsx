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

  // navigate to job detail
  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    navigate(`/job-detail/${createSlug(job.title)}`, { state: job });
    scrollTop();
  };

  // scroll lên đầu trang
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-between border border-slate-200 rounded-lg p-4 mb-4 h-40">
      <div className="cursor-pointer" onClick={navigateToJobDetail}>
        <img src={job.image} alt="logo" className="h-32 w-32" />
      </div>
      {/* Thông tin job */}
      <div
        className="grow ps-4 h-full cursor-pointer"
        onClick={navigateToJobDetail}
      >
        <p className="font-bold pb-4">{job.title}</p>
        <p className="pb-2">{job.company}</p>
        <div>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md text-center whitespace-nowrap">
            {job.location}
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md text-center whitespace-nowrap ms-4">
            {job.experience} năm kinh nghiệm
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md text-center whitespace-nowrap ms-4">
            {job.position}
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md text-center whitespace-nowrap ms-4">
            {job.workType}
          </span>
        </div>
      </div>
      {/* end: thông tin job */}

      {/* Button */}
      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-primary font-bold">
          {job.salary_min + " - " + job.salary_max + " triệu"}
        </p>
        <div className="flex justify-between items-center">
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

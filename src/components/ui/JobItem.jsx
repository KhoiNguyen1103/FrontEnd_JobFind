import { useNavigate } from "react-router-dom";
import createSlug from "../../untils/createSlug";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "../../redux/slices/jobSlice";
import jobPropType from "../../untils/propTypes/jobPropTypes"; // propTypes

// component
import ButtonSave from "../button/ButtonSave";
import ButtonApply from "../button/ButtonApply";

const JobItem = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // navigate to job detail
  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    navigate(`/job-detail/${createSlug(job.title)}`, { state: job });
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
          <img src={job.image} alt="logo" />
        </div>
        {/* thông tin công ty */}
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company}</p>
        </div>
      </div>

      {/* tag: địa điểm, lương */}
      <div className="flex justify-between items-center pt-2 text-sm whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-2">
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.salary_min + " - " + job.salary_max + " triệu"}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.location}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.experience} năm kinh nghiệm
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.position}
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center mt-auto">
        <ButtonApply isApply={false} />
        {/* Button Trái tim - lưu job */}
        <ButtonSave job={job} />
      </div>
    </div>
  );
};
// JobItem.propTypes = {
//   job: jobPropType,
// };

export default JobItem;

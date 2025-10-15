import PropTypes from "prop-types";
import formatSalary from "../../untils/formatSalary";
import { useNavigate } from "react-router-dom";
import createSlug from "../../untils/createSlug";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "../../redux/slices/jobSlice";

// component
import ButtonSave from "../button/ButtonSave";

const JobItem = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // navigate to job detail
  const navigateToJobDetail = () => {
    dispatch(setSelectedJob(job));
    navigate(`/job-detail/${createSlug(job.title)}`, { state: job });
  };

  return (
    <div className="p-4 rounded-md border border-gray-300 bg-white border-primary">
      <div className="flex cursor-pointer" onClick={navigateToJobDetail}>
        <div
          className="border border-slate-300 rounded-lg p-1"
          style={{ width: "62px", height: "62px" }}
        >
          <img src={job.image} alt="logo" />
        </div>
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company}</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 text-sm">
        <div className="flex items-center">
          <p className="py-1 px-2 rounded-full bg-slate-200 me-2 cursor-pointer">
            {formatSalary(job.salary)}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.location}
          </p>
        </div>
        {/* Button Trái tim - lưu job */}
        <ButtonSave job={job} />
      </div>
    </div>
  );
};
JobItem.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    salary: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobItem;

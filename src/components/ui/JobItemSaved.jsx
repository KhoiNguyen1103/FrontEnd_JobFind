import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// utils
import formarSalary from "../../untils/formatSalary";

// redux
import { useDispatch } from "react-redux";
import { unSaveJob } from "../../redux/slices/jobSlice";

const JobItemSaved = ({ job }) => {
  const dispatch = useDispatch();
  const handleUnSaveJob = () => {
    dispatch(unSaveJob(job.id));
  };

  return (
    <div className="flex justify-between items-center border border-slate-200 rounded-lg p-4 mb-4 h-40">
      <div className="">
        <img src={job.image} alt="logo" className="h-32 w-32" />
      </div>
      {/* Thông tin job */}
      <div className="grow ps-4">
        <p className="font-bold pb-4">{job.title}</p>
        <p className="pb-2">{job.company}</p>
        <p className="pb-4">Đã lưu: 11h</p>
        <div>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md text-center whitespace-nowrap">
            {job.location}
          </span>
        </div>
      </div>
      {/* end: thông tin job */}

      {/* Button */}
      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-primary font-bold">{formarSalary(job.salary)}</p>
        <div className="flex justify-between items-center">
          <p className="py-1 px-2 rounded-md bg-primary text-white font-sm me-4 cursor-pointer">
            Ứng tuyển
          </p>
          <div
            className="py-1 px-2 rounded-md bg-slate-200 font-sm flex justify-between items-center cursor-pointer"
            onClick={handleUnSaveJob}
          >
            <FontAwesomeIcon icon={faTrash} />
            <p className="ps-2">Bỏ lưu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

JobItemSaved.propTypes = {
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

export default JobItemSaved;

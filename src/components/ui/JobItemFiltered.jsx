import PropTypes from "prop-types";

// utils
import formarSalary from "../../untils/formatSalary";

// redux

// component
import ButtonApply from "../button/ButtonApply";
import ButtonSave from "../button/ButtonSave";

const JobItemSaved = ({ job }) => {
  return (
    <div className="flex justify-between items-center border border-slate-200 rounded-lg p-4 mb-4 h-40">
      <div className="">
        <img src={job.image} alt="logo" className="h-32 w-32" />
      </div>
      {/* Thông tin job */}
      <div className="grow ps-4">
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
        <p className="text-primary font-bold">{formarSalary(job.salary)}</p>
        <div className="flex justify-between items-center">
          <ButtonApply />
          <ButtonSave job={job} />
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
    experience: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    workType: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobItemSaved;

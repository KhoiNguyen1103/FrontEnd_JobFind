import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";

// format
import formatSalary from "../../untils/formatSalary";

const JobItem = ({ job }) => {
  const [isHeart, setIsHeart] = useState(false);
  const handleHeartClick = () => {
    setIsHeart(!isHeart);
  };

  return (
    <Link
      to="/job-detail"
      target="_blank"
      className="p-4 rounded-md border border-gray-300 bg-white cursor-pointer border-primary"
    >
      <div className="flex">
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
        <div
          className="rounded-full border border-slate-300 p-4 flex justify-center items-center border-primary hover:opacity-30"
          style={{ width: "20px", height: "20px" }}
          onClick={handleHeartClick}
        >
          {isHeart ? (
            <FontAwesomeIcon icon={faHeart} className="text-lg text-primary" />
          ) : (
            <FontAwesomeIcon
              icon={faHeartRegular}
              className="text-lg text-primary"
            />
          )}
        </div>
      </div>
    </Link>
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
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobItem;

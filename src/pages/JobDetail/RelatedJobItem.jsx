import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCircleDollarToSlot,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";

import formatSalary from "../../untils/formatSalary";

const JobItem = ({ job }) => {
  const [isHeart, setIsHeart] = useState(false);
  const handleHeartClick = () => {
    setIsHeart(!isHeart);
  };

  return (
    <Link
      to="#"
      // target="_blank"
      className=" flex justify-between p-4 rounded-lgcursor-pointer w-full border-base bg-green-100 bg-opacity-20 rounded-lg"
      style={{ height: "170px" }}
    >
      {/* Ảnh công ty - thông tin */}
      <div className="flex w-full h-full">
        {/* ảnh công ty */}
        <div
          className="border border-slate-300 rounded-lg p-4 bg-white"
          style={{ width: "124px", height: "124px" }}
        >
          <img src={job.image} alt="logo" />
        </div>

        {/* tên việc làm - tên công ty */}
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company}</p>
          <p className="py-1 px-1 rounded-md text-sm bg-slate-200 cursor-pointer text-center mt-4">
            {job.location}
          </p>
        </div>
      </div>

      {/* Lương - ứng tuyển - like */}
      <div className="w-1/5 flex flex-col h-full items-end justify-between">
        {/* Lương */}
        <div className="flex items-center text-primary font-bold">
          <FontAwesomeIcon icon={faCircleDollarToSlot} className="pe-4" />
          <p className="">{formatSalary(job.salary)}</p>
        </div>

        {/* Nút ứng tuyển */}
        <div className="flex justify-center items-center">
          <button className="py-2 px-2 text-sm text-white rounded-md bg-primary">
            Ứng tuyển
          </button>
          <div onClick={handleHeartClick} className="ps-4">
            {isHeart ? (
              <FontAwesomeIcon
                icon={faHeart}
                className="text-lg text-primary"
              />
            ) : (
              <FontAwesomeIcon
                icon={faHeartRegular}
                className="text-lg text-primary"
              />
            )}
          </div>
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

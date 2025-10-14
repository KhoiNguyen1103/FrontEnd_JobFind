import {
  faLocationDot,
  faClock,
  faDollarSign,
  faPaperPlane,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JobInfo = ({ job }) => {
  // console.log(job);
  const { title, salary, location, experience, deadline } = job;

  // Lưu tin icon change
  const [isSave, setIsSave] = useState(false);

  return (
    <>
      {/* Thông tin job */}
      <div className="p-4 rounded-lg bg-white ">
        {/* Tên công việc */}
        <p className="text-2xl font-bold pb-4">{title}</p>

        {/* Lương - Địa điểm - Kinh nghiệm */}
        <div className="grid grid-cols-3 gap-4">
          {/* Lương */}
          <div className="flex items-center">
            <div
              className="bg-primary rounded-full p-2 flex items-center justify-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FontAwesomeIcon icon={faDollarSign} className="text-white" />
            </div>
            <div className="ps-4">
              <p className="text-sm text-slate-500">Thu nhập</p>
              <p className="font-bold">
                {salary[0]} - {salary[1]} tr
              </p>
            </div>
          </div>

          {/* Địa điểm */}
          <div className="flex items-center">
            <div
              className="bg-primary rounded-full p-2 flex items-center justify-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FontAwesomeIcon icon={faLocationDot} className="text-white" />
            </div>
            <div className="ps-4">
              <p className="text-sm text-slate-500">Địa điểm</p>
              <p className="font-bold">{location}</p>
            </div>
          </div>

          {/* Kinh nghiệm */}
          <div className="flex items-center">
            <div
              className="bg-primary rounded-full p-2 flex items-center justify-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FontAwesomeIcon icon={faClock} className="text-white" />
            </div>
            <div className="ps-4">
              <p className="text-sm text-slate-500">Kinh nghiệm</p>
              <p className="font-bold">{experience} năm</p>
            </div>
          </div>
        </div>
        {/* end: Lương - Địa điểm - kinh nghiệm */}

        {/* Hạn nộp */}
        <div
          className="flex items-center mt-4 text-slate-600 p-1 rounded-md bg-slate-200 text-sm"
          style={{ width: "fit-content" }}
        >
          <FontAwesomeIcon icon={faClock} className="pe-2" />
          <p className="pe-2">Hạn nộp hồ sơ:</p>
          <p>{deadline}</p>
        </div>
        {/* end: Hạn nộp */}

        {/* Ứng tuyển ngay - Lưu tin */}
        <div className="pt-6 flex">
          <button className="bg-primary text-white rounded-md px-6 py-3 mt-4 grow text-center hover:opacity-80">
            <Link to="#">
              <FontAwesomeIcon icon={faPaperPlane} className="pe-4" />
              Ứng tuyển ngay
            </Link>
          </button>

          <button className=" text-slate-600 rounded-md px-6 py-3 ms-2 mt-4 bg-white border border-primary">
            <div onClick={() => setIsSave(!isSave)} className="text-primary">
              <FontAwesomeIcon
                icon={isSave ? faHeartSolid : faHeart}
                className="pe-2"
              />
              Lưu tin
            </div>
          </button>
        </div>
        {/* end: ứng tuyển ngay - lưu tin */}
      </div>
      {/* end: thông tin job */}
    </>
  );
};
JobInfo.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    salary: PropTypes.array.isRequired,
    location: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobInfo;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faGraduationCap,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

const InfoCompany = ({ job }) => {
  return (
    <div>
      {/* Thông tin công ty */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex">
          <div
            className="p-2 border border-slate-300 rounded-lg"
            style={{ width: "80px", height: "80px" }}
          >
            <img
              src={job.company.logoPath}
              alt={`Ảnh công ty ${job.company.companyName}`}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="ps-4 font-bold text-lg">
            Công ty {job.company.companyName}
          </p>
        </div>
        <div className="flex items-center pt-4">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="text-slate-500 pe-2"
          />
          <p className="text-slate-500 pe-2">Địa điểm: </p>
          <p>{job.location}</p>
        </div>
        <Link
          to={`/company/${job.company.companyId}`}
          className="text-green-500 text-center block mt-4 hover:underline"
        >
          Xem trang công ty
        </Link>
      </div>
      {/* end: thông tin công ty */}

      {/* thông tin chung */}
      <div className="p-4 rounded-lg bg-white mt-4">
        {/* Học vấn */}
        <div className="flex items-center">
          <div
            className="bg-primary flex justify-center items-center rounded-full me-4"
            style={{ width: "40px", height: "40px" }}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="text-lg text-white"
            />
          </div>
          <div>
            <p className="text-slate-500">Học vấn</p>
            <p className="font-bold">Cao đẳng trở lên</p>
          </div>
        </div>

        {/* Hình thức làm việc */}
        <div className="flex items-center pt-4">
          <div
            className="bg-primary flex justify-center items-center rounded-full me-4"
            style={{ width: "40px", height: "40px" }}
          >
            <FontAwesomeIcon icon={faUsers} className="text-lg text-white" />
          </div>
          <div>
            <p className="text-slate-500">Hình thức làm việc</p>
            <p className="font-bold">{job.jobType}</p>
          </div>
        </div>

        {/* Vị trí */}
        <div className="flex items-center pt-4">
          <div
            className="bg-primary flex justify-center items-center rounded-full me-4"
            style={{ width: "40px", height: "40px" }}
          >
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-lg text-white"
            />
          </div>
          <div>
            <p className="text-slate-500">Vị trí</p>
            <p className="font-bold">{job.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

InfoCompany.propTypes = {
  job: jobPropTypes.isRequired,
};

export default InfoCompany;

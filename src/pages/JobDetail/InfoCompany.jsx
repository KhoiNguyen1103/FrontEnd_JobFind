import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faGraduationCap,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import vina68 from "../../assets/images/image_products/vina68.webp";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const InfoCompany = ({ job }) => {
  return (
    <div>
      {/* Thông tin công ty */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex ">
          <div
            className="p-2 border border-slate-300 rounded-lg"
            style={{ width: "80px", height: "80px" }}
          >
            <img src={vina68} alt="ảnh công ty" />
          </div>
          <p className="ps-4 font-bold text-lg">Công ty {job.company}</p>
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
          to="#"
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
        {/* end: Học vấn */}

        {/* Số lượng tuyển */}
        <div className="flex items-center pt-4">
          <div
            className="bg-primary flex justify-center items-center rounded-full me-4"
            style={{ width: "40px", height: "40px" }}
          >
            <FontAwesomeIcon icon={faUsers} className="text-lg text-white" />
          </div>
          <div>
            <p className="text-slate-500">Số lượng tuyển</p>
            <p className="font-bold">5 người</p>
          </div>
        </div>
        {/* end: Số lượng tuyển */}

        {/* Hình thức làm việc */}
        <div className="flex items-center pt-4">
          <div
            className="bg-primary flex justify-center items-center rounded-full me-4"
            style={{ width: "40px", height: "40px" }}
          >
            <FontAwesomeIcon icon={faUsers} className="text-lg text-white" />
          </div>
          <div>
            <p className="text-slate-500">Số lượng tuyển</p>
            <p className="font-bold">5 người</p>
          </div>
        </div>
        {/* end: Hình thức làm việc */}
      </div>
    </div>
  );
};
InfoCompany.propTypes = {
  job: PropTypes.shape({
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

export default InfoCompany;

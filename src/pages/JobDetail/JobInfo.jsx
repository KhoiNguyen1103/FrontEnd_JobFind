import {
  faLocationDot,
  faClock,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// propTypes
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

// component
import ButtonApply from "../../components/button/ButtonApply";
import ButtonSave from "../../components/button/ButtonSave";
import { useSelector } from "react-redux";

const JobInfo = ({ job }) => {
  // console.log(job);
  const { title, location, experience, deadline } = job;

  // Kiểm tra job này được applied chưa
  const jobsApplied = useSelector((state) => state.application.list);
  const isApplied = jobsApplied.some((item) => item.job?.jobId === job.jobId);

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
                {new Intl.NumberFormat("de-DE").format(
                  job.salaryMin / 1000000
                ) +
                  " - " +
                  new Intl.NumberFormat("de-DE").format(
                    job.salaryMax / 1000000
                  ) +
                  " triệu"}
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
        <div className="pt-6 flex items-center mt-4" style={{ height: "72px" }}>
          <div className="w-full h-full">
            <ButtonApply isApply={isApplied} />
          </div>

          <div className="ps-4">
            <ButtonSave job={job} />
          </div>
        </div>
        {/* end: ứng tuyển ngay - lưu tin */}
      </div>
      {/* end: thông tin job */}
    </>
  );
};
JobInfo.propTypes = {
  job: jobPropTypes.isRequired,
};

export default JobInfo;

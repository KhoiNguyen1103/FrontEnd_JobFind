import {
  faLocationDot,
  faClock,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import ButtonApply from "../../components/button/ButtonApply";
import ButtonSave from "../../components/button/ButtonSave";
import formatData from "../../untils/formatData";

const JobInfo = ({ job }) => {
  // console.log(job);
  const userRole = useSelector((state) => state.auth?.user?.role || null);
  const { title, location, yearsOfExperience, deadline } = job;

  // Kiểm tra job này được applied chưa
  const jobsApplied = useSelector((state) => state.application.list);
  const isApplied = jobsApplied.some((item) => item.job?.jobId === job.jobId);

  return (
    <div>
      {/* Thông tin job */}
      <div className="p-4 rounded-lg bg-white ">
        <p className="text-2xl font-bold pb-4">{title}</p>

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
              <p className="font-bold">{location || "Hồ Chí Minh"}</p>
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
              <p className="font-bold">{yearsOfExperience || 5} năm</p>
            </div>
          </div>
        </div>

        <div
          className="flex items-center mt-4 text-slate-600 p-1 rounded-md bg-slate-200 text-sm"
          style={{ width: "fit-content" }}
        >
          <FontAwesomeIcon icon={faClock} className="pe-2" />
          <p className="pe-2">Hạn nộp hồ sơ:</p>
          <p>{formatData.formatDate(deadline) || "01/01/2025"}</p>
        </div>

        {/* Ứng tuyển ngay - Lưu tin */}

        {userRole === "COMPANY" ? (
          <div></div>
        ) : (
          <>
            <div
              className="pt-6 flex items-center mt-4"
              style={{ height: "72px" }}
            >
              <div className="w-full h-full">
                <ButtonApply isApply={isApplied} jobId={job.jobId} />
              </div>

              <div className="ps-4">
                <ButtonSave job={job} />
              </div>
            </div>
          </>
        )}
      </div>
      {/* end: ứng tuyển ngay - lưu tin */}
      {/* end: thông tin job */}

      {/* Start: Chi tiết tuyển dụng */}
      <div className="p-6 rounded-lg bg-white mt-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-primary py-4 px-1 me-2"></div>
            <p className="font-bold text-lg">Chi tiết tin tuyển dụng</p>
          </div>
        </div>
        {/* End: Header */}

        {/* Mô tả công việc */}
        <div className="pt-4">
          <p className="font-bold">Mô tả công việc</p>
          <p>- {job.description}</p>
        </div>

        {/* Yêu cầu ứng viên */}
        <div className="pt-4">
          <p className="font-bold">Yêu cầu ứng viên</p>
          <p>- {job.requirements}</p>
        </div>

        {/* Quyền lợi */}
        <div className="pt-4">
          <p className="font-bold">Quyền lợi</p>
          <p>- {job.benefits}</p>
        </div>

        {/* Việc làm liên quan */}
        <div className="mt-8">
          <div className="flex items-center">
            <div className="bg-primary py-4 px-1 me-2"></div>
            <p className="font-bold text-lg">Việc làm liên quan</p>
          </div>
        </div>
      </div>
      {/* End: Chi tiết tuyển dụng */}
    </div>
  );
};
JobInfo.propTypes = {
  job: jobPropTypes.isRequired,
};

export default JobInfo;

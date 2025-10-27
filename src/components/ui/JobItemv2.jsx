import PropTypes from "prop-types";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import { formatDateTime } from "../../untils/formatDate";

// component
import ButtonApply from "../button/ButtonApply";
import ButtonSave from "../button/ButtonSave";
import ButtonUnsaved from "../button/ButtonUnsaved";

// redux
import { useNavigate } from "react-router-dom";
import createSlug from "../../untils/createSlug";

const JobItemv2 = ({ job, iconHeart, isApply, isButtonSave }) => {
  const navigate = useNavigate();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToJobDetail = () => {
    const slug = createSlug(job.title || job.jobName);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
    scrollTop();
  };

  return (
    <div className="flex justify-between border border-slate-200 rounded-lg p-4 mb-4 h-[200px]">
      <div className="cursor-pointer" onClick={navigateToJobDetail}>
        <img
          src={job.company?.logoPath || "/logo_no_bg.png"}
          alt="logo"
          className="h-32 w-32 object-cover"
        />
      </div>

      {/* Thông tin job */}
      <div
        className="grow ps-4 h-full cursor-pointer"
        onClick={navigateToJobDetail}
      >
        <p className="font-bold pb-2">{job.title}</p>
        <p className="pb-2 text-slate-600">
          {job.company?.companyName || job.companyName}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.location}
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.jobType}
          </span>
        </div>
        {/* Ngày đăng - ngày end */}
        <div className="pt-6 flex flex-col justify-center items-start text-sm text-gray-500 min-w-[120px]">
          <p className="flex items-center gap-1">
            📅 <span className="font-medium">Ngày Đăng:</span>{" "}
            {formatDateTime(
              job.postedAt?.slice(0, 10) || job.created?.slice(0, 10)
            )}
          </p>
          <p className="flex items-center gap-1">
            ⏰ <span className="font-medium">Hết hạn:</span>{" "}
            {formatDateTime(job.deadline)}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col justify-between items-end h-full">
        <p className="text-primary font-bold">
          {new Intl.NumberFormat("de-DE").format(job.salaryMin / 1000000) +
            " - " +
            new Intl.NumberFormat("de-DE").format(job.salaryMax / 1000000) +
            " triệu"}
        </p>
        <div className="flex items-center gap-2">
          <ButtonApply isApply={isApply} jobId={job.jobId} />
          {iconHeart && <ButtonSave job={job} />}
          {isButtonSave && <ButtonUnsaved job={job} />}
        </div>
      </div>
    </div>
  );
};

JobItemv2.propTypes = {
  iconHeart: PropTypes.bool,
  isApply: PropTypes.bool,
  isButtonSave: PropTypes.bool,
  job: jobPropTypes,
};

export default JobItemv2;

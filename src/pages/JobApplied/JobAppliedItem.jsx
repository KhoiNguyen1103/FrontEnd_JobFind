import PropTypes from "prop-types";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

// component
import ButtonApply from "../../components/button/ButtonApply";
import ButtonSave from "../../components/button/ButtonSave";
import ButtonUnsaved from "../../components/button/ButtonUnsaved";

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
    <div className="flex justify-between border border-slate-200 rounded-lg p-4 mb-4 h-40">
      <div className="cursor-pointer" onClick={navigateToJobDetail}>
        <img
          src={job.companyLogo}
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
        <p className="pb-2 text-slate-600">{job.companyName}</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.location}
          </span>
          <span className="bg-slate-200 py-1 px-2 text-sm rounded-md whitespace-nowrap">
            {job.jobType}
          </span>
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
          <div className="flex items-center gap-2">
            <ButtonApply jobId={job.jobId} />
            {iconHeart && <ButtonSave job={job} />}
            {isButtonSave && <ButtonUnsaved job={job} />}
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-gray-400 py-1 px-4 rounded-lg">
              {{
                PENDING: "Đang chờ",
                REJECTED: "Bị từ chối",
                REVIEWING: "Đang xem xét",
              }[job.status.at(-1)?.status] || "Đang chờ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

JobItemv2.propTypes = {};

export default JobItemv2;

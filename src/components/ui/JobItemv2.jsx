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
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextSalary from "./TextSalary";
import BadgeKinhNghiem from "./BadgeKinhNghiem";
import BadgeDiaDiem from "./BadgeDiaDiem";
import BadgeTypeJob from "./BadgeTypeJob";

const JobItemv2 = ({ job, iconHeart, isApply, isButtonSave }) => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth?.user?.role || null);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToJobDetail = () => {
    const slug = createSlug(job.title || job.jobName);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
    scrollTop();
  };

  const logoSection = (
    <img
      src={job.company?.logoPath || job.companyLogo || "/logo_no_bg.png"}
      alt="logo"
      className="h-24 w-24 object-cover rounded"
    />
  );

  const ngayDangNgayHetHan = (
    <div
      className="flex justify-between cursor-pointer"
      onClick={navigateToJobDetail}
    >
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
  );

  return (
    <div className="flex flex-col border border-slate-200 rounded-lg p-4 mb-4 gap-4">
      <div className="flex ">
        <div
          className="cursor-pointer flex justify-center items-center"
          onClick={navigateToJobDetail}
        >
          {logoSection}
        </div>

        <div className="flex flex-col justify-between ms-4">
          <div>
            <p className="font-bold text-lg">{job.title || job.jobName}</p>
            <p className="text-gray-900">
              {job.company?.companyName || job.companyName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <BadgeDiaDiem diaDiem={job?.location} />
            <BadgeTypeJob typeJob={job?.jobType} />
            <BadgeKinhNghiem soNamKinhNghiem={job?.yearsOfExperience} />
          </div>
        </div>
      </div>

      {ngayDangNgayHetHan}

      <hr className="bg-slate-700" />

      <div className="flex justify-between items-center">
        <TextSalary salaryMin={job.salaryMin} salaryMax={job.salaryMax} />

        {userRole !== "COMPANY" && (
          <div className="flex items-center gap-2 mt-2">
            <ButtonApply isApply={isApply} jobId={job.jobId} />
            {iconHeart && <ButtonSave job={job} />}
            {isButtonSave && <ButtonUnsaved job={job} />}
          </div>
        )}
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

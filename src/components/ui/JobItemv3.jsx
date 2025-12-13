import PropTypes from "prop-types";
import jobPropTypes from "../../untils/propTypes/jobPropTypes";
import { daysLeft } from "../../untils/formatDate";
import ButtonSave from "../button/ButtonSave";
import ButtonUnsaved from "../button/ButtonUnsaved";
import { useNavigate } from "react-router-dom";
import createSlug from "../../untils/createSlug";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BadgeDiaDiem from "./BadgeDiaDiem";
import BadgeSalary from "./BadgeSalary";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";

const JobItemv3 = ({ job, iconHeart, isButtonSave, className }) => {
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

  return (
    <div
      className={clsx(
        "flex flex-col border border-slate-200 rounded-lg p-4 pb-0 mb-4 w-96",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="font-bold text-lg">{job.title || job.jobName}</p>
        <div className="flex justify-between items-center">
          {userRole !== "COMPANY" && (
            <div className="flex items-center gap-2">
              {iconHeart && <ButtonSave job={job} />}
              {isButtonSave && <ButtonUnsaved job={job} />}
            </div>
          )}
        </div>
      </div>
      <div className="flex">
        <div
          className="cursor-pointer flex justify-center items-center"
          onClick={navigateToJobDetail}
        >
          {logoSection}
        </div>

        <div className="flex flex-col ms-4">
          <div>
            <p className="text-gray-900">
              {job.company?.companyName || job.companyName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <BadgeDiaDiem diaDiem={job?.location} />
            <BadgeSalary salary={[job?.salaryMin, job?.salaryMax]} />
          </div>
        </div>
      </div>

      <hr />
      <p className="text-md text-right gap-1 mt-1 text-slate-700 font-semibold py-2">
        <FontAwesomeIcon icon={faClock} className="me-1" />
        {daysLeft(job.deadline)}
      </p>
    </div>
  );
};

JobItemv3.propTypes = {
  iconHeart: PropTypes.bool,
  isApply: PropTypes.bool,
  isButtonSave: PropTypes.bool,
  job: jobPropTypes,
};

export default JobItemv3;

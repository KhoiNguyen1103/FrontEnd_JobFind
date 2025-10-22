import { useNavigate } from "react-router-dom";
import createSlug from "../../untils/createSlug";
import jobPropType from "../../untils/propTypes/jobPropTypes"; // propTypes

// component
import ButtonSave from "../../components/button/ButtonSave";
import ButtonApply from "../../components/button/ButtonApply";

const JobItem = ({ job }) => {
  // console.log("JobItem - home: ", job);
  const navigate = useNavigate();

  // navigate to job detail
  const navigateToJobDetail = () => {
    const slug = createSlug(job.title);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
  };

  return (
    <div className="p-4 rounded-md border border-gray-300 bg-white border-primary flex flex-col h-full">
      {/* thông tin công ty */}
      <div className="flex cursor-pointer" onClick={navigateToJobDetail}>
        {/* logo công ty */}
        <div
          className="border border-slate-300 rounded-lg p-1"
          style={{ width: "62px", height: "62px" }}
        >
          <img
            src={
              job.company.logoPath ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6CkfRreFUwou55lvRWataKzz21cendRZmfMP1HF5dqzqYa6BjhUAxsY-wZZUDBT-Ve-U&usqp=CAU"
            }
            alt="logo"
          />
        </div>
        {/* thông tin công ty */}
        <div className="ps-4">
          <p className="font-bold pb-2">{job.title}</p>
          <p className="font-light text-sm">{job.company.companyName}</p>
        </div>
      </div>

      {/* tag: địa điểm, lương */}
      <div className="flex justify-between items-center pt-2 text-sm whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-2">
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {new Intl.NumberFormat("de-DE").format(job.salaryMin / 1000000) +
              " - " +
              new Intl.NumberFormat("de-DE").format(job.salaryMax / 1000000) +
              " triệu"}
          </p>
          <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
            {job.location}
          </p>
          {/* Nếu có experience thì dùng: */}
          {/* <p className="py-1 px-2 rounded-full bg-slate-200 cursor-pointer">
        {job.experience} năm kinh nghiệm
      </p> */}
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center mt-auto">
        <ButtonApply isApply={false} />
        <ButtonSave job={job} />
      </div>
    </div>
  );
};
JobItem.propTypes = {
  job: jobPropType.isRequired,
};

export default JobItem;

// propTypes
import jobPropTypes from "../../untils/propTypes/jobPropTypes";

const JobDescription = ({ job }) => {
  return (
    <div className="p-4 rounded-lg bg-white mt-6">
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
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Quyền lợi */}
      <div className="pt-4">
        <p className="font-bold">Quyền lợi</p>
        <p>- Không áp dụng doanh số</p>
      </div>

      {/* Việc làm liên quan */}
      <div className="mt-8">
        <div className="flex items-center">
          <div className="bg-primary py-4 px-1 me-2"></div>
          <p className="font-bold text-lg">Việc làm liên quan</p>
        </div>
      </div>
    </div>
  );
};

JobDescription.propTypes = {
  job: jobPropTypes.isRequired,
};

export default JobDescription;

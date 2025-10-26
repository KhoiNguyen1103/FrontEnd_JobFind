import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import companyApi from "../../api/companyApi";
import JobItemv2 from "../../components/ui/JobItemv2";
import jobApi from "../../api/jobApi";

const CompanyDetail = () => {
  // Lấy id từ query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("id");
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("jobs");
  const jobsPerPage = 4;

  useEffect(() => {
    // Lấy thông tin company
    const fetchCompanyData = async () => {
      try {
        const response = await companyApi.getById(companyId);

        // Kiểm tra dữ liệu có hợp lệ không
        if (
          response &&
          typeof response === "object" &&
          Object.keys(response).length > 0
        ) {
          setCompany(response);
        } else {
          console.warn("Không có dữ liệu công ty phù hợp.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    // Lấy danh sách job của công ty
    const fetchJobsByCompanyId = async () => {
      try {
        const response = await jobApi.getByCompanyId(companyId, companyId);
        setJobs(response);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách công việc:", error);
      }
    };

    fetchCompanyData();
    fetchJobsByCompanyId();
  }, [companyId]);

  // Tính toán phân trang
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="container mx-auto py-4">
      {/* Header */}
      <header className="bg-white shadow-sm top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to={"/company"}
                className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="pe-2" />
                <span className="text-sm font-medium">
                  Xem danh sách công ty
                </span>
              </Link>
            </div>
          </div>

          {/* Các tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "jobs"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              } cursor-pointer !rounded-button whitespace-nowrap`}
              onClick={() => setActiveTab("jobs")}
            >
              {/* Jobs ({company.jobCount}) */}
              Jobs (Số lượng job)
            </button>
            <button
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "reviews"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              } cursor-pointer !rounded-button whitespace-nowrap`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
        </div>
      </header>
      {/* End: header */}

      {/* Banner */}
      {company && (
        <div className="relative rounded-xl overflow-hidden mb-12 mt-2">
          <div className="h-80 w-full">
            <img
              src={company.logoPath ? company.logoPath : "/image_error.png"}
              alt="Ảnh logo công ty"
              className="w-full h-full object-contain object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-transparent flex items-center">
              <div className="px-8 py-6 max-w-2xl">
                <h1 className="text-4xl font-bold text-black mb-3">
                  {company.companyName}
                </h1>
                {company.industry && (
                  <div className="inline-flex items-center bg-green-600/90 text-white px-3 py-1 rounded-full text-sm mb-4">
                    <i className="fas fa-building mr-1"></i>
                    {company.industry.map((item, index) => (
                      <span key={index}>
                        {item.name}
                        {index < company.industry.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-black/80 text-lg">
                  <span className="font-semibold">Địa chỉ:</span> Hồ Chí Minh
                </p>
                <p className="text-black/80 text-lg">
                  <span className="font-semibold">Email:</span> {company.email}
                </p>
                <p className="text-black/80 text-lg">
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  {company.phoneNumber}
                </p>
                <p className="text-black/80 text-lg">
                  <span className="font-semibold">Website:</span>{" "}
                  {company.website ? company.website : "Chưa có website"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End: Banner */}

      {/* Tab overview */}
      {activeTab === "jobs" && (
        <>
          {/* Featured Jobs Preview */}
          <div className="bg-white/70 rounded-xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Danh sách công việc
              </h2>
            </div>

            <div className="space-y-4">
              {jobs ? (
                jobs.slice(0, 4).map((job, index) => (
                  <div
                    key={index}
                    className="hover:shadow-lg hover:-translate-y-1 transition duration-300"
                  >
                    <JobItemv2 job={job} />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Không có công việc nào được tìm thấy.
                </div>
              )}

              {totalPages > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyDetail;

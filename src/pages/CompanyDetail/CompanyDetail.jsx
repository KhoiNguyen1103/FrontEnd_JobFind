import {
  faAngleDown,
  faArrowUpWideShort,
  faCalendar,
  faChevronLeft,
  faList,
  faLocationDot,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import citys from "../../data/citys";
import Pagination from "../../components/ui/Pagination";
import companyApi from "../../api/companyApi";
import JobItemv2 from "../../components/ui/JobItemv2";
import jobApi from "../../api/jobApi";
import ReviewCompanyItem from "../../components/ui/ReviewCompanyItem";
import { sortReviews } from "../../redux/slices/companyReviewSlice";
import { fetchReviewsByCompanyId } from "../../redux/slices/companyReviewSlice";

const filters = [
  {
    id: 1,
    icon: faList,
    name: "Nghề nghiệp",
    options: [],
  },
  {
    id: 2,
    icon: faLocationDot,
    name: "Địa điểm",
    options: ["Tất cả địa điểm", ...citys],
  },
  {
    id: 3,
    icon: faCalendar,
    name: "Ngày đăng",
    options: [
      { id: 1, name: "Tất cả ngày đăng" },
      { id: 2, name: "Hôm nay" },
      { id: 3, name: "Tuần trước" },
      { id: 4, name: "Tháng trước" },
      { id: 5, name: "3 tháng qua" },
    ],
  },
  {
    id: 4,
    icon: faList,
    name: "Hình thức",
    options: [
      { id: 1, name: "Toàn thời gian" },
      { id: 2, name: "Bán thời gian" },
    ],
  },
];

const CompanyDetail = () => {
  const dispatch = useDispatch();
  // Lấy id từ query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("id");

  // state
  const [activeTab, setActiveTab] = useState("reviews");
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isReviewDropdownOpen, setIsReviewDropdownOpen] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("Mới nhất");

  // selector from redux
  const categoriesRedux = useSelector((state) => state.category.categories);
  const reviewsRedux = useSelector((state) => state.companyReview.reviews);
  useEffect(() => {
    // console.log("categoriesRedux", categoriesRedux);
    if (categoriesRedux && categoriesRedux.length > 0) {
      setCategories(categoriesRedux);
      filters[0].options = categoriesRedux;
    }
  }, [categoriesRedux]);

  // fetch data
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
        // console.log("response", response);
        setJobs(response);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách công việc:", error);
      }
    };

    // Lấy danh sách review của công ty
    const fetchReviews = async () => {
      try {
        const response = await dispatch(
          fetchReviewsByCompanyId(companyId)
        ).unwrap();
      } catch (error) {
        console.log("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };

    fetchCompanyData();
    fetchJobsByCompanyId();
    fetchReviews();
  }, [companyId, dispatch]);

  // handle filter dropdown selected
  const handleSelectFilterOption = (filterId, option) => {
    setSelectedFilters((prev) => ({ ...prev, [filterId]: option }));
    setOpenDropdownId(null);
  };

  const handleSelectReviewOption = (option) => {
    setSelectedReviewFilter(option);
    setIsReviewDropdownOpen(false);
    dispatch(sortReviews(selectedReviewFilter));
  };

  // Tính toán phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
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
              Công việc ( {jobs.length || 0} công việc)
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

      {/* Tab jobs */}
      {activeTab === "jobs" && (
        <>
          {/* Featured Jobs Preview */}
          <div className="bg-white/70 rounded-xl shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 pb-6">
                {jobs?.length + " việc làm hiện có"}
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-8">
                {filters.map((filter) => (
                  <div key={filter.name} className="relative">
                    <button
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center justify-between min-w-[140px] cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === filter.id ? null : filter.id
                        )
                      }
                    >
                      <FontAwesomeIcon icon={filter.icon} />
                      <span>{selectedFilters[filter.id] || filter.name}</span>
                    </button>

                    {openDropdownId === filter.id && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        {filter.options.map((option) => (
                          <button
                            key={option.id || option.name}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                            onClick={() =>
                              handleSelectFilterOption(
                                filter.id,
                                option.name || option
                              )
                            }
                          >
                            {option.name || option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* End: filters */}
            </div>

            {/* jobs list + pagination */}
            <div className="space-y-4">
              {jobs ? (
                currentJobs.slice(0, 4).map((job, index) => (
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
            {/* End: jobs list + pagination */}
          </div>
        </>
      )}

      {/* Tab reviews */}
      {activeTab === "reviews" && (
        <div className="bg-[#FFFFF0] rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            {/* rating star + rating count */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đánh giá công ty
              </h2>

              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <span className="text-3xl font-bold text-gray-900 mr-2">
                    {4.5}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className="fas fa-star text-yellow-400 text-xl"
                      />
                    ))}
                    <FontAwesomeIcon
                      icon={faStarHalfStroke}
                      className="fas fa-star text-yellow-400 text-xl"
                    />
                  </div>
                </div>
                <span className="text-gray-500">Dựa trên 127 đánh giá</span>
              </div>
            </div>
            {/* End: rating star + rating count */}

            {/* filter review */}
            <div className="relative">
              <button
                onClick={() => setIsReviewDropdownOpen(!isReviewDropdownOpen)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center min-w-[120px] cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faArrowUpWideShort} />
                <span className="px-2">{selectedReviewFilter}</span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`transition-transform ${
                    isReviewDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isReviewDropdownOpen && (
                <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {["Mới nhất", "Cũ nhất", "Đánh giá cao", "Đánh giá thấp"].map(
                    (option) => (
                      <button
                        key={option}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                        onClick={() =>
                          handleSelectReviewOption(option.name || option)
                        }
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            {/* End: filter review */}
          </div>

          {/* reviews list */}
          <div>
            {reviewsRedux.length > 0 ? (
              <div>
                {reviewsRedux.map((review) => (
                  <ReviewCompanyItem key={review.reviewId} review={review} />
                ))}
              </div>
            ) : (
              <div className="bg-white/70 rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Đánh giá
                </h2>
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
              </div>
            )}
          </div>
          {/* End: reviews list */}
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;

import { useState, useEffect } from "react";
import BestJob from "./BestJob";
import BestCategory from "./BestCategory";
import jobApi from "../../api/jobApi";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import createSlug from "../../untils/createSlug";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [priorityJobs, setPriorityJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0); // Track navigation direction
  const jobsPerPage = 3;
  const navigate = useNavigate();
  const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");

  useEffect(() => {
    const fetchPriorityJobs = async () => {
      try {
        setLoading(true);
        const response = await jobApi.getJobPriority();
        if (response && response.length > 0) {
          setPriorityJobs(response);
          if (!hasSeenPopup) {
            setShowPopup(true);
            sessionStorage.setItem("hasSeenPopup", "true");
          }
        } else {
          setShowPopup(false);
        }
      } catch (error) {
        console.error("Error fetching priority jobs:", error);
        setShowPopup(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPriorityJobs();
  }, []);

  const handleNext = () => {
    setDirection(1); // Forward
    if (currentIndex + jobsPerPage < priorityJobs.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop to start
    }
  };

  const handlePrev = () => {
    setDirection(-1); // Backward
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(
        Math.max(
          0,
          Math.floor((priorityJobs.length - 1) / jobsPerPage) * jobsPerPage
        )
      ); // Loop to last set
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const displayedJobs = priorityJobs.slice(
    currentIndex,
    currentIndex + jobsPerPage
  );
  const totalJobs = priorityJobs.length;

  const navigateToJobDetail = (job) => {
    const slug = createSlug(job.title || job.jobName);
    navigate(`/job-detail/${slug}?id=${job.jobId}`);
    // scrollTop();
  };

  // Animation variants for sliding
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div>
      {showPopup && !loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-7xl w-full mx-4 relative flex items-center">
            {/* Previous Button */}
            {priorityJobs.length > jobsPerPage && (
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-200"
              >
                <FaChevronLeft size={20} />
              </button>
            )}

            <div className="flex-1">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Việc Làm Nổi Bật
              </h2>
              {/* Job Counter */}
              {totalJobs > 0 && (
                <p className="text-center text-gray-600 mb-4">
                  Đang xem {currentIndex + 1} -{" "}
                  {Math.min(currentIndex + jobsPerPage, totalJobs)} /{" "}
                  {totalJobs} công việc
                </p>
              )}
              {displayedJobs.length > 0 ? (
                <AnimatePresence
                  initial={false}
                  mode="popLayout"
                  custom={direction}
                >
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {displayedJobs.map((job) => (
                      <div
                        key={job.jobId}
                        className="border border-gray-200 rounded-lg p-6 flex flex-col text-left shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center mb-4">
                          <img
                            src={job.company.logoPath}
                            alt={job.company.companyName}
                            className="w-16 h-16 rounded-full object-contain mr-4"
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {job.title}
                            </h3>
                            <p className="text-gray-600">
                              {job.company.companyName}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium">Địa điểm:</span>{" "}
                          {job.location}
                        </p>
                        <p className="text-green-600 font-bold mb-2 text-lg">
                          <span className="font-medium">Mức lương:</span>{" "}
                          {job.salaryMin.toLocaleString()} -{" "}
                          {job.salaryMax.toLocaleString()} VND
                        </p>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium"></span> {job.jobType}
                        </p>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium">Kinh nghiệm:</span>{" "}
                          {job.yearsOfExperience} năm
                        </p>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium">Trình độ:</span>{" "}
                          {job.educationLevel}
                        </p>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium">Kỹ năng:</span>{" "}
                          {job.skills.map((s) => s.name).join(", ")}
                        </p>
                        <p className="text-gray-700 mb-2 text-lg">
                          <span className="font-medium">Ngày đăng:</span>{" "}
                          {new Date(job.postedAt).toLocaleDateString("vi-VN")}
                        </p>
                        <p className="text-gray-700 mb-4 text-lg">
                          <span className="font-medium">Hạn nộp:</span>{" "}
                          {new Date(job.deadline).toLocaleDateString("vi-VN")}
                        </p>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 w-full"
                          onClick={() => navigateToJobDetail(job)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <p className="text-center text-gray-600">
                  Không có việc làm nổi bật.
                </p>
              )}
            </div>

            {/* Next Button */}
            {priorityJobs.length > jobsPerPage && (
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-200"
              >
                <FaChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <div>
        <BestJob />
        <BestCategory />
      </div>
    </div>
  );
};

export default Home;

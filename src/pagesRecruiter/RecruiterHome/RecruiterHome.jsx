import { useState, useEffect } from "react";
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";
import jobSeekerApi from "../../api/jobSeekerApi";
import subscriptionPlanApi from "../../api/subscriptionPlanApi";
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';
import { useSelector, useDispatch } from "react-redux";
import { fetchSavedJobseekers } from "../../redux/slices/savedJobseekerSlice";
import { useNavigate } from "react-router-dom";

const RecruiterHome = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [plans, setPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const totalPages = 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPlanPopup");
    const isVip = user?.vip;

    if (!hasSeenPopup && isVip === false) {
      setShowPopup(true);
      sessionStorage.setItem("hasSeenPlanPopup", "true");
    }

    const fetchPlans = async () => {
      try {
        const response = await subscriptionPlanApi.listAllSubscriptionPlans();
        const activePlans = response
          .filter((plan) => plan.isActive)
          .slice(0, 2);
        setPlans(activePlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    const fetchJobSeekers = async () => {
      try {
        const user = localStorage.getItem("user");
        const userObject = JSON.parse(user);
        const companyId = userObject.userId;
        const [jobSeekerRes] = await Promise.all([
          jobSeekerApi.findJobSeekersByCompanyIndustry(companyId),
          dispatch(fetchSavedJobseekers()).unwrap(),
        ]);
        const transformedData = transformJobSeekerData(jobSeekerRes);
        setJobSeekers(transformedData);
      } catch (error) {
        console.error("Error fetching job seekers:", error);
      }
    };

    fetchPlans();
    fetchJobSeekers();
  }, [dispatch]);

  const handleSubscribe = (planId) => {
    navigate("/recruiter/subscribe", { state: { selectedPlanId: planId } });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="py-6">
      <div className="container mx-auto">
        {/* Subscription Plan Popup */}
        {showPopup && plans.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Chọn gói đăng ký phù hợp
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{
                      __html: plan.description || "",
                    }} />
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ${plan.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500 mb-4">
                      {plan.durationMonths} tháng
                    </p>
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Đăng ký
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Existing RecruiterHome Content */}
        <div>
          <div className="flex justify-between items-center py-4">
            <p className="text-primary font-semibold text-xl">
              CV đề cử cho bạn
            </p>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Xem thêm
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {jobSeekers.map((profile, index) => (
              <CVItem key={index} profile={profile} />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default RecruiterHome;
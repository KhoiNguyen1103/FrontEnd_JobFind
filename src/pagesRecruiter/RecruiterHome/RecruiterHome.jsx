import { useState, useEffect } from "react";
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";
import jobSeekerApi from "../../api/jobSeekerApi";
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';
import { useSelector, useDispatch } from "react-redux";
import { fetchSavedJobseekers } from "../../redux/slices/savedJobseekerSlice";

const RecruiterHome = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const user = localStorage.getItem("user");
        const userObject = JSON.parse(user);
        const companyId = userObject.userId;
        const [jobSeekerRes] = await Promise.all([
          jobSeekerApi.findJobSeekersByCompanyIndustry(companyId),
          dispatch(fetchSavedJobseekers()).unwrap()
        ]);
        const transformedData = transformJobSeekerData(jobSeekerRes);
        setJobSeekers(transformedData);
      } catch (error) {
        console.error("Error fetching job seekers:", error);
      }
    };

    fetchJobSeekers();
  }, []);

  return (
    <div className="py-6">
      <div className="container mx-auto">
        {/* ====================== Top CV đề cử cho bạn ===================== */}
        <div>
          {/* Header */}
          <div className="flex justify-between items-center py-4">
            <p className="text-primary font-semibold text-xl">
              CV đề cử cho bạn
            </p>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Xem thêm
            </p>
          </div>
          {/* End: Header */}

          {/* List CV */}
          <div className="grid grid-cols-3 gap-4">
            {jobSeekers.map((profile, index) => (
              <CVItem key={index} profile={profile}/>
            ))}
          </div>
          {/* END: List CV */}
        </div>
        {/* ====================== End: Top CV đề cử cho bạn ===================== */}

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
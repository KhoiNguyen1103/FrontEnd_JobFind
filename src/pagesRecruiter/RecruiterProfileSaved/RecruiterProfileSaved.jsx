import { useState, useEffect } from 'react';
import savedJobSeekerApi from "../../api/savedJobSeekerApi";
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';
import { useDispatch, useSelector } from 'react-redux';

const RecruiterProfileSaved = () => {
  const savedJobSeekers = useSelector(state => state.savedJobseeker.savedList);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = localStorage.getItem("user");
  if (!user) {
    console.warn("Không tìm thấy user trong localStorage");
    setLoading(false);
    return;
  }

  const userObject = JSON.parse(user);
  const companyId = userObject?.userId;

  useEffect(() => {
    const fetchSavedJobSeekers = async () => {

      try {
        setLoading(true);
        const response = await savedJobSeekerApi.getListSaved(companyId);
        const transformedData = transformJobSeekerData(response);
        setJobSeekers(transformedData);

        setTotalPages(response.totalPages || 1);
      } catch (error) {
        setError("Failed to fetch saved job seekers");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobSeekers();
  }, [companyId, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="py-6">
      <div className="container mx-auto">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center py-4">
            <p className="text-primary font-semibold text-xl">
              Danh sách CV yêu thích
            </p>
            <p className="text-green-500 hover:underline cursor-pointer">
              Xem thêm
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {jobSeekers.length > 0 ? (
              jobSeekers.map((profile, index) => (
                <CVItem key={index} profile={profile} />
              ))
            ) : (
              <p className="text-gray-500">Không có CV đã lưu</p>
            )}
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

export default RecruiterProfileSaved;

import { useState, useEffect } from 'react';
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";
import { transformJobSeekerData } from '../../untils/jobSeekerHelpers';
import { useSelector } from 'react-redux';

const RecruiterProfileSaved = () => {
  const savedJobSeekers = useSelector(state => state.savedJobseeker.savedList);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (savedJobSeekers.length > 0) {
      setTotalPages(Math.ceil(savedJobSeekers.length / 10));
    }
  }, [savedJobSeekers]);

  const displayedJobSeekers = transformJobSeekerData(savedJobSeekers).slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="py-6">
      <div className="container mx-auto">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center py-4">
            <p className="text-primary font-semibold text-xl">
              Danh sách CV yêu thích
            </p>
            <p className="text-blue-500 hover:underline cursor-pointer">
              Xem thêm
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {savedJobSeekers.length > 0 ? (
              displayedJobSeekers.map((profile, index) => (
                <CVItem key={index} profile={profile}/>
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

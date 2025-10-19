// component
import { useState } from "react";
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";

const profileJobSeekers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    job: "Kỹ sư phần mềm",
    experience: 5,
    salary_min: 20,
    salary_max: 30,
    location: "Hồ Chí Minh",
    education: "Đại học",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    job: "Kỹ sư phần mềm",
    experience: 5,
    salary_min: 20,
    salary_max: 30,
    location: "Hồ Chí Minh",
    education: "Đại học",
  },
  {
    id: 3,
    name: "Nguyễn Văn A",
    job: "Kỹ sư phần mềm",
    experience: 5,
    salary_min: 20,
    salary_max: 30,
    location: "Hồ Chí Minh",
    education: "Đại học",
  },
];

const RecruiterHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

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
            {profileJobSeekers.map((profile) => (
              <CVItem key={profile.id} profile={profile} />
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

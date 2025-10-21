import { useState, useEffect } from "react";
import CVItem from "../../components/ui/CVItem";
import Pagination from "../../components/ui/Pagination";
import jobSeekerApi from "../../api/jobSeekerApi";

const RecruiterHome = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; 

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    const companyId = userObject.userId;

    jobSeekerApi.findJobSeekersByCompanyIndustry(companyId)
      .then(response => {
        const data = response;
        const transformedData = data.map(jobSeeker => {
          const { profileId, firstName, lastName, address, title, workExperiences, skills } = jobSeeker;

          const totalExperience = workExperiences.reduce((total, exp) => {
            const startDate = new Date(exp.startDate);
            const endDate = exp.endDate ? new Date(exp.endDate) : ""; 
            const yearsExperience = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365); 
            return total + yearsExperience;
          }, 0);

          const skillsList = skills.map(skill => skill.name).join(", ");

          return {
            profileId: profileId,
            firstName: firstName,
            lastName: lastName,
            title: title,
            address: address,
            experience: Math.floor(totalExperience), 
            skills: skills,
          };
        });

        setJobSeekers(transformedData);
      })
      .catch(error => {
        console.error("Error fetching job seekers:", error);
      });
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
              <CVItem key={index} profile={profile} />
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
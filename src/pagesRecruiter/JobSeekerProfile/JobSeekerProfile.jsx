import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import jobSeekerApi from "../../api/jobSeekerApi";
import ButtonSaveJobSeeker from "../../components/button/ButtonSaveJobSeeker";

const JobSeekerProfile = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    jobSeekerApi.getProfileById(profileId)
      .then(response => {
        setProfile(response);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
      });
  }, [profileId]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years > 0 ? years + " năm" : ""}${months > 0 ? (years > 0 ? " " : "") + months + " tháng" : ""}`;
  };

  return (
    <div className="profile py-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <img
              src={
                profile.avatar && profile.avatar.trim() !== ""
                  ? profile.avatar
                  : "https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png"
              }
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-green-500"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h1>
              <p className="text-gray-600 text-base">{profile.title}</p>
            </div>
          </div>
          <div>
            <ButtonSaveJobSeeker profileId={profileId} />
            <FontAwesomeIcon
              icon={faMessage}
              className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700 transition"
            />
          </div>

        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Experience */}
          <div className="lg:w-2/3 bg-gradient-to-b from-white to-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Kinh Nghiệm</h2>
            <div className="space-y-6">
              {profile.workExperiences
                .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
                .map((experience, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-green-500">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5"></div>
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={experience.logo}
                        alt={experience.companyName}
                        className="w-10 h-10 object-cover rounded-full"
                      />                      <h4 className="text-lg font-semibold text-gray-800">{experience.companyName}</h4>
                    </div>
                    <p className="text-gray-700 font-medium text-base">{experience.jobTitle}</p>
                    <p className="text-gray-500 text-base">
                      {experience.startDate} ⭢ {experience.endDate ? experience.endDate : "Hiện tại"} • {calculateDuration(experience.startDate, experience.endDate)}
                    </p>
                    <p className="text-gray-600 text-base mt-1 italic">{experience.description}</p>
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-gray-700">Kỹ năng:</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(experience.skills) && experience.skills.length > 0 ? (
                          experience.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm"
                            >
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-base text-gray-500">Chưa cập nhật</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right: Personal Info, Skills, CV */}
          <div className="lg:w-1/3 space-y-6">
            {/* Personal Info */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Cá Nhân</h2>
              <div className="space-y-3">
                <p className="flex items-center text-base text-gray-700">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-green-600 mr-2" />
                  <span><strong>Email:</strong> {profile.email}</span>
                </p>
                <p className="flex items-center text-base text-gray-700">
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-green-600 mr-2" />
                  <span><strong>Số điện thoại:</strong> {profile.phone}</span>
                </p>
                <p className="flex items-center text-base text-gray-700">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-green-600 mr-2" />
                  <span><strong>Địa chỉ:</strong> {profile.address}</span>
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Kỹ Năng</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-base hover:bg-green-200 transition"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <p className="text-base text-gray-500">Chưa cập nhật</p>
                )}
              </div>
            </div>

            {/* CV */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Hồ Sơ CV</h2>
              {profile.resumeList && profile.resumeList.length > 0 ? (
                <div className="space-y-3">
                  {profile.resumeList.map((resume, index) => (
                    <div key={index} className="flex items-center justify-between border-b py-2">
                      <div>
                        <a
                          href={resume.resumePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 text-base font-medium hover:underline"
                        >
                          {resume.resumeName}
                        </a>
                        <p className="text-sm text-gray-500">
                          Tải lên: {new Date(resume.uploadedAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <a
                        href={resume.resumePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition"
                      >
                        Tải xuống
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base text-gray-500">Chưa có CV</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
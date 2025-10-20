import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonSaveJobSeeker from "../../components/button/ButtonSaveJobSeeker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import jobSeekerApi from "../../api/jobSeekerApi";

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
    return <div>Loading...</div>;
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
    <div className="profile py-6">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600">{profile.title}</p>
          </div>
          <div className="grow text-right">
            <ButtonSaveJobSeeker />
            <FontAwesomeIcon
              icon={faMessage}
              className="h-6 w-6 text-green-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <p className="mb-2 mt-1">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="mb-2">
            <strong>Số điện thoại:</strong> {profile.phone}
          </p>
          <p className="mb-2">
            <strong>Địa chỉ:</strong> {profile.address}
          </p>
        </div>

        {/* Kinh nghiệm */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Kinh nghiệm</h3>
          <div className="mt-4 ml-2">
            {profile.workExperiences
              .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
              .map((experience, index) => (
                <div key={index} className="relative pb-6 pl-6 border-l-4">
                  <div className="absolute w-5 h-5 bg-primary rounded-full -left-3 top-0"></div>

                  <div className="flex items-center gap-4">
                    <img
                      src={experience.logo}
                      alt={experience.companyName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <h4 className="text-lg font-semibold">{experience.companyName}</h4>
                  </div>

                  <p className="text-gray-600 font-bold mb-1">
                    {experience.jobTitle}
                  </p>

                  <p className="text-gray-600">
                    {experience.startDate} ⭢{" "}
                    {experience.endDate ? experience.endDate : "Hiện tại"} • {calculateDuration(experience.startDate, experience.endDate)}
                  </p>

                  <p className="text-gray-700 mt-2 italic">{experience.description}</p>

                  <div className="mt-2">
                    <h5 className="text-sm font-semibold mb-1">Kỹ năng:</h5>
                    {Array.isArray(experience.skills) && experience.skills.length > 0 ? (
                      experience.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm mr-2"
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">Chưa cập nhật</p>
                    )}
                  </div>

                </div>
              ))}
          </div>
        </div>

        {/* Kỹ năng */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Kỹ năng</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-600">Chưa cập nhật</p>
            )}
          </div>
        </div>
        {/* CV */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Hồ sơ CV</h2>
          {profile.resumeList && profile.resumeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {profile.resumeList.map((resume, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <a
                    href={resume.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-lg font-semibold hover:underline"
                  >
                    {resume.resumeName}
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Tải lên lúc:{" "}
                    <span className="font-medium text-gray-700">
                      {new Date(resume.uploadedAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">Chưa có CV</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobSeekerProfile;

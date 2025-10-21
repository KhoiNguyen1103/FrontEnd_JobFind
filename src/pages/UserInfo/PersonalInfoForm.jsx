import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import ProfileHeader from "./ProfileHeader";
import SkillsList from "./SkillsList";
import WorkExperience from "./WorkExperience";
import UploadedCVs from "./UploadedCVs";
import { useEffect, useState } from "react";

const PersonalInfoForm = () => {
  const profileJSK = useSelector((state) => state.jobSeekerProfile.profile);
  console.log("profileJSK", profileJSK); // Lấy profile từ redux
  const loading = useSelector((state) => state.jobSeekerProfile.loading); // Lấy trạng thái loading từ redux
  const [isEditMode, setIsEditMode] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);

  const handleAddSkill = (newSkill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  // Khi profileJSK thay đổi thì set lại các giá trị form
  useEffect(() => {
    console.log("Skills: ", skills);
    if (profileJSK) {
      setFullName(`${profileJSK.firstName} ${profileJSK.lastName}`);
      setPhone(profileJSK.phone || "");
      setEmail(profileJSK.email || "");
      setSkills(profileJSK.skills || []);
    }
  }, [profileJSK]);

  // Nếu đang loading hoặc không có profile, hiển thị loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>{" "}
        {/* Bạn có thể thay spinner bằng biểu tượng loading của bạn */}
      </div>
    );
  }

  if (!profileJSK) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Không có dữ liệu hồ sơ</p>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden rounded-lg"
      style={{
        fontFamily: 'Manrope, "Noto Sans", sans-serif',
        // backgroundColor: "#e7eee7",
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-between py-5">
          <div className="w-[200px] flex flex-col gap-1">
            <Sidebar />
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111811] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Profile
              </p>
              <div className="flex justify-end px-4">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="bg-[#638863] text-white px-4 py-2 rounded-md hover:bg-[#4e6d4e] transition"
                >
                  {isEditMode ? "Hủy chế độ sửa" : "Chế độ chỉnh sửa"}
                </button>
              </div>
            </div>

            {/* ======================= Profile Header ======================== */}
            <ProfileHeader profileJSK={profileJSK} isUpdateMode={isEditMode} />

            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              {/* ====================== Phone =================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Phone number
                </p>
                {isEditMode ? (
                  <input
                    type="text"
                    className="border border-gray-300 px-2 py-1 rounded-md text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <p className="text-[#111811] text-sm font-normal leading-normal">
                    (+84) {profileJSK?.phone || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              {/* ======================== Email ================= */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Email
                </p>
                {isEditMode ? (
                  <input
                    type="email"
                    className="border border-gray-300 px-2 py-1 rounded-md text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p className="text-[#111811] text-sm font-normal leading-normal">
                    {email || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              {/* ========================== Skills ============================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Skills
                </p>
                {profileJSK?.skills?.length === 0 ? (
                  <p className="text-[#111811] text-sm font-normal leading-normal">
                    Chưa cập nhật
                  </p>
                ) : (
                  <SkillsList
                    skills={skills}
                    isEditMode={isEditMode}
                    onAddSkill={handleAddSkill}
                  />
                )}
              </div>

              {/* ===================== Work Experience ======================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Work Experience
                </p>
                <WorkExperience />
              </div>

              {/* ====================== Uploaded Cvs =========================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Uploaded CV
                </p>
                <UploadedCVs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

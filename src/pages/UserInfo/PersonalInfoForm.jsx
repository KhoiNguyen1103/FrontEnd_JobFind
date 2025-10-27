import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import ProfileHeader from "./ProfileHeader";
import SkillsList from "./SkillsList";
import WorkExperience from "./WorkExperience";
import UploadedCVs from "./UploadedCVs";
// import resumeApi from "../../api/resumeApi";
import { useEffect, useRef, useState } from "react";
import resumeApi from "../../api/resumeApi";
import { toast } from "react-toastify";
import userApi from "../../api/userApi";

const PersonalInfoForm = () => {
  const profileJSK = useSelector((state) => state.jobSeekerProfile.profile);
  const loading = useSelector((state) => state.jobSeekerProfile.loading); // Lấy trạng thái loading từ redux
  const upLoadCvsRef = useRef(null);

  const [avatar, setAvatar] = useState(
    "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [cvs, setCvs] = useState([]); // Khởi tạo với danh sách CV từ profileJSK

  useEffect(() => {
    if (profileJSK) {
      setAvatar(
        profileJSK.avatar ||
          "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
      );
      setFirstName(profileJSK.firstName || "");
      setLastName(profileJSK.lastName || "");
      setAddress(profileJSK.address || "123 Gò Vấp, Hồ Chí Minh");
      setFullName(`${profileJSK.firstName} ${profileJSK.lastName}`);
      setPhone(profileJSK.phone || "");
      setEmail(profileJSK.email || "");
      setSkills(profileJSK.skills || []);
      setCvs(profileJSK.resumeList || []);
    }
  }, [profileJSK]);

  // console.log("profileJSK", profileJSK);
  // console.log("fullName", fullName);

  const handleAddSkill = (newSkill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Chỉ lấy file đầu tiên
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    const fileObject = {
      resumeName: nameWithoutExtension,
      resume: file,
    };
    console.log("files", fileObject);

    try {
      const formData = new FormData();
      formData.append("resumeName", fileObject.resumeName);
      formData.append("resume", fileObject.resume);

      const user = JSON.parse(localStorage.getItem("user"));
      const profileId = user?.id; // Lấy profileId từ localStorage
      if (!profileId) {
        console.error("Không tìm thấy profileId trong localStorage");
        return;
      }

      const response = await resumeApi.cretaeResume(profileId, formData); // profileJSK.id là profileId
      console.log("Upload thành công:", response.data);

      setCvs((prev) => [...prev, fileObject]); // Chỉ thêm vào state khi upload thành công
    } catch (error) {
      toast.error("Upload thất bại. Có vẻ file đã tồn tại trong hệ thống.", {
        autoClose: 1000,
      });
      console.error("Upload thất bại:", error);
    }
  };

  const handleDeleteCv = async (resumeId) => {
    try {
      const response = await resumeApi.deleteResume(resumeId);
      console.log("Xóa thành công:", response.data);
      setCvs((prev) => prev.filter((cv) => cv.resumeId !== resumeId)); // Cập nhật lại danh sách CV sau khi xóa
    } catch (error) {
      toast.error("Xóa thất bại", { autoClose: 1000 });
      console.error("Xóa thất bại:", error);
    }
  };

  const handleButtonClick = () => {
    upLoadCvsRef.current.click();
  };

  const handleSave = async () => {
    const formData = new FormData();

    if (avatar) formData.append("avatar", avatar); // avatar là File
    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (address) formData.append("address", address);
    if (phone) formData.append("phone", phone);
    if (email) formData.append("email", email);

    if (skills && skills.length > 0) {
      skills.forEach((skill) => {
        formData.append("skills", skill); // giả sử skill là mảng chuỗi
      });
    }

    try {
      const response = await userApi.updateProfile(formData); // API nhận multipart/form-data
      console.log("Cập nhật thành công:", response);
      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật: " + err.message);
    }
  };

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
          {/* Satrt: Side bar */}
          <div className="w-[200px] flex flex-col gap-1">
            <Sidebar />
          </div>
          {/* End: Sidebar */}

          {/* Start: Content section */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Start: Nút Chỉnh sửa */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111811] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Profile
              </p>
              <div className="flex justify-end px-4 gap-3">
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                      Hủy chỉnh sửa
                    </button>
                    <button
                      onClick={handleSave} // bạn cần định nghĩa hàm này
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                  >
                    Chế độ chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            {/* End: Nút chỉnh sửa */}

            {/* Start: Header */}
            <ProfileHeader
              profileJSK={profileJSK}
              isEditMode={isEditMode}
              avatar={avatar}
              setAvatar={setAvatar}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              address={address}
              setAddress={setAddress}
            />
            {/* End: Header */}

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
                <SkillsList
                  skills={skills}
                  isEditMode={isEditMode}
                  onAddSkill={handleAddSkill}
                />
              </div>

              {/* ===================== Work Experience ======================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <p className="text-[#638863] text-sm font-normal leading-normal">
                  Work Experience
                </p>
                <WorkExperience
                  isEditMode={isEditMode}
                  workExperiences={profileJSK.workExperiences}
                />
              </div>

              {/* ====================== Uploaded Cvs =========================== */}
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce5dc] py-5">
                <div>
                  <p className="text-[#638863] text-sm font-normal leading-normal pb-3">
                    Uploaded CV
                  </p>
                  {/* Nút Upload */}
                  {
                    // isEditMode && (
                    <>
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#e1e7e1] text-[#111811] text-sm font-medium leading-normal w-fit"
                        onClick={handleButtonClick}
                      >
                        <span className="truncate">Upload</span>
                      </button>

                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUploadFiles(e.target.files)}
                        accept=".pdf, .doc, .docx"
                        ref={upLoadCvsRef}
                        // multiple
                      />
                    </>
                    // )
                  }

                  {/* end: bút upload cvs */}
                </div>

                <UploadedCVs
                  // cvs={profileJSK?.resumeList}
                  cvs={cvs}
                  isEditMode={isEditMode}
                  handleDeleteCv={handleDeleteCv}
                />
              </div>
            </div>
          </div>
          {/* End: Content section */}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

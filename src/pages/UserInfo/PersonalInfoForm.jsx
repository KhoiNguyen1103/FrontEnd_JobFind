import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import ProfileHeader from "./ProfileHeader";
import SkillsList from "./SkillsList";
import WorkExperience from "./WorkExperience";
import UploadedCVs from "./UploadedCVs";
// import resumeApi from "../../api/resumeApi";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import resumeApi from "../../api/resumeApi";
import userApi from "../../api/userApi";
import { addCV } from "../../redux/slices/JSKerProfileSlice";

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  // lấy data từ redux
  const user = useSelector((state) => state.auth.user);
  const profileJSK = useSelector((state) => state.jobSeekerProfile.profile);

  const loading = useSelector((state) => state.jobSeekerProfile.loading); // Lấy trạng thái loading từ redux
  const upLoadCvsRef = useRef(null);

  const [avatar, setAvatar] = useState(
    "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
  );
  const [avatarPreview, setAvatarPreview] = useState(
    avatar ||
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

  useEffect(() => {
    if (profileJSK) {
      setAvatar(
        profileJSK.avatar ||
          "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
      );
      setAvatarPreview(
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
    }
  }, [profileJSK]);

  const handleAddSkill = (newSkill) => {
    setSkills((prev) => [...prev, newSkill]);
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // Chỉ lấy file đầu tiên

    // Gọi Redux thunk addCV để upload và cập nhật store
    dispatch(addCV(file));
  };

  const handleButtonClick = () => {
    upLoadCvsRef.current.click();
  };

  const handleSave = async () => {
    // Ưu tiên phone nếu có
    const finalPhone = phone ? phone : profileJSK.phone;

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(finalPhone)) {
      alert("Số điện thoại phải có 10 hoặc 11 chữ số.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("phoneNumber", finalPhone);

    if (avatar) formData.append("avatar", avatar);
    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (address) formData.append("address", address);

    // console log data
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // if (skills && skills.length > 0) {
    //   skills.forEach((skill) => {
    //     formData.append("skills", skill); // giả sử skill là mảng chuỗi
    //   });
    // }

    try {
      const response = await userApi.updateProfile(formData); // API nhận multipart/form-data
      console.log("Cập nhật thành công:", response);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Lỗi khi cập nhật: " + err);
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
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
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
              avatarPreview={avatarPreview}
              setAvatarPreview={setAvatarPreview}
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
                    onChange={(e) => {
                      return setPhone(e.target.value);
                    }}
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
                    readOnly
                    disabled
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

                <UploadedCVs />
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

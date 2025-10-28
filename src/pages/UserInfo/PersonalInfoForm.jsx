import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "./SideBar";
import ProfileHeader from "./ProfileHeader";
import SkillsList from "./SkillsList";
import WorkExperience from "./WorkExperience";
import UploadedCVs from "./UploadedCVs";
import jobSeekerApi from "../../api/jobSeekerApi";
import userApi from "../../api/userApi";
import skillApi from "../../api/skillApi";
import jobCategoryApi from "../../api/jobCategoryApi";
import { addCV } from "../../redux/slices/JSKerProfileSlice";
import { login } from "../../redux/slices/authSlice";

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileJSK = useSelector((state) => state.jobSeekerProfile.profile);
  const loading = useSelector((state) => state.jobSeekerProfile.loading);
  const upLoadCvsRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [skills, setSkills] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [skillMap, setSkillMap] = useState(new Map());
  const [categoryMap, setCategoryMap] = useState(new Map());
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [skillsRes, categoriesRes] = await Promise.all([
          skillApi.getAll(),
          jobCategoryApi.getAll(),
        ]);
        const skillMap = new Map(
          skillsRes.map((s) => [s.skillId, s.name])
        );
        const categoryMap = new Map(
          categoriesRes.map((c) => [c.jobCategoryId, c.name])
        );
        setSkillMap(skillMap);
        setCategoryMap(categoryMap);

        if (profileJSK) {
          console.log("profileJSK.skills:", profileJSK.skills); // Debug
          setAvatar(profileJSK.avatar || "");
          setAvatarPreview(
            profileJSK.avatar ||
            "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
          );
          setAvatarChanged(false);
          setNewAvatar(null);
          setTitle(profileJSK.title || "");
          setFirstName(profileJSK.firstName || "");
          setLastName(profileJSK.lastName || "");
          setAddress(profileJSK.address || "");
          setPhone(profileJSK.phone || "");
          setEmail(profileJSK.email || "");
          setBirthDay(profileJSK.birthDay || "");

          const normalizedSkills = profileJSK.skills
            ?.map((s) => {
              if (typeof s === "object") {
                let skillId = s.skillId ?? s.id;
                if (!skillId && s.name) {
                  skillId = Array.from(skillMap.entries()).find(
                    ([, name]) => name.toLowerCase() === s.name.toLowerCase()
                  )?.[0];
                }
                if (skillId && skillMap.has(skillId)) {
                  return skillId;
                }
                console.warn(`Skill object not found in skillMap:`, s);
                return null;
              }
              const skillId = Array.from(skillMap.keys()).find(
                (id) => skillMap.get(id).toLowerCase() === s.toLowerCase()
              );
              if (skillId) {
                return skillId;
              }
              console.warn(`Skill string not found in skillMap: ${s}`);
              return null;
            })
            .filter((id) => id != null) || [];
          setSkills(normalizedSkills);

          setWorkExperiences(
            profileJSK.workExperiences?.map((exp) => ({
              ...exp,
              skills:
                exp.skills
                  ?.map((s) => {
                    if (typeof s === "object") {
                      let skillId = s.skillId ?? s.id;
                      if (!skillId && s.name) {
                        skillId = Array.from(skillMap.entries()).find(
                          ([, name]) => name.toLowerCase() === s.name.toLowerCase()
                        )?.[0];
                      }
                      if (skillId && skillMap.has(skillId)) {
                        return skillId;
                      }
                      console.warn(`Skill object not found in skillMap:`, s);
                      return null;
                    }
                    const skillId = Array.from(skillMap.keys()).find(
                      (id) => skillMap.get(id).toLowerCase() === s.toLowerCase()
                    );
                    if (skillId) {
                      return skillId;
                    }
                    console.warn(`WorkExp skill string not found: ${s}`);
                    return null;
                  })
                  .filter((id) => id != null) || [],
              categories:
                exp.categories
                  ?.map((c) => {
                    if (typeof c === "object") {
                      const catId = c.jobCategoryId ?? c.id;
                      if (catId && categoryMap.has(catId)) {
                        return catId;
                      }
                      console.warn(`Category object not found:`, c);
                      return null;
                    }
                    const catId = Array.from(categoryMap.keys()).find(
                      (id) => categoryMap.get(id).toLowerCase() === c.toLowerCase()
                    );
                    if (catId) {
                      return catId;
                    }
                    console.warn(`Category string not found: ${c}`);
                    return null;
                  })
                  .filter((id) => id != null) || [],
            })) || []
          );
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu: " + err.message);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [profileJSK]);

  const handleAddSkill = async (skillIds) => {
    try {
      const validSkillIds = skillIds.filter((id) => id != null && !isNaN(id));
      if (validSkillIds.length === 0) {
        toast.error("Không có kỹ năng hợp lệ để thêm!");
        return;
      }
      const skillRequest = { profileId: user.id, skills: validSkillIds };
      await jobSeekerApi.addSkill(skillRequest);
      setSkills(validSkillIds);
      toast.success("Thêm kỹ năng thành công!", { autoClose: 1000 });
    } catch (err) {
      toast.error("Lỗi khi thêm kỹ năng: " + err.message);
    }
  };

  const handleUpdateSkill = async (skillIds) => {
    try {
      const validSkillIds = skillIds.filter((id) => id != null && !isNaN(id));
      if (validSkillIds.length === 0) {
        toast.error("Không có kỹ năng hợp lệ để cập nhật!");
        return;
      }
      const skillRequest = { profileId: user.id, skills: validSkillIds };
      await jobSeekerApi.updateSkill(skillRequest);
      setSkills(validSkillIds);
      toast.success("Cập nhật kỹ năng thành công!", { autoClose: 1000 });
    } catch (err) {
      toast.error("Lỗi khi cập nhật kỹ năng: " + err.message);
    }
  };

  const handleAddWorkExperience = async (workExp) => {
    try {
      const workExpRequest = {
        jobPositionId: workExp.jobPositionId,
        companyId: workExp.companyId,
        description: workExp.description,
        jobType: workExp.jobType,
        startDate: workExp.startDate,
        endDate: workExp.endDate,
        skills: workExp.skills.filter((id) => id != null && !isNaN(id)),
        categories: workExp.categories.filter((id) => id != null && !isNaN(id)),
      };
      await jobSeekerApi.addWorkExperience(user.userId, workExpRequest);
      setWorkExperiences((prev) => [
        ...prev,
        { ...workExp, id: Date.now() },
      ]);
      toast.success("Thêm kinh nghiệm làm việc thành công!", { autoClose: 1000 });
    } catch (err) {
      toast.error("Lỗi khi thêm kinh nghiệm: " + err.message);
    }
  };

  const handleUpdateWorkExperience = async (index, updatedWorkExp) => {
    try {
      if (updatedWorkExp === null) {
        console.log("vv0 " + JSON.stringify(workExperiences[index].id))
        await jobSeekerApi.deleteWorkExperience(user.id, workExperiences[index].id);
        setWorkExperiences((prev) => prev.filter((_, i) => i !== index));
        toast.success("Xóa kinh nghiệm làm việc thành công!", { autoClose: 1000 });
        return;
      }
      const workExpRequest = {
        workExperienceId: updatedWorkExp.id,
        jobPositionId: updatedWorkExp.jobPositionId,
        companyId: updatedWorkExp.companyId,
        description: updatedWorkExp.description,
        jobType: updatedWorkExp.jobType,
        startDate: updatedWorkExp.startDate,
        endDate: updatedWorkExp.endDate,
        skills: updatedWorkExp.skills.filter((id) => id != null && !isNaN(id)),
        categories: updatedWorkExp.categories.filter((id) => id != null && !isNaN(id)),
      };
      await jobSeekerApi.updateWorkExperience(user.id, workExpRequest);
      setWorkExperiences((prev) =>
        prev.map((exp, i) => (i === index ? updatedWorkExp : exp))
      );
      toast.success("Cập nhật kinh nghiệm làm việc thành công!", { autoClose: 1000 });
    } catch (err) {
      toast.error("Lỗi khi cập nhật kinh nghiệm: " + err.message);
    }
  };

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      await dispatch(addCV(file)).unwrap();
      toast.success("Đã upload CV!", { autoClose: 600 });
    } catch (error) {
      const errorCode = error?.errorCode;
      const message = error?.message;

      if (errorCode === 400 && message?.includes("Resume name")) {
        toast.error("CV với tên này đã tồn tại!", { autoClose: 2000 });
      } else {
        toast.error("Đã có lỗi xảy ra khi upload CV.", { autoClose: 2000 });
      }

      console.error("Lỗi khi thêm CV:", error);
    }
  };

  const handleButtonClick = () => {
    upLoadCvsRef.current.click();
  };

  const handleSave = async () => {
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại phải có 10 hoặc 11 chữ số.", { autoClose: 1000 });
      return;
    }

    if (birthDay && new Date(birthDay) > new Date()) {
      toast.error("Ngày sinh không được trong tương lai.", { autoClose: 1000 });
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("phoneNumber", phone);
    if (avatarChanged && newAvatar && newAvatar.type.startsWith("image/")) {
      formData.append("avatar", newAvatar);
    } else if (avatarChanged && newAvatar) {
      toast.error("File avatar phải là ảnh!", { autoClose: 1000 });
      return;
    }
    if (firstName) formData.append("firstName", firstName);
    if (title) formData.append("title", title);
    if (lastName) formData.append("lastName", lastName);
    if (address) formData.append("address", address);
    if (birthDay) formData.append("birthDay", birthDay);

    console.log("formData:", Object.fromEntries(formData.entries()));
    if (avatarChanged) {
      console.log("Avatar:", { avatarChanged, newAvatar });
    }

    try {
      const response = await userApi.updateProfile(formData);
      const newAvatarUrl = response.data?.avatar || avatar;

      const updatedUser = {
        ...user,
        phone: phone,
        avatar: newAvatarUrl,
        firstName: firstName,
        lastName: lastName,
        title: title,
        address: address,
        birthDay: birthDay,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(login(updatedUser));
      toast.success("Cập nhật hồ sơ thành công!", { autoClose: 1000 });
      setAvatar(newAvatarUrl);
      setAvatarPreview(newAvatarUrl);
      setIsEditMode(false);
      setAvatarChanged(false);
      setNewAvatar(null);
    } catch (err) {
      toast.error("Lỗi khi cập nhật hồ sơ: " + err.message);
    }
  };

  // Skeleton loading
  const SkeletonProfile = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-1 gap-6">
        {Array(5)
          .fill()
          .map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="col-span-3 h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
      </div>
    </div>
  );

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonProfile />
        </div>
      </div>
    );
  }

  if (!profileJSK) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
        <p className="text-xl text-gray-600">Không có dữ liệu hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
              <div className="flex gap-3">
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition transform"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition transform"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition transform"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            <ProfileHeader
              profileJSK={profileJSK}
              isEditMode={isEditMode}
              avatar={avatar}
              setAvatar={setAvatar}
              avatarPreview={avatarPreview}
              setAvatarPreview={setAvatarPreview}
              avatarChanged={avatarChanged}
              setAvatarChanged={setAvatarChanged}
              newAvatar={newAvatar}
              setNewAvatar={setNewAvatar}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              title={title}
              setTitle={setTitle}
            />

            <div className="grid grid-cols-1 gap-8 mt-8">
              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-gray-600 font-medium">Chức danh</label>
                <div className="col-span-3">
                  {isEditMode ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800">{title || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-gray-600 font-medium">Số điện thoại</label>
                <div className="col-span-3">
                  {isEditMode ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800">(+84) {phone || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-gray-600 font-medium">Email</label>
                <div className="col-span-3">
                  {isEditMode ? (
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                      value={email}
                      readOnly
                      disabled
                    />
                  ) : (
                    <p className="text-gray-800">{email || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-gray-600 font-medium">Địa chỉ</label>
                <div className="col-span-3">
                  {isEditMode ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-800">{address || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-center">
                <label className="text-gray-600 font-medium">Ngày sinh</label>
                <div className="col-span-3">
                  {isEditMode ? (
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  ) : (
                    <p className="text-gray-800">{birthDay || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <label className="text-gray-600 font-medium">Kỹ năng</label>
                <div className="col-span-3">
                  <SkillsList
                    skills={skills}
                    skillMap={skillMap}
                    isEditMode={isEditMode}
                    onAddSkill={handleAddSkill}
                    onUpdateSkill={handleUpdateSkill}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <label className="text-gray-600 font-medium">Kinh nghiệm làm việc</label>
                <div className="col-span-3">
                  <WorkExperience
                    isEditMode={isEditMode}
                    workExperiences={workExperiences}
                    skillMap={skillMap}
                    categoryMap={categoryMap}
                    onAddWorkExperience={handleAddWorkExperience}
                    onUpdateWorkExperience={handleUpdateWorkExperience}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <label className="text-gray-600 font-medium">CV đã upload</label>
                <div className="col-span-3">
                  <button
                    className="px-4 py-2 mb-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition transform"
                    onClick={handleButtonClick}
                  >
                    Upload CV
                  </button>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUploadFiles(e.target.files)}
                    accept=".pdf,.doc,.docx"
                    ref={upLoadCvsRef}
                  />
                  <UploadedCVs />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
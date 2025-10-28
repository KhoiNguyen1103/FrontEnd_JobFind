import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const ProfileHeader = ({
  avatar,
  setAvatar,
  avatarPreview,
  setAvatarPreview,
  avatarChanged,
  setAvatarChanged,
  newAvatar,
  setNewAvatar,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isEditMode,
}) => {
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarClick = () => {
    if (isEditMode) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh!", { autoClose: 1000 });
        return;
      }
      setIsUploadingAvatar(true);
      setTimeout(() => {
        setNewAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarChanged(true);
        setIsUploadingAvatar(false);
      }, 500);
    }
  };

  return (
    <div className="flex gap-4 bg-white px-4 py-3 justify-between">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="relative w-[70px] h-[70px] rounded-lg cursor-pointer"
          onClick={handleAvatarClick}
          title={isEditMode ? "Click để đổi ảnh đại diện" : ""}
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
          {isEditMode && (
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
              📷
            </div>
          )}
          {isUploadingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Ẩn input file */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Thông tin */}
        <div className="flex flex-1 flex-col justify-center mt-2">
          {isEditMode ? (
            <>
              <input
                type="text"
                className="text-[#111811] text-base font-medium border rounded px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Họ"
              />
              <input
                type="text"
                className="text-[#111811] text-base font-medium border rounded px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tên"
              />
            </>
          ) : (
            <>
              <p className="text-[#111811] text-base font-medium leading-normal">
                {firstName} {lastName}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  avatar: PropTypes.string,
  setAvatar: PropTypes.func,
  avatarPreview: PropTypes.string,
  setAvatarPreview: PropTypes.func,
  avatarChanged: PropTypes.bool,
  setAvatarChanged: PropTypes.func,
  newAvatar: PropTypes.any,
  setNewAvatar: PropTypes.func,
  firstName: PropTypes.string,
  setFirstName: PropTypes.func,
  lastName: PropTypes.string,
  setLastName: PropTypes.func,
  title: PropTypes.string,
  setTitle: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default ProfileHeader;
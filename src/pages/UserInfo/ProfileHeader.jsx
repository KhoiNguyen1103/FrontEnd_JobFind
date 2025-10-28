import PropTypes from "prop-types";
import { useRef } from "react";

const ProfileHeader = ({
  avatar,
  setAvatar,
  avatarPreview,
  setAvatarPreview,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  isEditMode,
}) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isEditMode) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file); // Lưu file để upload
      setAvatarPreview(URL.createObjectURL(file)); // Lưu URL để hiển thị
    }
  };

  return (
    <div className="flex gap-4 bg-white px-4 py-3 justify-between">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] cursor-pointer relative"
          style={{ backgroundImage: `url('${avatarPreview}')` }}
          onClick={handleAvatarClick}
          title={isEditMode ? "Click để đổi ảnh đại diện" : ""}
        >
          {isEditMode && (
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
              📷
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
        <div className="flex flex-1 flex-col justify-center">
          {isEditMode ? (
            <>
              <input
                type="text"
                className="text-[#111811] text-base font-medium border rounded px-2 py-1 mb-1"
                value={firstName}
                onChange={(e) => {
                  return setFirstName(e.target.value);
                }}
                placeholder="Họ"
              />
              <input
                type="text"
                className="text-[#111811] text-base font-medium border rounded px-2 py-1 mb-1"
                value={lastName}
                onChange={(e) => {
                  return setLastName(e.target.value);
                }}
                placeholder="Tên"
              />
              <input
                type="text"
                className="text-[#638863] text-sm font-normal border rounded px-2 py-1"
                value={address}
                onChange={(e) => {
                  return setAddress(e.target.value);
                }}
                placeholder="Địa chỉ"
              />
            </>
          ) : (
            <>
              <p className="text-[#111811] text-base font-medium leading-normal">
                {firstName} {lastName}
              </p>
              <p className="text-[#638863] text-sm font-normal leading-normal">
                {address}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ProfileHeader.propTypes = {
//   avatar: PropTypes.string,
//   setAvatar: PropTypes.func,
//   firstName: PropTypes.string,
//   setFirstName: PropTypes.func,
//   lastName: PropTypes.string,
//   setLastName: PropTypes.func,
//   address: PropTypes.string,
//   setAddress: PropTypes.func,
//   isEditMode: PropTypes.bool,
// };

export default ProfileHeader;

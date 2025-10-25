import PropTypes from "prop-types";
import { useRef, useState } from "react";

const ProfileHeader = ({ profileJSK, isEditMode }) => {
  const [firstName, setFirstName] = useState(profileJSK?.firstName || "");
  const [lastName, setLastName] = useState(profileJSK?.lastName || "");
  const [address, setAddress] = useState("123 Gò Vấp, Hồ Chí Minh"); // hardcoded
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn.usegalileo.ai/sdxl10/8eb31c25-4d21-4bd0-941f-cd480a3318e8.png"
  );

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isEditMode) {
      fileInputRef.current.click(); // mở chọn file
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  return (
    <div className="flex gap-4 bg-white px-4 py-3 justify-between">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] cursor-pointer relative"
          style={{ backgroundImage: `url('${avatarUrl}')` }}
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
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Họ"
              />
              <input
                type="text"
                className="text-[#111811] text-base font-medium border rounded px-2 py-1 mb-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tên"
              />
              <input
                type="text"
                className="text-[#638863] text-sm font-normal border rounded px-2 py-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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

      {/* Icon cây viết chỉ hiển thị khi không edit */}
      {!isEditMode && (
        <div className="shrink-0">
          <div className="text-[#111811] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileHeader.propTypes = {
  profileJSK: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  isEditMode: PropTypes.bool,
};

export default ProfileHeader;

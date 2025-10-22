import { useSelector } from "react-redux";

import { useState } from "react";

const PersonalInfoForm = () => {
  const user = useSelector((state) => state.auths.user);
  const [image, setImage] = useState(null);

  // Xử lý chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="flex justify-between items-start space-x-4">
      <div className="w-full mx-auto p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold">Cài đặt thông tin cá nhân</h2>
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> Các thông tin bắt buộc
        </p>

        {/* Họ và tên */}
        <div className="mt-4">
          <label className="block font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-green-300"
            value={user.username}
          />
        </div>

        {/* Số điện thoại */}
        <div className="mt-4">
          <label className="block font-medium">Số điện thoại</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-green-300"
            defaultValue="0352468843"
          />
        </div>

        {/* Email (Disabled) */}
        <div className="mt-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
            value={user.email}
            disabled
          />
        </div>

        {/* Button Lưu */}
        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
          Lưu
        </button>
      </div>

      {/* image */}
      <div className="flex justify-between h-full p-4 rounded-lg shadow w-1/4">
        {/* Ảnh đại diện */}
        <div className="relative w-16 h-16">
          <label htmlFor="avatarInput" className="cursor-pointer">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
              <img
                src={
                  image ||
                  "https://business.wholelifechallenge.com/wp-content/uploads/2016/11/200x300.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Icon máy ảnh */}
            <span className="absolute bottom-0 right-0 bg-white border border-gray-300 p-1 rounded-full shadow">
              📷
            </span>
          </label>
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Tên người dùng */}
        <div>
          <p className="text-gray-600 text-sm">Chào bạn</p>
          <p className="font-bold text-lg">Nguyễn Minh Nhật</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

const profile = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  phone: "0123 456 789",
  location: "Hà Nội, Việt Nam",
  bio: "Lập trình viên Frontend với 3 năm kinh nghiệm trong ReactJS.",
  experience: [
    {
      company: "Công ty ABC",
      role: "Frontend Developer",
      duration: "2021 - Hiện tại",
    },
  ],
  skills: ["ReactJS", "Tailwind CSS", "JavaScript", "Redux"],
  cv: "https://example.com/mycv.pdf",
};

const JobSeekerProfile = () => {
  return (
    <div className="profile py-6">
      <div className=" max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src="https://res.cloudinary.com/dz1nfbpra/image/upload/v1742040186/Screenshot_2025-02-26_182955_dvxonq.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.location}</p>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {profile.phone}
          </p>
          <p>
            <strong>Giới thiệu:</strong> {profile.bio}
          </p>
        </div>

        {/* Experience - Timeline */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Kinh nghiệm</h3>
          <div className="mt-4 ml-2">
            {/* Experience Item */}
            <div className="relative pb-6 pl-6 border-l-4">
              <div className="absolute w-5 h-5 bg-primary rounded-full -left-3 top-0"></div>
              <h4 className="text-lg font-semibold">Công ty ABC</h4>
              <p className="text-gray-600">
                Frontend Developer | 2022 - Hiện tại
              </p>
              <p className="text-gray-700 mt-2">
                Phát triển giao diện người dùng với ReactJS, TailwindCSS và
                Redux Toolkit.
              </p>
            </div>
            {/* Experience Item */}
            <div className="relative pb-6 pl-6 border-l-4">
              <div className="absolute w-5 h-5 bg-slate-300 rounded-full -left-3 top-0"></div>
              <h4 className="text-lg font-semibold">Công ty XYZ</h4>
              <p className="text-gray-600">UI/UX Designer | 2020 - 2022</p>
              <p className="text-gray-700 mt-2">
                Thiết kế UI/UX cho các sản phẩm web và mobile, tối ưu trải
                nghiệm người dùng.
              </p>
            </div>
          </div>
        </div>

        {/* Kỹ năng */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Kỹ năng</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CV */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">Hồ sơ CV</h2>
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Xem CV của tôi
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;

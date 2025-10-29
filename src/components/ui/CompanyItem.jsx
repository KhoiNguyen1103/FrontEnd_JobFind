import { useNavigate } from "react-router-dom";

const CompanyItem = ({ item }) => {
  const navigate = useNavigate();
  const {
    companyId,
    companyName,
    description,
    industry: industries,
    logoPath,
  } = item;

  const handleClick = () => {
    navigate(`/company/${companyName}?id=${companyId}`);
  };

  return (
    <div>
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
        onClick={handleClick}
      >
        <div className="h-48 overflow-hidden">
          <img
            src={logoPath ? logoPath : "/image_error.png"}
            alt={"Ảnh công ty"}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {companyName}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            {industries?.map((industry, index) => (
              <span
                key={index}
                className="mr-2 bg-primary rounded-full px-2 py-1 text-white"
              >
                {industry.name}
                {index < industries.length - 1 && ", "}
              </span>
            ))}
          </div>
          <p
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: description || "Chưa có mô tả",
            }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;

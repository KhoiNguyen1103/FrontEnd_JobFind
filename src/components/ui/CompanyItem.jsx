import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const CompanyItem = ({ item }) => {
  const {
    companyId,
    companyName,
    description,
    email,
    industry: industries,
    logoPath,
    phoneNumber,
    website,
  } = item;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer">
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
                className="mr-2 bg-green-600 rounded-full px-2 py-1 text-white"
              >
                {industry.name}
                {index < industries.length - 1 && ", "}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description ? description : "Chưa có mô tả"}
          </p>
          <div className="flex items-center justify-between w-full">
            {/* <span className="text-sm text-green-600 font-medium">
              <i className="fas fa-briefcase mr-2"></i>
              {"Số lượng công việc hiện có"}
            </span> */}
            <button className="bg-green-600 w-full py-3 text-white hover:bg-green-700 font-medium text-sm !rounded-md whitespace-nowrap">
              <Link to={"/company/" + companyName + "?id=" + companyId}>
                Xem chi tiết
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="ps-2"
                />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;

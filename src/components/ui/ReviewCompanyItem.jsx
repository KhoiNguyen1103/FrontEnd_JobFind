import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ReviewCompanyItem = ({ review }) => {
  const {
    reviewId,
    rating,
    reviewText,
    reviewDate,
    companyId,
    jobSeekerProfileId,
    jobSeekerProfileName,
  } = review;
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 mt-4">
      {/* header: tên - vị trí - rating review - ngày đăng review */}
      <div className="flex justify-between items-start mb-4">
        <div className="mb-2">
          <span className="font-medium text-gray-900 mr-3">
            {jobSeekerProfileName}
          </span>
          <div className="flex items-center mr-4 pt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                // Hiển thị sao tròn
                if (rating >= index + 1) {
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className="fas fa-star text-yellow-400 text-xl"
                    />
                  );
                } else if (rating > index && rating < index + 1) {
                  // Hiển thị sao nửa
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStarHalfStroke}
                      className="fas fa-star text-yellow-400 text-xl"
                    />
                  );
                } else {
                  // Hiển thị sao rỗng
                  return (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className="fas fa-star text-gray-300 text-xl"
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{"05/05/2025"}</span>
      </div>
      {/* End: header: tên - vị trí - rating review - ngày đăng review */}
      <div className="text-gray-800 text-sm leading-relaxed">{reviewText}</div>
    </div>
  );
};

export default ReviewCompanyItem;

import {
  faStar,
  faStarHalfStroke,
  faTrash,
  faPenToSquare,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ReviewCompanyItem = ({ review, onDelete, onEdit }) => {
  const {
    reviewId,
    rating,
    reviewText,
    reviewDate,
    companyId,
    jobSeekerProfileId,
    jobSeekerProfileName,
  } = review;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isComment = jobSeekerProfileId === currentUser?.id;

  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(reviewText);
  const [editedRating, setEditedRating] = useState(rating);

  const handleSave = () => {
    const updatedReview = {
      reviewId: review.jobSeekerProfileId,
      rating: editedRating,
      reviewText: editedText,
    };
    onEdit(updatedReview);
    setEditMode(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 mt-4 relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="font-medium text-gray-900 mr-3">
            {jobSeekerProfileName}
          </span>

          {/* Rating */}
          <div className="flex items-center pt-2">
            {[...Array(5)].map((_, index) => {
              const filled = editedRating >= index + 1;
              const halfFilled =
                editedRating > index && editedRating < index + 1;

              return (
                <FontAwesomeIcon
                  key={index}
                  icon={halfFilled ? faStarHalfStroke : faStar}
                  className={`text-xl cursor-pointer ${
                    filled || halfFilled ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => editMode && setEditedRating(index + 1)}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        {isComment && !editMode && (
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl"
              title="Sửa"
              onClick={() => setEditMode(true)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
              title="Xoá"
              onClick={() => onDelete(reviewId)}
            />
          </div>
        )}

        {isComment && editMode && (
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className="text-green-500 hover:text-green-700 cursor-pointer text-xl"
              title="Lưu"
              onClick={handleSave}
            />
            <FontAwesomeIcon
              icon={faXmark}
              className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              title="Hủy"
              onClick={() => {
                setEditMode(false);
                setEditedText(reviewText);
                setEditedRating(rating);
              }}
            />
          </div>
        )}
      </div>

      {/* Nội dung Review */}
      {editMode ? (
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800"
          rows={3}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <div className="text-gray-800 text-sm leading-relaxed">
          {reviewText}
        </div>
      )}

      {/* Ngày đăng */}
      <div className="text-right text-xs text-gray-400 mt-2">
        {reviewDate || "05/05/2025"}
      </div>
    </div>
  );
};

export default ReviewCompanyItem;

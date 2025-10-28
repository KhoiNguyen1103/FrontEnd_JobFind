import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addCompanyReview } from "../../redux/slices/companyReviewSlice";
import { useDispatch } from "react-redux";

const CompanyReviewInput = ({ companyId, jobSeekerId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !content.trim()) {
      alert("Vui lòng chọn số sao và nhập nội dung.");
      return;
    }

    const reviewData = {
      companyId,
      jobSeekerId,
      review: content,
      rating: rating,
    };

    dispatch(addCompanyReview(reviewData));

    // Reset form
    setRating(0);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow-md space-y-3 rounded-lg mt-3"
    >
      {/* Stars */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      {/* Comment content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết cảm nhận của bạn về công ty..."
        rows={3}
        className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring focus:border-blue-300"
      />

      {/* Submit button */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
        >
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
};

export default CompanyReviewInput;

import axiosClient from "./axiosClient";

const companyReviewApi = {
  // Lấy danh sách review theo companyId
  getReviewsByCompanyId: (companyId) => {
    const url = `/company/review/getListReviews/companyId?companyId=${companyId}`;
    return axiosClient.get(url);
  },

  // Thêm review mới cho công ty
  addReview: (reviewData) => {
    const url = "/company/review/add";
    return axiosClient.post(url, reviewData);
  },

  // Cập nhật review (nếu cho phép)
  updateReview: (updateData) => {
    const url = `/company/review/update`;
    return axiosClient.put(url, updateData);
  },

  // Xoá review
  deleteReview: (reviewId) => {
    const url = `/company/review/delete/reviewId?reviewId=${reviewId}`;
    return axiosClient.delete(url);
  },
};

export default companyReviewApi;

// tạo slug từ tên job
const createSlug = (title) => {
  return title
    .toLowerCase() // Chuyển về chữ thường
    .normalize("NFD") // Loại bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/đ/g, "d") // Thay 'đ' thành 'd'
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự không phải chữ cái, số, khoảng trắng
    .trim() // Xóa khoảng trắng đầu/cuối
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu '-'
};

export default createSlug;

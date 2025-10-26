const registerUser = async (payload) => {
  console.log("Payload đăng ký:", payload);
  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    // Trả về lỗi để xử lý bên ngoài
    return { success: false, message: data.message || "Đăng ký thất bại" };
  }

  return { success: true, data };
};

export default registerUser;

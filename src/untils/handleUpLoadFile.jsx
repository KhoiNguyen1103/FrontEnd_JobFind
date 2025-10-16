const selectFile = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Chỉ hỗ trợ file .pdf, .doc, .docx!");
      return;
    }
  }
  return selectedFile;
};

export default selectFile;

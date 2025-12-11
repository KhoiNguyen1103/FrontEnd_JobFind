const BadgeKinhNghiem = ({ soNamKinhNghiem }) => {
  if (!soNamKinhNghiem) return null;

  let text = "";

  if (soNamKinhNghiem.includes("-")) {
    // Trường hợp "6-7", "8-11"
    const [start, end] = soNamKinhNghiem.split("-").map((y) => y.trim());
    text = `${start} - ${end} năm`;
  } else {
    // Trường hợp "3", "7"
    text = `${soNamKinhNghiem.trim()} năm`;
  }

  return (
    <span className="py-1 px-2 text-xs font-bold whitespace-nowrap rounded-full bg-yellow-400">
      {text}
    </span>
  );
};

export default BadgeKinhNghiem;

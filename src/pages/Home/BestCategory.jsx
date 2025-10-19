import { useEffect, useState } from "react";
// services Industry
import { getAllIndustry } from "../../services/Industry";

const BestCategory = () => {
  // state lưu danh sách ngành nghề
  const [industries, setIndustries] = useState([]);

  // gọi api lấy danh sách ngành nghề
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await getAllIndustry();
        setIndustries(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ngành nghề:", error);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <p className="text-2xl text-primary font-bold">Top ngành nghề nổi bật</p>
      <div className="grid grid-cols-4 gap-6 pt-4">
        {industries.map((item) => (
          <div
            key={item.industryId}
            className="flex flex-col justify-center items-center bg-slate-200 rounded-lg cursor-pointer hover:bg-white
            hover:shadow-lg transition duration-300 ease-in-out border hover:border-green-400"
            style={{ height: "200px" }}
          >
            <img
              // src={item.image}
              src={"/image_cv.webp"}
              alt="icon"
              style={{ width: "100px", height: "100px" }}
              className=""
            />
            <p className="pt-4 font-bold">{item.name}</p>
            {/* <p className="text-primary text-sm pt-2">{item.count} việc làm</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestCategory;

import { useSelector } from "react-redux";

const BestCategory = () => {
  // Lấy danh sách danh mục việc làm
  const categories = useSelector((state) => state.category.categories);

  return (
    <div className="container mx-auto py-8">
      <p className="text-2xl text-primary font-bold">Top danh mục nổi bật</p>
      <div className="grid grid-cols-4 gap-6 pt-4">
        {categories.map((item) => (
          <div
            key={item.jobCategoryId}
            className="flex flex-col justify-center items-center bg-slate-200 rounded-lg cursor-pointer hover:bg-white
            hover:shadow-lg transition duration-300 ease-in-out border hover:border-green-400"
            style={{ height: "200px" }}
          >
            <img
              src={item.image || "/image_cv.webp"}
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

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import categoriesFake from "../../data/categories";

const BestCategory = () => {
  const rawCategories = useSelector((state) => state.category.categories);
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : [...categoriesFake];

  return (
    <div className="container mx-auto py-8">
      <p className="text-2xl text-primary font-bold">Lĩnh vực nổi bật</p>
      <div className="grid grid-cols-4 gap-6 pt-4">
        {categories.map((item) => (
          <Link
            to={`/search?jobCategoryId=${item.jobCategoryId}`}
            key={item.jobCategoryId}
            className="pt-4"
          >
            <div
              className="flex flex-col bg-white/80 rounded-lg cursor-pointer hover:bg-white hover:shadow-lg transition duration-300 ease-in-out border hover:border-blue-400 overflow-hidden"
              style={{ height: "250px" }}
            >
              <div className="w-full h-40">
                <img
                  src={item.image || "/image_cv.webp"}
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center items-center p-2">
                <span className="font-bold">{item.name}</span>
                <p className="text-primary text-sm">{item.count} việc làm</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestCategory;

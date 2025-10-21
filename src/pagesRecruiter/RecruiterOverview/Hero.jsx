import bg from "../../assets/bg-overview.jpg";
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="bg-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Tuyển dụng dễ dàng, tìm ứng viên phù hợp
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                        Sở hữu nền tảng tuyển dụng thông minh, giúp bạn đăng tin nhanh chóng, tiếp cận hàng triệu hồ sơ và kết nối đúng người - đúng việc.
                    </p>
                    <p className="text-base text-gray-600 mb-6">
                        Hệ thống quản lý ứng viên tối ưu, lọc hồ sơ thông minh và công cụ đánh giá chuyên sâu giúp bạn đưa ra quyết định tuyển dụng chính xác hơn bao giờ hết.
                    </p>
                    <Link
                        to="/recruiter/register"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
                    >
                        Đăng tin ngay
                    </Link>
                </div>
                <div className="flex justify-center">
                    <img
                        src={bg}
                        alt="Tuyển dụng hiệu quả"
                        className="w-full max-w-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
const Features = () => {
    const features = [
        {
            title: "Đăng tin tuyển dụng",
            desc: "Tạo và đăng tin tuyển dụng nhanh chóng, dễ dàng tiếp cận ứng viên phù hợp.",
            icon: "📝",
        },
        {
            title: "Tìm kiếm hồ sơ",
            desc: "Truy cập kho hồ sơ khổng lồ với bộ lọc nâng cao giúp bạn tìm đúng ứng viên.",
            icon: "🔍",
        },
        {
            title: "Quản lý ứng viên",
            desc: "Theo dõi và xử lý hồ sơ ứng viên trực quan qua bảng điều khiển hiện đại.",
            icon: "📊",
        },
        {
            title: "Gợi ý AI thông minh",
            desc: "Ứng dụng AI để đề xuất ứng viên phù hợp với tiêu chí tuyển dụng của bạn.",
            icon: "🤖",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Nền tảng toàn diện cho nhà tuyển dụng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                            <span className="text-4xl mb-4 block">{feature.icon}</span>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

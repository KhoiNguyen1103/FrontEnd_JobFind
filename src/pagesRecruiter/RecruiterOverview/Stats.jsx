const Stats = () => {
    const stats = [
        { value: "10.000.000+", label: "Ứng viên tiềm năng" },
        { value: "50.000+", label: "Doanh nghiệp sử dụng" },
        { value: "1.000.000+", label: "Tin tuyển dụng đã đăng" },
        { value: "95%", label: "Tỉ lệ hài lòng" },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                            <p className="text-gray-700 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
const Testimonials = () => {
    const testimonials = [
        {
            name: "Nguyễn Thị Hương",
            role: "Trưởng phòng nhân sự",
            quote:
                "Nền tảng này đã giúp chúng tôi tiết kiệm rất nhiều thời gian trong việc tìm kiếm ứng viên chất lượng.",
        },
        {
            name: "Trần Văn Minh",
            role: "Giám đốc tuyển dụng",
            quote:
                "Tính năng gợi ý bằng AI rất hữu ích, giúp chúng tôi nhanh chóng lọc ra ứng viên tiềm năng nhất.",
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Cảm nhận từ khách hàng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                            <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                            <p className="font-semibold text-gray-800">{testimonial.name}</p>
                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
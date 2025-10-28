const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">JobFind</h3>
                        <p className="text-gray-400">Nền tảng tuyển dụng trực tuyến</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Khám phá</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Trang chủ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Góc báo chí</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên hệ chúng tôi</h3>
                        <p className="text-gray-400">Email: hotro@jobfind.vn</p>
                        <p className="text-gray-400">Phone: 0123 456 789</p>
                    </div>
                </div>
                <p className="text-center text-gray-400 mt-8">© 2025 JobFind. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
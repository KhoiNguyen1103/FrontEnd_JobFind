const VisualJSKer = () => {
  return (
    <div className="w-1/2 relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/bg_register.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center">
        <h2 className="text-4xl font-bold mb-6">Find Your Dream Job</h2>
        <p className="text-lg mb-8 max-w-md">
          Join thousands of professionals who have already found their perfect
          career match through our platform.
        </p>
        <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold mb-2">10k+</div>
            <div className="text-sm">Job Opportunities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold mb-2">5k+</div>
            <div className="text-sm">Companies</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-sm">Success Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-sm">Support</div>
          </div>
        </div>
      </div>

      {/* Button go to home */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center w-1/2">
        <a
          href="/"
          className="block bg-white text-blue-600 font-semibold px-5 py-3 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200 text-center"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default VisualJSKer;

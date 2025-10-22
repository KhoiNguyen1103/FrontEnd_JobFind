// Sidebar Component
const Sidebar = () => {
  return (
    <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f4f0]">
            <p className="text-[#111811] text-sm font-medium leading-normal">
              Profile
            </p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <p className="text-[#111811] text-sm font-medium leading-normal">
              Danh sách CV
            </p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <p className="text-[#111811] text-sm font-medium leading-normal">
              Công cụ tạo CV
            </p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <p className="text-[#111811] text-sm font-medium leading-normal">
              Saved Jobs
            </p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <p className="text-[#111811] text-sm font-medium leading-normal">
              Subscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

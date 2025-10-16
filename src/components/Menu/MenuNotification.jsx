// Model thông báo hiện lên khi click vào biểu tượng chuông ở header
const notifications = [
  {
    id: "1",
    title: "Thông báo 1",
    content: "Nội dung thông báo 1",
    isRead: false,
  },
];

const ModelNotification = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between pb-4 border-b border-solid border-slate-500">
        <p className="text-xl font-bold">Thông báo</p>
        <p className="text-primary font-light text-md">Đánh dấu đã đọc</p>
      </div>
      {/* danh sách các thông báo */}
      <div>
        {notifications.map((notification) => (
          <div key={notification.id} className="pt-4">
            <p className="font-bold pb-2">{notification.title}</p>
            <p className="font-normal">{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelNotification;

import React from 'react';

const ApplicationsModal = ({ applications, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-800">Danh Sách Đơn Ứng Tuyển</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    {applications.length === 0 ? (
                        <p className="text-center text-gray-500">Không có đơn ứng tuyển nào.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-medium text-gray-700">Tên Ứng Viên</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Ngày Nộp</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.applicationId} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-600">{app.jobSeekerProfileDTO.firstName} {app.jobSeekerProfileDTO.lastName}</td>
                                        <td className="p-3 text-sm text-gray-600">{new Date(app.appliedAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="p-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium
                          ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'}`}
                                            >
                                                {app.status === 'Pending' ? 'Chờ xử lý' :
                                                    app.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsModal;
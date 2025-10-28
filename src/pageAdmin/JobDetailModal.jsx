import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import jobApi from "../api/jobApi";
import RejectModal from "./RejectModal";
import { useState } from "react";

const JobDetailModal = ({ open, onClose, job, onApprove, onViewApplications }) => {
    if (!job) return null;
    const [openRejectModal, setOpenRejectModal] = useState(false);

    const handleRejectJob = async (reason) => {
        try {
            const rejectJobRequest = {
                jobId: job.jobId,
                reason: reason,
            };

            await jobApi.reject(rejectJobRequest);
            setOpenRejectModal(false);
            onClose();
        } catch (error) {
            console.error("Lỗi khi reject job:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chi Tiết Công Việc</DialogTitle>
            <DialogContent>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{job.title}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Công Ty</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{job.company?.companyName || "N/A"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Địa điểm</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{job.location}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Hình thức làm việc</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{job.jobType}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Hạn chót</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{new Intl.DateTimeFormat('vi-VN').format(new Date(job.deadline))}</p>
                    </div>
                    <div className="flex">
                        <div className="mr-16">
                            <label className="text-sm font-medium text-gray-700">Lương tối thiểu</label>
                            <p className="border p-3 px-10 rounded-lg bg-gray-50">{(job.salaryMin / 1000000).toFixed(1)} triệu</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Lương tối đa</label>
                            <p className="border p-3 px-10 rounded-lg bg-gray-50">{(job.salaryMax / 1000000).toFixed(1)} triệu</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Kỹ năng</label>
                        <p className="border p-3 rounded-lg bg-gray-50">
                            {job.skills?.map((skill) => skill.name).join(", ") || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Danh mục</label>
                        <p className="border p-3 rounded-lg bg-gray-50">
                            {job.categories?.map((cat) => cat.name).join(", ") || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mô tả</label>
                        <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: job.description }} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Yêu cầu</label>
                        <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Quyền lợi</label>
                        <div className="border p-3 rounded-lg bg-gray-50" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{job.isActive ? "Đăng" : "Ẩn"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Trạng thái duyệt</label>
                        <p className="border p-3 rounded-lg bg-gray-50"> {!job.isApproved
                            ? job.note && job.note.trim() !== ""
                                ? "Đã từ chối"
                                : "Chờ duyệt"
                            : "Đã duyệt"}</p>
                    </div>
                    {job.note && job.note.trim() !== "" && (
                        <div>
                            <label className="text-sm font-medium text-gray-700">Lý do từ chối</label>
                            <p className="border p-3 rounded-lg bg-red-50 text-red-700 whitespace-pre-wrap">{job.note}</p>
                        </div>
                    )}

                </div>
            </DialogContent>
            <DialogActions>
                {!job.isApproved && (
                    <div className="flex gap-2">
                        <Button onClick={() => onApprove(job.jobId)} variant="contained" color="success">
                            Duyệt
                        </Button>
                        <Button onClick={() => setOpenRejectModal(true)} variant="contained" color="error">
                            Từ chối
                        </Button>
                    </div>
                )}
                <Button onClick={() => onViewApplications(job.jobId)} variant="contained" color="primary">
                    Xem đơn ứng tuyển
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
            <RejectModal
                open={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
                onSubmit={handleRejectJob}
            />
        </Dialog>
    );
};

export default JobDetailModal;
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "@mui/material";

const JobDetailModal = ({ open, onClose, job, onApprove, onViewApplications }) => {
    if (!job) return null;

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
                        <p className="border p-3 rounded-lg bg-gray-50">{job.isApproved ? "Đã duyệt" : "Chờ duyệt"}</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {!job.isApproved && (
                    <Button onClick={() => onApprove(job.jobId)} variant="contained" color="success">
                        Duyệt
                    </Button>
                )}
                <Button onClick={() => onViewApplications(job.jobId)} variant="contained" color="primary">
                    Xem đơn ứng tuyển
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobDetailModal;
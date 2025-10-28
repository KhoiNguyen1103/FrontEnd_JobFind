import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from '@mui/material';

const JobsListModal = ({ open, onClose, jobs, onJobSelect }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Danh Sách Công Việc</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tiêu Đề</TableCell>
                            <TableCell>Địa Điểm</TableCell>
                            <TableCell>Loại Công Việc</TableCell>
                            <TableCell>Ngày Đăng</TableCell>
                            <TableCell>Trạng Thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Không có công việc nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow
                                    key={job.jobId}
                                    onClick={() => onJobSelect(job)} 
                                    style={{ cursor: 'pointer' }}
                                    hover
                                >
                                    <TableCell>{job.jobId}</TableCell>
                                    <TableCell>{job.title}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>{job.jobType}</TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('vi-VN').format(new Date(job.postedAt))}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${job.isActive && job.isApproved
                                                    ? 'bg-green-100 text-green-700'
                                                    : job.isApproved === false && (!job.note || job.note.trim() === '')
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {job.isActive && job.isApproved
                                                ? 'Đã đăng'
                                                : job.isApproved === false && (!job.note || job.note.trim() === '')
                                                    ? 'Chờ duyệt'
                                                    : 'Bị từ chối'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobsListModal;
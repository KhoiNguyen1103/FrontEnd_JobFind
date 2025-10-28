import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

const ApplicationListModal = ({ open, onClose, applications }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Danh Sách Đơn Ứng Tuyển</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ứng Viên</TableCell>
                            <TableCell>Trạng Thái</TableCell>
                            <TableCell>Ngày</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.applicationId}>
                                <TableCell>{app.applicationId}</TableCell>
                                <TableCell>{app.jobSeekerProfileDTO.firstName} {app.jobSeekerProfileDTO.lastName}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-3 py-1 text-sm font-medium rounded-full ${app.status === "HIRED" ? "bg-green-100 text-green-700" :
                                            app.status === "INTERVIEWING" ? "bg-blue-100 text-blue-700" :
                                                app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </TableCell>
                                <TableCell>{new Intl.DateTimeFormat('vi-VN').format(new Date(app.appliedAt))}</TableCell>
                            </TableRow>
                        ))}
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

export default ApplicationListModal;
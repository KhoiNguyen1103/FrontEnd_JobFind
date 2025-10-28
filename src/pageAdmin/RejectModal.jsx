import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const RejectModal = ({ open, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
            setReason("");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Lý do từ chối công việc</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Nhập lý do từ chối..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="error"
                    disabled={!reason.trim()}
                >
                    Từ chối
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectModal;

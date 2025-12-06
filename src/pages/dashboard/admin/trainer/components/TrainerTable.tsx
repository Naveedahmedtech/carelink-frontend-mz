import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

interface TrainerTableProps {
  trainers: any[];
  pagination: { total: number };
  page: number;
  limit: number;
  isMobile: boolean;
  isUpdating: boolean;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (val: number) => void;
  onStatusChange: (trainer: any, newStatus: string) => void;
  onViewDetails: (trainer: any) => void; // 🔹 added
}

const renderStatusChip = (status: string) => {
  const map: Record<string, { label: string; color: any }> = {
    ACTIVE: { label: "Active", color: "success" },
    PENDING: { label: "Pending", color: "warning" },
    BLOCKED: { label: "Blocked", color: "error" },
    DELETED: { label: "Deleted", color: "default" },
  };
  const s = map[status] || { label: status, color: "default" };
  return <Chip label={s.label} color={s.color} size="small" />;
};

export default function TrainerTable({
  trainers,
  pagination,
  page,
  limit,
  isMobile,
  isUpdating,
  onPageChange,
  onRowsPerPageChange,
  onStatusChange,
  onViewDetails,
}: TrainerTableProps) {
  return (
    <Paper>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Onboarding Step</TableCell>
              <TableCell align="right">Change Status</TableCell>
              <TableCell align="center">Actions</TableCell> {/* 🔹 new column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer: any) => (
              <TableRow key={trainer._id}>
                <TableCell>{trainer.email}</TableCell>
                <TableCell>{trainer.trainer?.fullName || "-"}</TableCell>
                <TableCell>{trainer.trainer?.phone || "-"}</TableCell>
                <TableCell>{renderStatusChip(trainer.status)}</TableCell>
                <TableCell>{trainer.trainer?.onboardingStep}</TableCell>
                <TableCell align="right">
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={trainer.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        onStatusChange(trainer, e.target.value)
                      }
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="BLOCKED">Blocked</MenuItem>
                      <MenuItem value="DELETED">Deleted</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onViewDetails(trainer)}
                    >
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </Paper>
  );
}

// src/pages/portal/admin/participants/ParticipantListPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TablePagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { useGetParticipantsQuery } from "../../../../redux/features/participantApi";

type Participant = {
  _id: string;
  email: string;
  role?: string;
  status?: "PENDING" | "ACTIVE" | "BLOCKED" | "DELETED";
  createdAt?: string;
  participant?: {
    fullName?: string;
    phone?: string;
    address?: string;
    ndisNumber?: string;
    fundingType?: "plan" | "self" | "ndia";
  };
};

const STATUS_COLORS: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  PENDING: "warning",
  ACTIVE: "success",
  BLOCKED: "error",
  DELETED: "default",
};

export default function ParticipantListPage() {
  /* ---------------- UI filter state (inputs) ---------------- */
  const [qUi, setQUi] = useState("");
  const [emailUi, setEmailUi] = useState("");
  const [statusUi, setStatusUi] = useState("");

  /* ---------------- applied filters (drive query) ---------------- */
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  /* ---------------- pagination ---------------- */
  const [page, setPage] = useState(0); // 0-based for MUI
  const [limit, setLimit] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletDown = useMediaQuery(theme.breakpoints.down("md"));
  const isNarrow = isMobile || isTabletDown;

  /* ---------------- sanitize pagination values ---------------- */
  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  const queryArgs = useMemo(
    () => ({
      page: safePage + 1, // API is 1-based
      limit: safeLimit,
      q,
      email,
      status,
    }),
    [safePage, safeLimit, q, email, status]
  );

  const { data, error, isLoading, isFetching, refetch } = useGetParticipantsQuery(queryArgs);
  /* ---------------- normalize API payload ---------------- */
  const apiEnvelope: any = data?.data ?? data ?? [];
  const records: Participant[] = Array.isArray(apiEnvelope?.data) ? apiEnvelope.data : [];
  const pagination = apiEnvelope?.pagination ?? { page: 1, limit: safeLimit, total: 0, totalPages: 0 };
  const serverMessage: string | undefined = (data as any)?.message;

  /* ---------------- clamp page when filters shrink results ---------------- */
  useEffect(() => {
    const total = Number.isFinite(pagination?.total) ? Number(pagination.total) : 0;
    const maxPage = Math.max(0, Math.ceil(total / safeLimit) - 1);
    if (safePage > maxPage) setPage(maxPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.total, safeLimit]);

  /* ---------------- detect if inputs changed ---------------- */
  const filtersChanged = qUi.trim() !== q || emailUi.trim() !== email || statusUi !== status;

  /* ---------------- handlers ---------------- */
  const handleApply = () => {
    const nextQ = qUi.trim();
    const nextEmail = emailUi.trim();
    const nextStatus = statusUi;

    const changed =
      nextQ !== q || nextEmail !== email || nextStatus !== status || page !== 0;

    setQ(nextQ);
    setEmail(nextEmail);
    setStatus(nextStatus);
    setPage(0);

    if (changed) refetch();
  };

  const handleReset = () => {
    const changed = q !== "" || email !== "" || status !== "" || page !== 0;

    setQUi("");
    setEmailUi("");
    setStatusUi("");

    setQ("");
    setEmail("");
    setStatus("");
    setPage(0);

    if (changed) refetch();
  };

  const onEnterApply = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  /* ---------------- derived rows ---------------- */
  const rows = useMemo(
    () =>
      records.map((u) => ({
        id: u._id,
        name: u.participant?.fullName || "—",
        email: u.email || "—",
        phone: u.participant?.phone || "—",
        address: u.participant?.address || "—",
        ndis: u.participant?.ndisNumber || "—",
        funding: u.participant?.fundingType || "—",
        status: u.status || "—",
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
      })),
    [records]
  );

  /* ---------------- friendly error text ---------------- */
  const errorMessage = useMemo(() => {
    if (!error) return "";
    const e: any = error;
    if (typeof e === "string") return e;
    // if (e?.data?.message) return e.data.message;
    if (e?.error) return e.error;
    if (e?.status) return `Request failed (${e.status}).`;
    return "Something went wrong.";
  }, [error]);

  /* ---------------- render ---------------- */
  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Participants Management
      </Typography>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            label="Search"
            placeholder="name, phone, address, NDIS..."
            value={qUi}
            onChange={(e) => setQUi(e.target.value)}
            onKeyDown={onEnterApply}
            fullWidth
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            label="Email"
            placeholder="user@domain.com"
            value={emailUi}
            onChange={(e) => setEmailUi(e.target.value)}
            onKeyDown={onEnterApply}
            fullWidth
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            select
            label="Status"
            value={statusUi}
            onChange={(e) => setStatusUi(e.target.value)}
            onKeyDown={onEnterApply}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="BLOCKED">BLOCKED</MenuItem>
            <MenuItem value="DELETED">DELETED</MenuItem>
          </TextField>

          <Stack direction="row" spacing={1} sx={{ ml: { sm: "auto" } }}>
            <Button variant="outlined" onClick={handleReset}>
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={!filtersChanged && page === 0}
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Loading */}
      {isLoading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
          <Typography color="error" gutterBottom>
            {errorMessage}
          </Typography>
          <Button variant="outlined" onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      )}

      {/* Empty */}
      {!isLoading && !error && rows.length === 0 && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            No results
          </Typography>

          {/* {typeof serverMessage === "string" && serverMessage && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {serverMessage}
            </Typography>
          )} */}

          {(q || email || status) ? (
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {q && <Chip size="small" label={`q: ${q}`} />}
              {email && <Chip size="small" label={`email: ${email}`} />}
              {status && <Chip size="small" label={`status: ${status}`} />}
            </Stack>
          ) : null}

          <Stack direction="row" spacing={1}>
            {(q || email || status) ? (
              <Button variant="outlined" onClick={handleReset}>Clear filters</Button>
            ) : null}
            <Button variant="contained" onClick={() => refetch()}>Retry</Button>
          </Stack>
        </Paper>
      )}

      {/* Table */}
      {!isLoading && !error && rows.length > 0 && (
        <Paper elevation={0}>
          <TableContainer
            sx={{
              overflowX: "auto",                 // horizontal scroll for very narrow screens
              maxHeight: { xs: 480, md: "unset" } // keep mobile from growing too tall
            }}
          >
            <Table size={isMobile ? "small" : "medium"} stickyHeader={isMobile}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {!isMobile && <TableCell>NDIS #</TableCell>}
                  <TableCell>Email</TableCell>
                  {!isNarrow && <TableCell>Phone</TableCell>}
                  {!isNarrow && <TableCell>Address</TableCell>}
                  <TableCell>Funding</TableCell>
                  <TableCell>Status</TableCell>
                  {!isNarrow && <TableCell>Created</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.name}
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{r.ndis}</TableCell>
                    )}
                    <TableCell sx={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.email}
                    </TableCell>
                    {!isNarrow && (
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{r.phone}</TableCell>
                    )}
                    {!isNarrow && (
                      <TableCell sx={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {r.address}
                      </TableCell>
                    )}
                    <TableCell sx={{ textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {r.funding}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {typeof r.status === "string" ? (
                        <Chip
                          size="small"
                          label={r.status}
                          color={STATUS_COLORS[r.status] ?? "default"}
                          variant="outlined"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    {!isNarrow && <TableCell sx={{ whiteSpace: "nowrap" }}>{r.createdAt}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* subtle spinner while fetching new page/filter */}
          {isFetching && !isLoading ? (
            <Box display="flex" justifyContent="center" py={1.5}>
              <CircularProgress size={20} />
            </Box>
          ) : null}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={Number.isFinite(pagination?.total) ? pagination.total : 0}
            page={safePage}
            onPageChange={(_e, newPage) => setPage(Math.max(0, newPage))}
            rowsPerPage={safeLimit}
            onRowsPerPageChange={(e) => {
              const next = parseInt(e.target.value, 10);
              setLimit(Number.isFinite(next) && next > 0 ? next : 10);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </Paper>
      )}
    </Box>
  );
}

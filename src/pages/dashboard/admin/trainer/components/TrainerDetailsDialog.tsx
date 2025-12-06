import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Paper,
  GridLegacy as Grid,
} from "@mui/material";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiMail,
  FiFileText,
  FiAward,
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiPenTool,
} from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
  trainer: any | null;
};

export default function TrainerDetailsDialog({ open, onClose, trainer }: Props) {
  if (!trainer) return null;
  const { trainer: profile } = trainer;

  const renderStatusChip = (status: string) => {
    const map: Record<string, { label: string; color: any; icon: JSX.Element }> = {
      ACTIVE: { label: "Active", color: "success", icon: <FiCheckCircle /> },
      PENDING: { label: "Pending", color: "warning", icon: <FiFileText /> },
      BLOCKED: { label: "Blocked", color: "error", icon: <FiXCircle /> },
      DELETED: { label: "Deleted", color: "default", icon: <FiXCircle /> },
    };
    const s = map[status] || { label: status, color: "default", icon: <FiFileText /> };
    return (
      <Chip
        icon={s.icon}
        label={s.label}
        color={s.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>👤 Trainer Details</DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: "#fafafa",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        <Stack spacing={3}>
          {/* Personal Info */}
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              <FiUser style={{ marginRight: 8 }} /> Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><FiUser /> <b>Name:</b> {profile?.fullName || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><FiMail /> <b>Email:</b> {trainer.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><FiPhone /> <b>Phone:</b> {profile?.phone || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><FiMapPin /> <b>Address:</b> {profile?.address || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><b>Status:</b> {renderStatusChip(trainer.status)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><FiAward /> <b>Onboarding Step:</b> {profile?.onboardingStep}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Specialisations */}
          {profile?.specialisations?.length > 0 && (
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                <FiAward style={{ marginRight: 8 }} /> Specialisations
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {profile.specialisations.map((s: string, i: number) => (
                  <Chip
                    key={i}
                    label={s}
                    color="primary"
                    variant="outlined"
                    icon={<FiCheckCircle />}
                  />
                ))}
              </Stack>
            </Paper>
          )}

          {/* Travel Areas */}
          {profile?.travelAreas?.length > 0 && (
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                <FiGlobe style={{ marginRight: 8 }} /> Travel Areas
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {profile.travelAreas.map((a: string, i: number) => (
                  <Chip key={i} label={a} />
                ))}
              </Stack>
            </Paper>
          )}

          {/* Documents */}
          {profile?.documents && (
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                <FiFileText style={{ marginRight: 8 }} /> Uploaded Documents
              </Typography>
              <Stack spacing={1}>
                {Object.entries(profile.documents).map(([key, doc]: any) => (
                  <Box key={key}>
                    <Typography>
                      <b>{key}:</b>{" "}
                      {doc?.filePath ? (
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#1976d2", textDecoration: "underline" }}
                        >
                          {doc.originalName || "View File"}
                        </a>
                      ) : (
                        "Not Provided"
                      )}
                      {doc?.expiry &&
                        ` (Expiry: ${new Date(doc.expiry).toLocaleDateString()})`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Agreement */}
          {profile?.agreement && (
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                <FiPenTool style={{ marginRight: 8 }} /> Employment Agreement
              </Typography>
              <Typography>
                Accepted:{" "}
                {profile.agreement.tos &&
                profile.agreement.privacy &&
                profile.agreement.consent ? (
                  <Chip
                    label="Yes"
                    color="success"
                    size="small"
                    icon={<FiCheckCircle />}
                  />
                ) : (
                  <Chip
                    label="No"
                    color="error"
                    size="small"
                    icon={<FiXCircle />}
                  />
                )}
              </Typography>
              {profile.agreement.signature?.url && (
                <Box mt={2} textAlign="center">
                  <Typography fontWeight={500} gutterBottom>
                    Signature:
                  </Typography>
                  <img
                    src={profile.agreement.signature.url}
                    alt="Trainer signature"
                    style={{
                      maxWidth: 260,
                      border: "2px solid #ccc",
                      borderRadius: 8,
                      background: "#fff",
                      padding: 6,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Signed on {profile.agreement.signature.date}
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Dialog>
  );
}

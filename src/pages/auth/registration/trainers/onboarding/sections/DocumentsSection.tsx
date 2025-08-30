// -----------------------------------------------
// src/pages/trainers/onboarding/sections/DocumentsSection.tsx
import * as React from "react";
import {
  Button,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Box,
  Collapse,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEyeRounded";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdfRounded";
import ImageIcon from "@mui/icons-material/ImageRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import InfoIcon from "@mui/icons-material/InfoOutlined";

import SectionCard from "../../../components/SectionCard";
import type { TrainerRegistrationErrors, TrainerRegistrationValues } from "../shared/types";
import { COMPULSORY_DOCS, OPTIONAL_DOCS } from "../shared/constants";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.pdf";

// docs that commonly have an expiry (we surface a recommended Expiry field)
const EXPIRY_DOCS = new Set(["ndisCheck", "wwcc", "licence", "firstAid", "cpr"]);

type Props = {
  values: TrainerRegistrationValues;
  errors: TrainerRegistrationErrors;
  setValue: <K extends keyof TrainerRegistrationValues>(k: K, v: TrainerRegistrationValues[K]) => void;
};

export default function DocumentsSection({ values, errors, setValue }: Props) {
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [rowErrors, setRowErrors] = React.useState<Record<string, string | null>>({});
  const [showOptional, setShowOptional] = React.useState(false);

  const setDoc = (key: string, patch: { file?: File | null; expiry?: string | null }) => {
    const docs = { ...(values.documents || {}) };
    docs[key] = { ...(docs[key] || {}), ...patch };
    setValue("documents", docs);
  };

  const validate = (file?: File): string | null => {
    if (!file) return null;
    if (!ACCEPTED_TYPES.includes(file.type)) return "Unsupported type. Use JPG, PNG, or PDF.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File too large. Max ${MAX_SIZE_MB} MB.`;
    return null;
  };

  const handleFile = (key: string, file?: File) => {
    const err = validate(file);
    setRowErrors((e) => ({ ...e, [key]: err }));
    if (!err && file) setDoc(key, { file });
  };

  const openPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const Row = ({
    keyName,
    label,
    required,
  }: {
    keyName: string;
    label: string;
    required?: boolean;
  }) => {
    const doc = values.documents?.[keyName] || {};
    const file = (doc as any).file as File | null | undefined;
    const expiryIso = (doc as any).expiry as string | null | undefined;
    const expiryDate = expiryIso ? new Date(expiryIso) : null;

    const isPdf = file?.type === "application/pdf";
    const isImage = file && file.type.startsWith("image/");
    const err = rowErrors[keyName] || null;

    const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(null);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(keyName, f);
    };

    const onDragOver: React.DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(keyName);
    };

    const onDragLeave: React.DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging((d) => (d === keyName ? null : d));
    };

    const status = file ? "Uploaded" : required ? "Missing" : "Optional";
    const statusColor =
      status === "Uploaded" ? "success" : status === "Missing" ? "error" : "default";

    return (
      <div className="rounded-2xl border border-border p-3 bg-backgroundShade1">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Typography fontWeight={700}>{label}</Typography>
              <Chip size="small" label={required ? "Required" : "Optional"} variant="outlined" />
              <Chip size="small" label={status} color={statusColor as any} variant={status === "Uploaded" ? "filled" : "outlined"} />
              <Tooltip title="Accepted: JPG, PNG, PDF · Max 10 MB">
                <InfoIcon className="text-textSecondary" fontSize="small" />
              </Tooltip>
            </div>

            {/* Expiry (recommended for certain docs) */}
            {EXPIRY_DOCS.has(keyName) && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry (recommended)"
                  value={expiryDate}
                  onChange={(d) => setDoc(keyName, { expiry: d ? new Date(d).toISOString() : null })}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        minWidth: 220,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": { borderColor: "var(--color-border)" },
                          "&:hover fieldset": { borderColor: "#E31E68" },
                          "&.Mui-focused fieldset": { borderColor: "#E31E68" },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          </div>

          {/* Body */}
          {!file ? (
            <Tooltip title="Click or drag a file to upload">
              {/* Label acts as click & drop target */}
              <label
                htmlFor={`doc-${keyName}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`cursor-pointer block`}
              >
                <input
                  id={`doc-${keyName}`}
                  type="file"
                  accept={ACCEPT_ATTR}
                  className="hidden"
                  onChange={(e) => handleFile(keyName, e.target.files?.[0])}
                />
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px dashed var(--color-border)",
                    bgcolor: "var(--color-background)",
                    textAlign: "center",
                    transition: "all .2s ease",
                    ...(dragging === keyName && {
                      borderColor: "#E31E68",
                      boxShadow: "0 0 0 4px rgba(227,30,104,.10)",
                    }),
                  }}
                >
                  <UploadFileIcon className="mb-1" />
                  <Typography fontWeight={700}>Drag & drop or click to upload</Typography>
                  <Typography variant="body2" className="text-textSecondary">
                    JPG, PNG, or PDF · up to {MAX_SIZE_MB} MB
                  </Typography>
                </Box>
              </label>
            </Tooltip>
          ) : (
            <div className="rounded-xl border border-border bg-background p-2">
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    bgcolor: "var(--color-background-shade-1)",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : isPdf ? (
                    <PictureAsPdfIcon />
                  ) : (
                    <ImageIcon />
                  )}
                </Box>

                <Stack sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap fontWeight={600}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" className="text-textSecondary">
                    {formatBytes(file.size)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                  {(isPdf || isImage) && (
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={() => openPreview(file)}
                        className="text-textSecondary hover:text-hover"
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Replace">
                    <label htmlFor={`doc-${keyName}`} className="cursor-pointer">
                      <input
                        id={`doc-${keyName}`}
                        type="file"
                        accept={ACCEPT_ATTR}
                        className="hidden"
                        onChange={(e) => handleFile(keyName, e.target.files?.[0])}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        className="bg-primary hover:bg-hover text-textHover rounded-xl"
                        component="span"
                      >
                        Replace
                      </Button>
                    </label>
                  </Tooltip>

                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => setDoc(keyName, { file: null })}
                      className="text-textSecondary hover:text-hover"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </div>
          )}

          {!!err && (
            <Typography variant="caption" color="error">
              {err}
            </Typography>
          )}
        </div>
      </div>
    );
  };

  return (
    <SectionCard
      title="Documents"
      subtitle="Upload compulsory and optional documents"
      icon={<AssignmentIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      {/* Compulsory */}
      <Grid container spacing={2}>
        {COMPULSORY_DOCS.map((key) => (
          <Grid key={key as string} item xs={12}>
            <Row keyName={key as string} label={labelFromKey(key as string)} required />
          </Grid>
        ))}
      </Grid>

      {/* Optional toggle */}
      <Box className="mt-3">
        <Button
          size="small"
          onClick={() => setShowOptional((s) => !s)}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showOptional ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s ease",
              }}
            />
          }
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {showOptional ? "Hide optional documents" : `Show optional documents (${OPTIONAL_DOCS.length})`}
        </Button>
      </Box>

      {/* Optional */}
      <Collapse in={showOptional} unmountOnExit>
        <Grid container spacing={2} className="mt-1.5">
          {OPTIONAL_DOCS.map((key) => (
            <Grid key={key as string} item xs={12}>
              <Row keyName={key as string} label={labelFromKey(key as string)} />
            </Grid>
          ))}
        </Grid>
      </Collapse>

      {errors.documents && <p className="text-[12px] text-error mt-2">{errors.documents}</p>}
    </SectionCard>
  );
}

/* ---------- helpers ---------- */
function labelFromKey(k: string) {
  switch (k) {
    case "ndisCheck":
      return "NDIS Worker Screening Check";
    case "wwcc":
      return "Working With Children Check";
    case "licence":
      return "Driver’s Licence";
    case "firstAid":
      return "First Aid Certificate";
    case "cpr":
      return "CPR Certificate";
    case "qualification":
      return "Disability Qualification";
    default:
      return k;
  }
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

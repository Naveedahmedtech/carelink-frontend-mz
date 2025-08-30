// src/components/notes/NoteCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

export type Note = {
  id: string;
  date: string;
  time: string;
  trainer?: string;
  participant?: string;
  activities: string;
  progress: string;
  incidents: string;
};

type NoteCardProps = {
  note: Note;
  showTrainer?: boolean;     // toggle trainer info
  showParticipant?: boolean; // toggle participant info
};

export default function NoteCard({
  note,
  showTrainer = true,
  showParticipant = false,
}: NoteCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        border: "1px solid var(--color-border)",
        bgcolor: "var(--color-background)",
        boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.2s",
        "&:hover": { boxShadow: "0 8px 18px rgba(0,0,0,0.12)" },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header: Date + Time */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<EventNoteRoundedIcon />}
              label={note.date}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<AccessTimeRoundedIcon />}
              label={note.time}
              size="small"
            />
            {showTrainer && note.trainer && (
              <Chip
                icon={<PersonRoundedIcon />}
                label={`Trainer: ${note.trainer}`}
                size="small"
              />
            )}
            {showParticipant && note.participant && (
              <Chip
                icon={<PersonRoundedIcon />}
                label={`Participant: ${note.participant}`}
                size="small"
              />
            )}
          </Stack>

          <Divider />

          {/* Activities */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ bgcolor: "backgroundShade1", p: 1.5, borderRadius: 2 }}
          >
            <FitnessCenterRoundedIcon sx={{ color: "var(--color-primary)" }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {note.activities}
              </Typography>
            </Box>
          </Stack>

          {/* Progress */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ bgcolor: "backgroundShade1", p: 1.5, borderRadius: 2 }}
          >
            <TrendingUpRoundedIcon sx={{ color: "var(--color-success)" }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {note.progress}
              </Typography>
            </Box>
          </Stack>

          {/* Incidents */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ bgcolor: "backgroundShade1", p: 1.5, borderRadius: 2 }}
          >
            <ReportProblemRoundedIcon sx={{ color: "var(--color-error)" }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Incidents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {note.incidents}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

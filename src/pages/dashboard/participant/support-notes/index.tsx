import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import NotesList from "../../../../components/support-notes/NotesList";
import { notes } from "../../../../utils";



export default function ParticipantNotesPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Support Notes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View detailed notes from your trainers about past sessions.
        </Typography>
      </Stack>

      <NotesList notes={notes} role="participant" />
    </Box>
  );
}

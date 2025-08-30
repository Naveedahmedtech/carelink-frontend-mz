// src/components/notes/NotesList.tsx
import React, { useState } from "react";
import { Box, Stack, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NoteCard, { Note } from "./NoteCard";

type NotesListProps = {
  notes: Note[];
  role: "participant" | "trainer" | "admin";
};

export default function NotesList({ notes, role }: NotesListProps) {
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter(
    (n) =>
      n.trainer?.toLowerCase().includes(search.toLowerCase()) ||
      n.participant?.toLowerCase().includes(search.toLowerCase()) ||
      n.activities.toLowerCase().includes(search.toLowerCase()) ||
      n.progress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Search */}
      <TextField
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "var(--color-text-muted)" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Notes */}
      <Stack spacing={2}>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            showTrainer={role !== "trainer"}
            showParticipant={role === "admin"}
          />
        ))}

        {filteredNotes.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No notes found.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

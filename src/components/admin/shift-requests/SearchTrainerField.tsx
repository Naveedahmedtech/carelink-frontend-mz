// src/components/admin/shift-requests/SearchTrainerField.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useGetAllTrainersQuery } from "../../../redux/features/trainerApi";

type ApiItem = {
  _id: string;                 // user id
  email?: string;
  status?: string;             // user status (ACTIVE, PENDING, etc.)
  trainer?: {
    _id: string;               // TRAINER ID (what backend wants)
    fullName?: string;
    status?: string;           // trainer profile status
  };
};

type Option = {
  id: string;                  // TRAINER ID (selected value)
  userId: string;              // user id
  label: string;               // rendered label
  email?: string;
  userStatus?: string;
  trainerStatus?: string;
  raw: ApiItem;
};

type Props = {
  value: string;                       // selected TRAINER ID
  onChange: (trainerId: string) => void;
  label?: string;
  placeholder?: string;
  onlyActive?: boolean;                // keep only ACTIVE user status by default
};

export default function SearchTrainerField({
  value,
  onChange,
  label = "Search Trainers",
  placeholder = "Type name or email…",
  onlyActive = true,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // Debounce the query
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Query trainers only when the dropdown is open
  const { data, isFetching } = useGetAllTrainersQuery(
    { page: 1, limit: 10, q: debouncedQ },
    { skip: !open }
  );

  // Map your API shape -> Option[]
  const options: Option[] = useMemo(() => {
    const list: ApiItem[] = (data as any)?.data?.data || []; // ← path from your payload
    return list
      .filter((u) => !!u.trainer?._id)                           // must have trainer doc
      .filter((u) => (onlyActive ? u.status === "ACTIVE" : true))// optional active-only
      .map((u) => {
        const trainerId = u.trainer!._id;
        const display =
          u.trainer?.fullName && u.email
            ? `${u.trainer.fullName} (${u.email})`
            : u.trainer?.fullName || u.email || trainerId;
        return {
          id: trainerId,                // TRAINER ID
          userId: u._id,                // USER ID
          label: display,
          email: u.email,
          userStatus: u.status,
          trainerStatus: u.trainer?.status,
          raw: u,
        };
      });
  }, [data, onlyActive]);

  // Find the selected option from options by TRAINER ID
  const selected = useMemo(
    () => options.find((o) => o.id === value) || null,
    [options, value]
  );

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      value={selected}
      loading={isFetching}
      // Important so Autocomplete matches by TRAINER ID
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(opt) => (opt as Option).label}
      onChange={(_, opt) => onChange((opt as Option)?.id || "")} // returns TRAINER ID
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          helperText="Search and select a trainer by name/email (ACTIVE users only)."
        />
      )}
      sx={{ width: "100%" }}
    />
  );
}

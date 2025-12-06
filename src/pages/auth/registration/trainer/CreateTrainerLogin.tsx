import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetPasswordMutation } from "../../../../redux/features/authApi";

export default function CreateTrainerLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [setPasswordApi, { isLoading }] = useSetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Invalid link. Email not found.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await setPasswordApi({ email, password }).unwrap();
      setSuccess("Your login has been created! Redirecting...");
      setTimeout(() => navigate("/auth/sign-in"), 2000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to set password.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.08)",
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom align="center">
          Create Your Login
        </Typography>
        <Typography align="center" color="text.secondary" mb={3}>
          Set a password for your trainer account associated with <b>{email}</b>
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.2, fontWeight: 600 }}
            >
              {isLoading ? "Saving..." : "Create Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Divider,
  TextField,
  MobileStepper,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { TRAINING_MODULES } from "../shared/trainingModules";

const STORAGE_KEY = "trainer-training-progress";

interface Props {
  onComplete: () => void;
}

export default function TrainingModulesSection({ onComplete }: Props) {
  const getSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saved = getSavedProgress();

  const [current, setCurrent] = useState(saved.current ?? 0);
  const [answers, setAnswers] = useState<Record<string, any>>(saved.answers ?? {});
  const [completed, setCompleted] = useState<boolean>(!!saved.completed);

  const [error, setError] = useState("");
  const [orientation, setOrientation] = useState<
    Record<string, "landscape" | "portrait">
  >({});
  const [activeSlide, setActiveSlide] = useState(0);

  const theme = useTheme();

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { current, answers, completed } = JSON.parse(saved);
      setCurrent(current);
      setAnswers(answers);
      setCompleted(!!completed);
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ current, answers, completed })
    );
  }, [current, answers, completed]);

  const module = TRAINING_MODULES[current];

  const handleAnswer = (qId: string, value: any) => {
    setAnswers((s) => ({ ...s, [`${module.id}-${qId}`]: value }));
  };

  const handleNext = () => {
    const allCorrect = module.questions.every((q) => {
      const userAnswer = answers[`${module.id}-${q.id}`];
      if (q.type === "mcq") return userAnswer === q.answer;
      if (q.type === "short")
        return (
          typeof userAnswer === "string" &&
          userAnswer.trim().toLowerCase() === String(q.answer).toLowerCase()
        );
      return false;
    });

    if (!allCorrect) {
      setError("All answers must be correct to proceed.");
      return;
    }

    setError("");
    setActiveSlide(0); // reset slide when going to next module
    if (current < TRAINING_MODULES.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setCompleted(true);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ current, answers, completed: true })
      );
      onComplete(); // ✅ wizard will push to Employment Agreement
    }
  };

  const handleImageLoad = (
    src: string,
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = e.currentTarget;
    const isLandscape = img.naturalWidth >= img.naturalHeight;
    setOrientation((prev) => ({
      ...prev,
      [src]: isLandscape ? "landscape" : "portrait",
    }));
  };

  return (
    <Stack spacing={3}>
      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={((current + 1) / TRAINING_MODULES.length) * 100}
        sx={{ height: 8, borderRadius: 5 }}
      />

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {module.title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            {module.content}
          </Typography>

          {module.videoUrl && (
            <Box sx={{ mb: 3 }}>
              <iframe
                width="100%"
                height="360"
                src={module.videoUrl}
                title="Training Video"
                allowFullScreen
                style={{ borderRadius: 12, border: "none" }}
              />
            </Box>
          )}

          {module.slides && module.slides.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#000",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 400,
                }}
              >
                <img
                  src={module.slides[activeSlide]}
                  alt={`Slide ${activeSlide + 1}`}
                  onLoad={(e) => handleImageLoad(module.slides[activeSlide], e)}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit:
                      orientation[module.slides[activeSlide]] === "portrait"
                        ? "contain"
                        : "cover",
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                Slide {activeSlide + 1} of {module.slides.length}
              </Typography>

              <MobileStepper
                variant="dots"
                steps={module.slides.length}
                position="static"
                activeStep={activeSlide}
                sx={{
                  mt: 2,
                  justifyContent: "space-between",
                  bgcolor: "transparent",
                }}
                nextButton={
                  <Button
                    size="small"
                    onClick={() =>
                      setActiveSlide((prev) =>
                        Math.min(prev + 1, module.slides.length - 1)
                      )
                    }
                    disabled={activeSlide === module.slides.length - 1}
                  >
                    Next
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={() =>
                      setActiveSlide((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={activeSlide === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Back
                  </Button>
                }
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {module.questions.map((q) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                {q.text}
              </Typography>

              {q.type === "mcq" && (
                <RadioGroup
                  value={answers[`${module.id}-${q.id}`] ?? -1}
                  onChange={(e) => handleAnswer(q.id, parseInt(e.target.value))}
                >
                  {q.options?.map((opt, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={idx}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
              )}

              {q.type === "short" && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Your answer..."
                  value={answers[`${module.id}-${q.id}`] ?? ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
              )}
            </Box>
          ))}

          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(227,30,104,0.4)",
          }}
        >
          {current < TRAINING_MODULES.length - 1
            ? "Next Section"
            : "Finish Training"}
        </Button>
      </Stack>
    </Stack>
  );
}

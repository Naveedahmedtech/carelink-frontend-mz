import React from "react";
import { Paper, Stack, Button, Tooltip } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ExportActions(props: {
  isAdmin: boolean;
  disabledActions: boolean;
  isExporting: boolean;
  activeTimesheetId?: string;
  onExportCSV: () => void;
  onExportPDF: () => void;
}) {
  const { isAdmin, disabledActions, isExporting, activeTimesheetId, onExportCSV, onExportPDF } = props;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        position: { md: "sticky" },
        bottom: { md: 16 },
        zIndex: 1,
      }}
    >
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} flexWrap="wrap">
        <Tooltip title="Download CSV">
          <span>
            <Button
              variant="outlined"
              startIcon={<TableViewIcon />}
              disabled={!isAdmin || disabledActions || isExporting || !activeTimesheetId}
              onClick={onExportCSV}
            >
              CSV
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Download PDF">
          <span>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              disabled={!isAdmin || disabledActions || isExporting || !activeTimesheetId}
              onClick={onExportPDF}
            >
              PDF
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

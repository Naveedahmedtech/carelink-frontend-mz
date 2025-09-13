import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


import { format, parseISO, isValid as isValidDate } from "date-fns";
import ReactSignatureCanvas from "react-signature-canvas";
import { Button, Stack } from "@mui/material";

export type SignatureValue = { dataUrl: string | null; date: string };

export default function SignatureBlock({
  value,
  onChange,
}: {
  value: SignatureValue;
  onChange: (v: SignatureValue) => void;
}) {
  const sigRef = React.useRef<ReactSignatureCanvas | null>(null);

  const snapshotToValue = React.useCallback(() => {
    const sig = sigRef.current;
    if (!sig) return;

const dataUrl = sig.isEmpty()
  ? null
  : sig.getCanvas().toDataURL("image/png");


    onChange({
      ...value,
      dataUrl,
      date: value.date || new Date().toISOString().split("T")[0], // auto-fill today's date
    });
  }, [onChange, value]);


  const clear = React.useCallback(() => {
    sigRef.current?.clear();
    onChange({ ...value, dataUrl: null });
  }, [onChange, value]);

  const undo = React.useCallback(() => {
    const sig = sigRef.current;
    if (!sig) return;
    const data = sig.toData();
    if (data.length === 0) return;
    data.pop();
    sig.fromData(data);
    snapshotToValue();
  }, [snapshotToValue]);

  React.useEffect(() => {
    const sig = sigRef.current;
    if (!sig) return;
    if (value.dataUrl) {
      try {
        sig.fromDataURL(value.dataUrl);
      } catch {
        sig.clear();
      }
    } else {
      sig.clear();
    }
  }, [value.dataUrl]);

  // DatePicker (date-fns uses native Date objects)
  const muiDateValue: Date | null =
    value.date && isValidDate(parseISO(value.date)) ? parseISO(value.date) : null;

  return (
    <div className="rounded-xl border border-border bg-backgroundShade1 p-4 sm:p-6">
      <h3 className="text-base font-bold mb-3 text-text">Signature</h3>

      {/* Narrower + centered */}
      <div className="mx-auto w-full max-w-[560px]">
        <div className="border border-dashed border-border rounded-lg p-2 bg-backgroundShade1">
          <ReactSignatureCanvas
            ref={sigRef}
            penColor="#111"
            minWidth={0.6}
            maxWidth={2.6}
            throttle={16}
            backgroundColor="#ffffff"
            onEnd={snapshotToValue}
            canvasProps={{
              style: {
                width: "100%",
                height: 160,
                display: "block",
                cursor: "crosshair",
                borderRadius: 8,
              },
            }}
          />
        </div>

        {/* Toolbar */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} className="mt-3">
          <div className="flex-1">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={muiDateValue}
                onChange={(d: Date | null) =>
                  onChange({
                    ...value,
                    date: d && isValidDate(d) ? format(d, "yyyy-MM-dd") : "",
                  })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          <div className="flex gap-1 sm:self-end">
            <Button variant="outlined" onClick={undo}>
              Undo
            </Button>
            <Button color="error" variant="outlined" onClick={clear}>
              Clear
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

import * as React from 'react';
import {
  Card, CardActionArea, CardContent, Stack, Typography, Box, useTheme, alpha, Tooltip
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { visuallyHidden } from '@mui/utils';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  checked: boolean;
  icon: React.ElementType;
  label: string;
  description: string;
  onSelect: () => void;
  disabled?: boolean;
  dense?: boolean;                // compact paddings
  name?: string;                  // radio group name (for a11y)
  id?: string;                    // radio id
  sx?: SxProps<Theme>;            // theme overrides
  'data-testid'?: string;
};

const RoleOptionCard = React.memo(
  React.forwardRef<HTMLDivElement, Props>(function RoleOptionCard(
    { checked, icon: Icon, label, description, onSelect, disabled, dense, name, id, sx, ...rest },
    ref
  ) {
    const theme = useTheme();
    const uid = React.useId();
    const radioId = id ?? uid;
    const labelId = `${radioId}-label`;
    const descId = `${radioId}-desc`;

    const padding = dense ? 1.5 : 2;

    return (
      <Card
        ref={ref}
        variant="outlined"
        role="none" // radio handled by native <input>
        aria-disabled={disabled || undefined}
        sx={{
          position: 'relative',
          borderRadius: 2,
          borderColor: checked ? 'primary.main' : 'divider',
          transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease',
          boxShadow: checked ? theme.shadows[2] : 'none',
          opacity: disabled ? 0.6 : 1,
          ...(sx as object),
        }}
        {...rest}
      >
        {/* Native radio for proper semantics */}
        <input
          type="radio"
          id={radioId}
          name={name}
          checked={checked}
          readOnly
          aria-labelledby={labelId}
          aria-describedby={descId}
          style={visuallyHidden as React.CSSProperties}
          tabIndex={-1}
        />

        <CardActionArea
          onClick={!disabled ? onSelect : undefined}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect();
            }
          }}
          disabled={disabled}
          sx={{
            p: padding,
            '&.Mui-focusVisible': {
              outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
              outlineOffset: 2,
            },
            '&:active': { transform: disabled ? 'none' : 'scale(0.995)' },
            '&:hover': {
              '.role-card__ring': { opacity: 1 },
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              aria-hidden
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.primary.main, checked ? 0.16 : 0.1),
                color: checked ? 'primary.main' : 'text.primary',
                flexShrink: 0,
                transition: 'background-color 120ms ease, color 120ms ease',
              }}
            >
              <Icon fontSize="small" />
            </Box>

            <CardContent sx={{ p: 0, flex: 1, '&:last-child': { pb: 0 } }}>
              <Typography id={labelId} fontWeight={700} lineHeight={1.3}>
                {label}
              </Typography>

              <Tooltip title={description} disableInteractive enterDelay={600}>
                <Typography
                  id={descId}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {description}
                </Typography>
              </Tooltip>
            </CardContent>

            {/* Check badge */}
            <Box
              aria-hidden
              sx={{
                ml: 1,
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: checked ? 'primary.main' : 'transparent',
                border: checked ? 'none' : `2px solid ${theme.palette.divider}`,
                transition: 'all 120ms ease',
                flexShrink: 0,
              }}
              className="role-card__ring"
            >
              {checked ? (
                <CheckCircleRoundedIcon sx={{ color: 'primary.contrastText' }} fontSize="small" />
              ) : null}
            </Box>
          </Stack>
        </CardActionArea>
      </Card>
    );
  })
);

export default RoleOptionCard;

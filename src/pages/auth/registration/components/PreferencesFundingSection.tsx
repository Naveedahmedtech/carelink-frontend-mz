import * as React from 'react';
import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Autocomplete from '@mui/material/Autocomplete';
import SectionCard from './SectionCard';
import { AUTO_PROPS, FIELD_PROPS, SELECT_PROPS } from '../shared/fieldProps';
import { DAYS, INTERESTS } from '../shared/constants';
import { FundingType, RegistrationErrors, RegistrationValues } from '../shared/types';

type Props = {
    values: RegistrationValues;
    errors: RegistrationErrors;
    fundingType: FundingType;
    setFundingType: (f: FundingType) => void;
    onChange: (k: keyof RegistrationValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    setDayAvailability: (day: string, val: string) => void;
    setInterests: (tags: string[]) => void;
};

export default function PreferencesFundingSection({
    values, errors, fundingType, setFundingType, onChange, setDayAvailability, setInterests
}: Props) {
    return (
        <SectionCard
            title="Preferences & Funding"
            subtitle="Your interests, preferred times and funding details"
            icon={<FavoriteRoundedIcon fontSize="small" />}
        >
            {/* Interests */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Interests</Typography>
                <Autocomplete
                    {...AUTO_PROPS}
                    multiple
                    options={[...INTERESTS]}
                    value={values.interests}
                    onChange={(_, val) => setInterests(val)}
                    disableCloseOnSelect
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => {
                            const tagProps = getTagProps({ index }); // includes key, onDelete, etc.
                            return (
                                <Chip
                                    {...tagProps}
                                    size="small"
                                    variant="outlined"
                                    label={option}
                                />
                            );
                        })
                    }

                    renderInput={(params) => (<TextField {...params} {...FIELD_PROPS} placeholder="Select interests" />)}
                />
                <FormHelperText>Select all that apply. You can type to filter.</FormHelperText>
            </Box>

            {/* Availability */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Preferred Days / Times</Typography>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                    {DAYS.map((d) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={d}>
                            <TextField {...FIELD_PROPS}
                                label={`${d} availability`} placeholder="e.g., 9am–12pm"
                                value={values.availability[d] || ''}
                                onChange={(e) => setDayAvailability(d, e.target.value)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Funding */}
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>

                {fundingType !== 'ndia' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField {...FIELD_PROPS}
                                label="Plan Manager Name"
                                value={values.planManagerName}
                                onChange={onChange('planManagerName')}
                                error={!!errors.planManagerName}
                                helperText={errors.planManagerName}
                                autoComplete="organization"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...FIELD_PROPS}
                                label="Plan Manager Invoice Email"
                                value={values.planManagerEmail}
                                onChange={onChange('planManagerEmail')}
                                error={!!errors.planManagerEmail}
                                helperText={errors.planManagerEmail}
                                inputProps={{ inputMode: 'email' }}
                                autoComplete="email"
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12} sm={6}>
                    <FormControl {...SELECT_PROPS}>
                        <InputLabel id="funding-type-label">Funding Type</InputLabel>
                        <Select
                            labelId="funding-type-label"
                            label="Funding Type"
                            value={fundingType}
                            onChange={(e) => setFundingType(e.target.value as FundingType)}
                        >
                            <MenuItem value="plan">Plan Managed</MenuItem>
                            <MenuItem value="self">Self-Managed</MenuItem>
                            <MenuItem value="ndia">NDIA Managed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </SectionCard>
    );
}

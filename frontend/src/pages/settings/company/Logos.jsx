import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave } from '../SettingsMenus';
import LogoHorizontal from '../../../assets/logo-horizontal-primary.svg';


export const Logos = (props) => {
    const { settingsData } = props;
    const [loading, setLoading] = useState(true);
    const { updateSettings } = useSettingsBackend();
    const { refreshSettings } = useData();
    const [circleLoading, setCircleLoading] = useState(false);
    const [formState, setFormState] = useState({
        company_logo: settingsData.company_logo.value || null,
    });

    const handleChange = entry => {
        setFormState({
            ...formState,
            [entry.target.name]: entry.target.value,
        });

        setLoading(false);
    };

    return (
        <Box
            p={3}
            maxWidth={600}
        >
            <Typography
                variant="h4"
                sx={{ fontWeight: 600, mb: 2 }}
            >
                Company Logo
            </Typography>

            <Stack
                spacing={2}
                sx={{ maxWidth: 400, maxHeight: 1000 }}
            >

                <Box sx={{ width: '100%', px: 1 }}>
                    <img src={formState.company_logo || LogoHorizontal} alt={"Unable to resolve image"} style={{ width: '60%', objectFit: 'cover' }} />
                </Box>

                <CustomFilledInput
                    label="Company Logo URL"
                    name="company_logo"
                    value={formState.company_logo ?? ''}
                    onChange={handleChange}
                    sx={{ pb: 2 }}
                />

                <CircularButton
                    sx={{ py: 2, px: 6, width: 250 }}
                    onClick={() => {
                        handleSave(
                            formState,
                            setLoading,
                            setCircleLoading,
                            settingsData,
                            updateSettings,
                            refreshSettings
                        )
                    }
                    }
                    disabled={loading || circleLoading}
                >
                    {circleLoading ? (
                        <Box >

                            <CircularProgress
                                size={22}
                                thickness={5}
                                sx={{ color: '#FFF' }}
                            />
                        </Box>
                    ) : (
                        'Save Changes'
                    )}
                </CircularButton>
            </Stack>
        </Box>
    );
}
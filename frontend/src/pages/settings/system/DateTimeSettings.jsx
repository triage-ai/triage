import { Box, CircularProgress, FormControl, MenuItem, Stack, Typography } from '@mui/material';
import jstz from 'jstz';
import { useRef, useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave, StyledSelect } from '../SettingsMenus';

export const DateAndTime = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		default_timezone: settingsData.default_timezone.value,
		date_and_time_format: settingsData.date_and_time_format.value,
		default_schedule: settingsData.default_schedule.value,
	});
	const TimeZoneArray = Intl.supportedValuesOf('timeZone').concat('UTC')


	const handleChange = (entry) => {
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const handleLocationDetect = () => {
		const timezone = jstz.determine();
		handleChange({ target: { name: 'default_timezone', value: timezone.name() } });
	};

	return (
		<Box p={3} maxWidth={600}>
			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 1.5 }}>
					Default Time Zone
				</Typography>

				<Stack direction='row' spacing={2} alignItems='center'>
					<FormControl>
						<StyledSelect name='default_timezone' value={formState.default_timezone} onChange={handleChange}>
							{TimeZoneArray.map((zone, idx) => {
								return <MenuItem value={zone} key={idx}>{zone}</MenuItem>;
							})}
						</StyledSelect>
					</FormControl>

					<CircularButton
						sx={{
							background: 'transparent',
							color: '#22874E',
							fontWeight: 600,
							border: '1.5px solid #22874E',
							py: 1,
							px: 2,
							'&:hover': {
								background: '#E5EFE9',
							},
						}}
						onClick={handleLocationDetect}
					>
						Auto Detect
					</CircularButton>
				</Stack>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Date and Time Format
				</Typography>

				<FormControl>
					<StyledSelect name='date_and_time_format' value={formState.date_and_time_format} onChange={handleChange}>
						<MenuItem value='Locale Defaults'>Locale Defaults</MenuItem>
						<MenuItem value='Locale Defaults, 24-Hour Time'>Locale Defaults, 24-Hour Time</MenuItem>
					</StyledSelect>
				</FormControl>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Schedule
				</Typography>

				<FormControl>
					<StyledSelect name='default_schedule' value={formState.default_schedule} onChange={handleChange}>
						<MenuItem value='24/5'>24/5</MenuItem>
						<MenuItem value='24/7'>24/7</MenuItem>
						<MenuItem value='Monday - Friday 8am - 5pm with U.S. Holidays'>Monday - Friday 8am - 5pm with U.S. Holidays</MenuItem>
					</StyledSelect>
				</FormControl>

				<CircularButton
					sx={{ py: 2, px: 6, mt: 3, width: 250 }}
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</CircularButton>
			</Stack>
		</Box>
	);
};

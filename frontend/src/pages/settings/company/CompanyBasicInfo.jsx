import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave } from '../SettingsMenus';

export const BasicInformation = props => {
	const { settingsData } = props;
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		company_name: settingsData.company_name.value || '',
		website: settingsData.website.value || '',
		phone_number: settingsData.phone_number.value || '',
		address: settingsData.address.value || '',
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
				Company Information
			</Typography>

			<Stack
				spacing={2}
				sx={{ maxWidth: 400, maxHeight: 1000 }}
			>
				<CustomFilledInput
					label="Company Name"
					name="company_name"
					value={formState.company_name}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="Website"
					name="website"
					value={formState.website}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="Phone Number"
					name="phone_number"
					value={formState.phone_number}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="Address"
					multiline
					rows={3}
					name="address"
					value={formState.address}
					onChange={handleChange}
					sx={{ pb: 2 }}
				/>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() =>
						handleSave(
							formState,
							setLoading,
							setCircleLoading,
							settingsData,
							updateSettings,
							refreshSettings
						)
					}
					disabled={loading || circleLoading}
				>
					{circleLoading ? (
						<CircularProgress
							size={22}
							thickness={5}
							sx={{ color: '#FFF' }}
						/>
					) : (
						'Save Changes'
					)}
				</CircularButton>
			</Stack>
		</Box>
	);
};

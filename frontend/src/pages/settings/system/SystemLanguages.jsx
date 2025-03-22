import {
	Box,
	CircularProgress,
	FormControl,
	MenuItem,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave, StyledSelect } from '../SettingsMenus';

export const SystemLanguages = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		primary_langauge: settingsData.primary_langauge.value,
		secondary_langauge: settingsData.secondary_langauge.value,
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
				sx={{ fontWeight: 600, mb: 1.5 }}
			>
				Primary Language
			</Typography>

			<FormControl>
				<StyledSelect
					name="primary_langauge"
					value={formState.primary_langauge}
					onChange={handleChange}
				>
					<MenuItem value="English - US (English)">English - US (English)</MenuItem>
				</StyledSelect>
			</FormControl>

			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
			>
				Secondary Language
			</Typography>

			<FormControl>
				<StyledSelect
					name="secondary_langauge"
					value={formState.secondary_langauge}
					onChange={handleChange}
				>
					<MenuItem value="--Add a Langauge--">--Add a Langauge--</MenuItem>
					<MenuItem value="English - US (English)">English - US (English)</MenuItem>
				</StyledSelect>
			</FormControl>

			<CircularButton
				sx={{ py: 2, px: 6, mt: 3, width: 250, display: 'block' }}
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
		</Box>
	);
};

import { Box, CircularProgress, InputAdornment, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { CircleHelp } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave, StyledSelect } from '../SettingsMenus';
import { CustomInput } from '../../../components/custom-select';
import { HtmlTooltip } from '../../../components/tooltip';


export const TaskSettings = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		default_task_number_format: settingsData.default_task_number_format.value,
		default_task_number_sequence: settingsData.default_task_number_sequence.value,
		default_task_priority: settingsData.default_task_priority.value,
	});

	const handleChange = (entry) => {
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const handleCheckBox = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);
	};

	return (
		<Box p={3} maxWidth={600}>
			<Stack>
				<Stack direction='row' alignItems='center' spacing={8}>
					<Stack>
						<Typography variant='h4' sx={{ fontWeight: 600, mb: 1.5 }}>
							Default Task Number Format
						</Typography>

						<CustomInput
							name='default_task_number_format'
							value={formState.default_task_number_format}
							onChange={handleChange}
							InputProps={{

								endAdornment: (
									<InputAdornment position='end'>
										<HtmlTooltip
											title={
												<React.Fragment>
													<Typography color='inherit'>Task Number Format</Typography>
													{"This sequence will be used to generated task numbers. Use hash signs ('#')"}
													{' where digits will be expected in the sequence.'}{' '}
													<b>
														{'Anything other than hash signs'}
														{' will be preserved in the format.'}
													</b>
													<br />
													<br />
													{'For example, for six-digit only formats, use ######. This could produce a number like 123456.'}
												</React.Fragment>
											}
											placement='right'
											arrow
										>
											<CircleHelp size={20} />
										</HtmlTooltip>
									</InputAdornment>
								)
							}}
						/>
					</Stack>

				</Stack>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Task Number Sequence
				</Typography>
				<StyledSelect
					name='default_task_number_sequence'
					value={formState.default_task_number_sequence}
					onChange={handleChange}
					sx={{ width: 200 }}
				>
					<MenuItem value='Random'>Random</MenuItem>
					<MenuItem value='Incrementing'>Incrementing</MenuItem>
				</StyledSelect>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Priority
				</Typography>
				<StyledSelect name='default_task_priority' value={formState.default_task_priority} onChange={handleChange} sx={{ width: 350, mb: 4 }}>
					<MenuItem value='Low'>Low</MenuItem>
					<MenuItem value='Normal'>Normal</MenuItem>
					<MenuItem value='High'>High</MenuItem>
					<MenuItem value='Emergency'>Emergency</MenuItem>
				</StyledSelect>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</CircularButton>
			</Stack>
		</Box>
	)
};
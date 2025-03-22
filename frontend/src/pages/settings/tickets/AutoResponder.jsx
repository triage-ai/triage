import { Box, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave } from '../SettingsMenus';

export const Autoresponder = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		new_ticket: settingsData.new_ticket.value,
		new_ticket_by_agent: settingsData.new_ticket_by_agent.value,
		new_message_submitter: settingsData.new_message_submitter.value,
		new_message_participants: settingsData.new_message_participants.value,
		overlimit_notice: settingsData.overlimit_notice.value,
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
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 1.5 }}>
					New Ticket
				</Typography>

				<FormControlLabel
					name='new_ticket'
					control={<Checkbox checked={formState.new_ticket === 'on' ? true : false} onChange={handleCheckBox} />}
					label={
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							Ticket Owner
						</Typography>
					}
				/>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					New Ticket By Agent
				</Typography>

				<FormControlLabel
					name='new_ticket_by_agent'
					control={<Checkbox checked={formState.new_ticket_by_agent === 'on' ? true : false} onChange={handleCheckBox} />}
					label={
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							Ticket Owner
						</Typography>
					}
				/>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					New Message
				</Typography>
				<Stack>
					<FormControlLabel
						name='new_message_submitter'
						control={<Checkbox checked={formState.new_message_submitter === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Submitter: Send receipt confirmation
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_message_participants'
						control={<Checkbox checked={formState.new_message_participants === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Participants: Send new activity notice
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Overlimit Notice
				</Typography>

				<FormControlLabel
					name='overlimit_notice'
					control={<Checkbox checked={formState.overlimit_notice === 'on' ? true : false} onChange={handleCheckBox} />}
					label={
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							Ticket Submitter
						</Typography>
					}
					sx={{ pb: 3 }}
				/>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</CircularButton>
			</Stack>
		</Box>
	);
};

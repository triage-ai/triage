import { Box, Checkbox, CircularProgress, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave } from '../SettingsMenus';

export const TaskAlertsAndNotices = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		new_task_alert_status: settingsData.new_task_alert_status.value,
		new_task_alert_admin_email: settingsData.new_task_alert_admin_email.value,
		new_task_alert_department_manager: settingsData.new_task_alert_department_manager.value,
		new_task_alert_department_members: settingsData.new_task_alert_department_members.value,
		new_activity_alert_status: settingsData.new_activity_alert_status.value,
		new_activity_alert_last_respondent: settingsData.new_activity_alert_last_respondent.value,
		new_activity_alert_assigned_agent: settingsData.new_activity_alert_assigned_agent.value,
		new_activity_alert_department_manager: settingsData.new_activity_alert_department_manager.value,
		task_assignment_alert_status: settingsData.task_assignment_alert_status.value,
		task_assignment_alert_assigned_agent: settingsData.task_assignment_alert_assigned_agent.value,
		task_assignment_alert_team_lead: settingsData.task_assignment_alert_team_lead.value,
		task_assignment_alert_team_members: settingsData.task_assignment_alert_team_members.value,
		task_transfer_alert_status: settingsData.task_transfer_alert_status.value,
		task_transfer_alert_assigned_agent: settingsData.task_transfer_alert_assigned_agent.value,
		task_transfer_alert_department_manager: settingsData.task_transfer_alert_department_manager.value,
		task_transfer_alert_department_members: settingsData.task_transfer_alert_department_members.value,
		overdue_task_alert_status: settingsData.overdue_task_alert_status.value,
		overdue_task_alert_assigned_agent: settingsData.overdue_task_alert_assigned_agent.value,
		overdue_task_alert_department_manager: settingsData.overdue_task_alert_department_manager.value,
		overdue_task_alert_department_members: settingsData.overdue_task_alert_department_members.value,
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
					New Task Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.new_task_alert_status} onChange={handleChange} name='new_task_alert_status'>
							<FormControlLabel
								value='enable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Enable
									</Typography>
								}
							/>

							<FormControlLabel
								value='disable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Disable
									</Typography>
								}
							/>
						</RadioGroup>
					</Stack>

					<FormControlLabel
						name='new_task_alert_admin_email'
						control={<Checkbox checked={formState.new_task_alert_admin_email === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Admin Email
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_task_alert_department_manager'
						control={<Checkbox checked={formState.new_task_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_task_alert_department_members'
						control={<Checkbox checked={formState.new_task_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Members
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					New Activity Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.new_activity_alert_status} onChange={handleChange} name='new_activity_alert_status'>
							<FormControlLabel
								value='enable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Enable
									</Typography>
								}
							/>

							<FormControlLabel
								value='disable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Disable
									</Typography>
								}
							/>
						</RadioGroup>
					</Stack>

					<FormControlLabel
						name='new_activity_alert_last_respondent'
						control={<Checkbox checked={formState.new_activity_alert_last_respondent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Last Respondent
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_activity_alert_assigned_agent'
						control={<Checkbox checked={formState.new_activity_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_activity_alert_department_manager'
						control={<Checkbox checked={formState.new_activity_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Task Assignment Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.task_assignment_alert_status} onChange={handleChange} name='task_assignment_alert_status'>
							<FormControlLabel
								value='enable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Enable
									</Typography>
								}
							/>

							<FormControlLabel
								value='disable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Disable
									</Typography>
								}
							/>
						</RadioGroup>
					</Stack>

					<FormControlLabel
						name='task_assignment_alert_assigned_agent'
						control={<Checkbox checked={formState.task_assignment_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='task_assignment_alert_team_lead'
						control={<Checkbox checked={formState.task_assignment_alert_team_lead === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Team Lead
							</Typography>
						}
					/>

					<FormControlLabel
						name='task_assignment_alert_team_members'
						control={<Checkbox checked={formState.task_assignment_alert_team_members === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Team Members
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Task Transfer Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.task_transfer_alert_status} onChange={handleChange} name='task_transfer_alert_status'>
							<FormControlLabel
								value='enable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Enable
									</Typography>
								}
							/>

							<FormControlLabel
								value='disable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Disable
									</Typography>
								}
							/>
						</RadioGroup>
					</Stack>

					<FormControlLabel
						name='task_transfer_alert_assigned_agent'
						control={<Checkbox checked={formState.task_transfer_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='task_transfer_alert_department_manager'
						control={<Checkbox checked={formState.task_transfer_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='task_transfer_alert_department_members'
						control={<Checkbox checked={formState.task_transfer_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Members
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Overdue Task Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.overdue_task_alert_status} onChange={handleChange} name='overdue_task_alert_status'>
							<FormControlLabel
								value='enable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Enable
									</Typography>
								}
							/>

							<FormControlLabel
								value='disable'
								control={<Radio />}
								label={
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Disable
									</Typography>
								}
							/>
						</RadioGroup>
					</Stack>

					<FormControlLabel
						name='overdue_task_alert_assigned_agent'
						control={<Checkbox checked={formState.overdue_task_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='overdue_task_alert_department_manager'
						control={<Checkbox checked={formState.overdue_task_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='overdue_task_alert_department_members'
						control={<Checkbox checked={formState.overdue_task_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Members
							</Typography>
						}
						sx={{ pb: 3 }}
					/>
				</Stack>
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

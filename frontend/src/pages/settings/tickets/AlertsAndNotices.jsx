import { Box, Checkbox, CircularProgress, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave } from '../SettingsMenus';

export const AlertsAndNotices = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		new_ticket_alert_status: settingsData.new_ticket_alert_status.value,
		new_ticket_alert_admin_email: settingsData.new_ticket_alert_admin_email.value,
		new_ticket_alert_department_manager: settingsData.new_ticket_alert_department_manager.value,
		new_ticket_alert_department_members: settingsData.new_ticket_alert_department_members.value,
		new_ticket_alert_org_manager: settingsData.new_ticket_alert_org_manager.value,
		new_message_alert_status: settingsData.new_message_alert_status.value,
		new_message_alert_last_respondent: settingsData.new_message_alert_last_respondent.value,
		new_message_alert_assigned_agent: settingsData.new_message_alert_assigned_agent.value,
		new_message_alert_department_manager: settingsData.new_message_alert_department_manager.value,
		new_message_alert_org_manager: settingsData.new_message_alert_org_manager.value,
		new_internal_activity_alert_status: settingsData.new_internal_activity_alert_status.value,
		new_internal_activity_alert_last_respondent: settingsData.new_internal_activity_alert_last_respondent.value,
		new_internal_activity_alert_assigned_agent: settingsData.new_internal_activity_alert_assigned_agent.value,
		new_internal_activity_alert_department_manager: settingsData.new_internal_activity_alert_department_manager.value,
		ticket_assignment_alert_status: settingsData.ticket_assignment_alert_status.value,
		ticket_assignment_alert_assigned_agent: settingsData.ticket_assignment_alert_assigned_agent.value,
		ticket_assignment_alert_team_lead: settingsData.ticket_assignment_alert_team_lead.value,
		ticket_assignment_alert_team_members: settingsData.ticket_assignment_alert_team_members.value,
		ticket_transfer_alert_status: settingsData.ticket_transfer_alert_status.value,
		ticket_transfer_alert_assigned_agent: settingsData.ticket_transfer_alert_assigned_agent.value,
		ticket_transfer_alert_department_manager: settingsData.ticket_transfer_alert_department_manager.value,
		ticket_transfer_alert_department_members: settingsData.ticket_transfer_alert_department_members.value,
		overdue_ticket_alert_status: settingsData.overdue_ticket_alert_status.value,
		overdue_ticket_alert_assigned_agent: settingsData.overdue_ticket_alert_assigned_agent.value,
		overdue_ticket_alert_department_manager: settingsData.overdue_ticket_alert_department_manager.value,
		overdue_ticket_alert_department_members: settingsData.overdue_ticket_alert_department_members.value,
		system_alerts_system_errors: settingsData.system_alerts_system_errors.value,
		system_alerts_sql_errors: settingsData.system_alerts_sql_errors.value,
		system_alerts_excessive_login_attempts: settingsData.system_alerts_excessive_login_attempts.value,
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
					New Ticket Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.new_ticket_alert_status} onChange={handleChange} name='new_ticket_alert_status'>
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
						name='new_ticket_alert_admin_email'
						control={<Checkbox checked={formState.new_ticket_alert_admin_email === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Admin Email
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_ticket_alert_department_manager'
						control={<Checkbox checked={formState.new_ticket_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_ticket_alert_department_members'
						control={<Checkbox checked={formState.new_ticket_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Members
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_ticket_alert_org_manager'
						control={<Checkbox checked={formState.new_ticket_alert_org_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Organization Account Manager
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					New Message Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.new_message_alert_status} onChange={handleChange} name='new_message_alert_status'>
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
						name='new_message_alert_last_respondent'
						control={<Checkbox checked={formState.new_message_alert_last_respondent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Last Respondent
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_message_alert_assigned_agent'
						control={<Checkbox checked={formState.new_message_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_message_alert_department_manager'
						control={<Checkbox checked={formState.new_message_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_message_alert_org_manager'
						control={<Checkbox checked={formState.new_message_alert_org_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Organization Account Manager
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					New Internal Activity Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.new_internal_activity_alert_status} onChange={handleChange} name='new_internal_activity_alert_status'>
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
						name='new_internal_activity_alert_last_respondent'
						control={<Checkbox checked={formState.new_internal_activity_alert_last_respondent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Last Respondent
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_internal_activity_alert_assigned_agent'
						control={<Checkbox checked={formState.new_internal_activity_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='new_internal_activity_alert_department_manager'
						control={
							<Checkbox checked={formState.new_internal_activity_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />
						}
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
					Ticket Assignment Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.ticket_assignment_alert_status} onChange={handleChange} name='ticket_assignment_alert_status'>
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
						name='ticket_assignment_alert_assigned_agent'
						control={<Checkbox checked={formState.ticket_assignment_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent
							</Typography>
						}
					/>

					<FormControlLabel
						name='ticket_assignment_alert_team_lead'
						control={<Checkbox checked={formState.ticket_assignment_alert_team_lead === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Team Lead
							</Typography>
						}
					/>

					<FormControlLabel
						name='ticket_assignment_alert_team_members'
						control={<Checkbox checked={formState.ticket_assignment_alert_team_members === 'on' ? true : false} onChange={handleCheckBox} />}
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
					Ticket Transfer Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.ticket_transfer_alert_status} onChange={handleChange} name='ticket_transfer_alert_status'>
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
						name='ticket_transfer_alert_assigned_agent'
						control={<Checkbox checked={formState.ticket_transfer_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='ticket_transfer_alert_department_manager'
						control={<Checkbox checked={formState.ticket_transfer_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='ticket_transfer_alert_department_members'
						control={<Checkbox checked={formState.ticket_transfer_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
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
					Overdue Ticket Alert
				</Typography>

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5, fontStyle: 'italic' }}>
							Status:
						</Typography>

						<RadioGroup row value={formState.overdue_ticket_alert_status} onChange={handleChange} name='overdue_ticket_alert_status'>
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
						name='overdue_ticket_alert_assigned_agent'
						control={<Checkbox checked={formState.overdue_ticket_alert_assigned_agent === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Assigned Agent / Team
							</Typography>
						}
					/>

					<FormControlLabel
						name='overdue_ticket_alert_department_manager'
						control={<Checkbox checked={formState.overdue_ticket_alert_department_manager === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Department Manager
							</Typography>
						}
					/>

					<FormControlLabel
						name='overdue_ticket_alert_department_members'
						control={<Checkbox checked={formState.overdue_ticket_alert_department_members === 'on' ? true : false} onChange={handleCheckBox} />}
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
					System Alerts
				</Typography>

				<Stack>
					<FormControlLabel
						name='system_alerts_system_errors'
						control={<Checkbox checked={formState.system_alerts_system_errors === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								System errors (enabled by default)
							</Typography>
						}
					/>

					<FormControlLabel
						name='system_alerts_sql_errors'
						control={<Checkbox checked={formState.system_alerts_sql_errors === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								SQL errors
							</Typography>
						}
					/>

					<FormControlLabel
						name='system_alerts_excessive_login_attempts'
						control={<Checkbox checked={formState.system_alerts_excessive_login_attempts === 'on' ? true : false} onChange={handleCheckBox} />}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Excessive failed login attempts
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

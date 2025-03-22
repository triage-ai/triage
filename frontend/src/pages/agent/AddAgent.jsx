import {
	Alert,
	Box,
	Checkbox,
	FormControlLabel,
	IconButton,
	Stack,
	Step,
	StepConnector,
	StepLabel,
	Stepper,
	Typography,
	stepConnectorClasses,
	styled
} from '@mui/material';
import jstz from 'jstz';
import { Check, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CustomSelect } from '../../components/custom-select';
import { CircularButton } from '../../components/sidebar';
import { TransferList } from '../../components/transfer-list';
import { useAgentBackend } from '../../hooks/useAgentBackend';
import { useRoleBackend } from '../../hooks/useRoleBackend';
import { DepartmentSelect } from '../department/DepartmentSelect';
import { RoleSelect } from '../role/RoleSelect';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)',
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: '#58585833',
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
	color: '#58585833',
	display: 'flex',
	height: 22,
	alignItems: 'center',
	...(ownerState.active && {
		color: '#22874E',
	}),
	'& .QontoStepIcon-completedIcon': {
		color: '#22874E',
		zIndex: 1,
		fontSize: 18,
	},
	'& .QontoStepIcon-circle': {
		width: 8,
		height: 8,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
	},
}));

function QontoStepIcon(props) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot ownerState={{ active }} className={className}>
			{completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
		</QontoStepIconRoot>
	);
}

const steps = ['Information', 'Settings', 'Access', 'Authentication'];

export const AddAgent = ({ handleCreated, handleEdited, editAgent, setConfirmation }) => {

	AddAgent.propTypes = {
		handleCreated: PropTypes.func,
		handleEdited: PropTypes.func,
		editAgent: PropTypes.object
	}

	const { getAllRoles } = useRoleBackend();
	const { createAgent, updateAgent, getPermissions } = useAgentBackend();

	const [roles, setRoles] = useState([]);

	const [permissions, setPermissions] = useState([]);
	const [allPermissions, setAllPermissions] = useState([]);

	const [activeStep, setActiveStep] = useState(0);
	const [isNextDisabled, setIsNextDisabled] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [notification, setNotification] = useState('')
	const [formData, setFormData] = useState({
		dept_id: '',
		role_id: '',
		email: '',
		phone: '',
		firstname: '',
		lastname: '',
		signature: '',
		timezone: '',
		admin: 0,
	});

	let timezoneOptions = Intl.supportedValuesOf('timeZone').map(t => ({ value: t, label: t }));
	timezoneOptions.push({ value: 'EST', label: 'EST' });

	useEffect(() => {
		timezoneOptions.push({ label: 'UTC', value: 'UTC' })
		// getAllRoles()
		// 	.then((roles) => {
		// 		const rolesData = roles.data;
		// 		const formattedRoles = rolesData.map((role) => {
		// 			return { value: role.role_id, label: role.name };
		// 		});

		// 		setRoles(formattedRoles);
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
		getPermissions()
			.then((res) => {
				setAllPermissions(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const permissionsFromString = (jsonString) => {
		let list;
		try {
			list = JSON.parse(jsonString);
		} catch (err) {
			return [];
		}
		return Object.keys(list)
			.map((name) => {
				const match = allPermissions.find((item) => item.name === name);
				return match ? { name: match.name, label: match.label } : null;
			})
			.filter(Boolean);
	};

	useEffect(() => {
		if (allPermissions.length > 0 && editAgent) {
			setPermissions(permissionsFromString(editAgent.permissions));
		}
	}, [allPermissions]);

	useEffect(() => {
		if (editAgent) {
			setFormData(editAgent);
		}
	}, [editAgent]);

	// Effect to check validation whenever formData or currentStep changes
	useEffect(() => {
		setIsNextDisabled(!validateCurrentStep());
	}, [formData, activeStep]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: name === 'admin' ? (e.target.checked ? 1 : 0) : value,
		}));
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const validateStep1 = () => {
		const { firstname, lastname } = formData;
		return firstname !== '' && lastname !== '';
	};

	const validateStep2 = () => {
		const { admin, timezone, signature } = formData;
		return admin !== '' && timezone !== '' && signature !== '';
	};

	const validateStep3 = () => {
		const { dept_id, role_id } = formData;
		return dept_id !== '' && role_id !== '';
	};

	const validateStep4 = () => {
		const { email } = formData;

		if (editAgent) {
			return validateEmail(email);
		}

		return validateEmail(email);
	};

	// Function to validate current step
	const validateCurrentStep = () => {
		switch (activeStep) {
			case 0:
				return validateStep1();
			case 1:
				return validateStep2();
			case 2:
				return validateStep3();
			case 3:
				return validateStep4();
			default:
				return false;
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const formatPermissions = () => {
		const obj = permissions.reduce((acc, item) => {
			acc[item.name] = 1;
			return acc;
		}, {});
		return JSON.stringify(obj);
	};

	const validateEmail = email => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleAction = () => {
		if (editAgent) {
			updateAgent({ ...formData, permissions: formatPermissions() })
				.then((res) => {
					handleEdited();
					setConfirmation("Agent edited successfully! Any change to permissions or roles will take effect after next login")
				})
				.catch((err) => console.error(err));
		} else {
			createAgent({ ...formData, permissions: formatPermissions() })
				.then((res) => {
					handleCreated();
					setConfirmation("Agent created successfully! An email should have been sent to the agent if an email is configured")
				})
				.catch((err) => setNotification(err.response.data.detail));
		}
	};

	const handleLocationDetect = () => {
		const timezone = jstz.determine();
		setFormData(p => ({ ...p, 'timezone': timezone.name() }))
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editAgent ? 'Edit agent' : 'Add agent'}
			</Typography>

			<Typography variant='subtitle2'>
				{editAgent
					? 'Edit the details for this agent'
					: 'We will gather essential details about the new agent. Complete the following steps to ensure accurate setup and access.'}
			</Typography>

			<Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} sx={{ my: 2 }}>
				{steps.map((label) => (
					<Step key={label}>
						{/* <StepLabel StepIconComponent={QontoStepIcon} /> */}
						<StepLabel
							StepIconComponent={QontoStepIcon}
							sx={{
								'& .MuiStepLabel-label': {
									mt: '8px',
								},
							}}
						>
							{label}
						</StepLabel>
					</Step>
				))}
			</Stepper>

			{activeStep === 0 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
					}}
				>
					<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
						Agent information
					</Typography>

					<CustomFilledInput label='First name' onChange={handleInputChange} value={formData.firstname} name='firstname' mb={2} halfWidth mr={'2%'} />

					<CustomFilledInput label='Last name' onChange={handleInputChange} value={formData.lastname} name='lastname' mb={2} halfWidth />

					<CustomFilledInput label='Phone (optional)' onChange={handleInputChange} value={formData.phone} name='phone' halfWidth />
				</Box>
			)}

			{activeStep === 1 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
						display: 'flex',
						flexDirection: 'column',
						width: '600px'
					}}
				>
					<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
						Settings
					</Typography>

					<FormControlLabel
						control={
							<Checkbox
								onChange={handleInputChange}
								checked={formData.admin === 1}
								name='admin'
								sx={{
									'&.Mui-checked': {
										color: '#22874E',
									},
								}}
							/>
						}
						label={
							<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
								Is administrator?
							</Typography>
						}
					/>

					<Stack direction='row' spacing={2} marginBottom={2} alignItems='center'>

						<CustomSelect
							label="Timezone"
							onChange={handleInputChange}
							value={formData.timezone}
							name="timezone"
							mb={2}
							fullWidth
							options={timezoneOptions}
						/>

						<IconButton
							sx={{
								background: 'transparent',
								color: '#22874E',
								fontWeight: 600,
								border: '1.5px solid #22874E',
								py: 1,
								px: 1,
								'&:hover': {
									background: '#E5EFE9',
								},
							}}
							onClick={handleLocationDetect}>
							<MapPin size={20} />
						</IconButton>
					</Stack>

					<CustomFilledInput
						label='Signature'
						onChange={handleInputChange}
						value={formData.signature}
						name='signature'
						fullWidth
						multiline
						rows={4}
					/>
				</Box>
			)}

			{activeStep === 2 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
					}}
				>
					<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
						Access
					</Typography>

					<DepartmentSelect
						handleInputChange={handleInputChange}
						value={formData.dept_id}
						mb={2}
					/>

					<RoleSelect handleInputChange={handleInputChange} value={formData.role_id} mb={2} />

					<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
						Agent level permissions
					</Typography>

					<TransferList right={permissions} setRight={setPermissions} allItems={allPermissions} formatter={(item) => item.label} />


				</Box>
			)}

			{activeStep === 3 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
						width: '600px'
					}}
				>
					{notification && (
						<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
							{notification}
						</Alert>	
					)}
					<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
						Authentication
					</Typography>

					<CustomFilledInput label='Email' onChange={handleInputChange} value={formData.email} name='email' mb={2} fullWidth />

				</Box>
			)}

			<Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
				{activeStep !== 0 && (
					<CircularButton
						sx={{
							background: 'transparent',
							color: '#22874E',
							fontWeight: 600,
							border: '1.5px solid #22874E',
							py: 2,
							px: 4,
							'&:hover': {
								background: '#FFF',
							},
						}}
						onClick={handleBack}
					>
						Back
					</CircularButton>
				)}

				{activeStep !== steps.length - 1 && (
					<CircularButton sx={{ py: 2, px: 6 }} onClick={handleNext} disabled={isNextDisabled}>
						Next
					</CircularButton>
				)}

				{activeStep === steps.length - 1 && (
					<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={isNextDisabled}>
						{editAgent ? 'Edit' : 'Create'} agent
					</CircularButton>
				)}
			</Stack>
		</>
	);
};

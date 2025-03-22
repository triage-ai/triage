import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useDepartmentBackend } from '../../hooks/useDepartmentBackend';
import { useNotification } from '../../hooks/useNotification';
import { AgentSelect } from '../agent/AgentSelect';
import { SLASelect } from '../sla/SLASelect';

export const AddDepartment = ({ handleCreated, handleEdited, editDepartment, setConfirmation }) => {
	const { createDepartment, updateDepartment } = useDepartmentBackend();

	const sendNotification = useNotification();

	const [manager, setManager] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false);

	const [formData, setFormData] = useState({
		sla_id: '',
		email_id: '',
		manager_id: '',
		name: '',
		signature: '',
	});

	const validateForm = () => {
		return formData.name !== '';
	};

	useEffect(() => {
		if (editDepartment) {
			setFormData(editDepartment);
			setManager(editDepartment.manager);
		}
	}, [editDepartment]);

	const prepareFormData = () => {
		const { sla_id, schedule_id, email_id, manager_id, name, signature } = formData;
		return {
			sla_id: sla_id === '' ? null : sla_id,
			schedule_id: schedule_id === '' ? null : schedule_id,
			email_id: email_id === '' ? null : email_id,
			manager_id: manager_id === '' ? null : manager_id,
			name: name,
			signature: signature === '' ? null : signature,
			...(editDepartment && { dept_id: formData.dept_id }),
		};
	};

	useEffect(() => {
		setIsFormValid(validateForm());
	}, [formData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleManagerChange = (e, newValue) => {
		setManager(newValue);
		setFormData((p) => ({ ...p, manager_id: newValue?.agent_id ?? '' }));
	};

	const handleAction = () => {
		if (editDepartment) {
			updateDepartment(prepareFormData(formData))
				.then((res) => {
					handleEdited();
					setConfirmation('Department successfully edited!')
				})
				.catch((err) => console.error(err));
		} else {
			createDepartment(prepareFormData(formData))
				.then((res) => {
					handleCreated();
					setConfirmation('Department successfully created!')
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editDepartment ? 'Edit department' : 'Add department'}
			</Typography>

			<Typography variant='subtitle2'>
				{editDepartment
					? 'Edit the details for this department'
					: 'We will gather essential details about the new department. Complete the following steps to ensure accurate setup and access.'}
			</Typography>

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
					Department information
				</Typography>

				<CustomFilledInput label='Name' onChange={handleInputChange} value={formData.name} name='name' mb={2} fullWidth />

				<SLASelect handleInputChange={handleInputChange} value={formData.sla_id} mb={2} />

				{/* <ScheduleSelect handleInputChange={handleInputChange} value={formData.schedule_id} mb={2} /> */}

				<AgentSelect name='manager' handleInputChange={handleManagerChange} value={manager ?? ''} mb={2} />

				<CustomFilledInput label='Email' onChange={handleInputChange} value={formData.email_id} name='email_id' mb={2} fullWidth />

				<CustomFilledInput label='Signature' onChange={handleInputChange} value={formData.signature} name='signature' fullWidth multiline rows={3} />
			</Box>

			<Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editDepartment ? 'Edit' : 'Create'} department
				</CircularButton>
			</Stack>
		</>
	);
};

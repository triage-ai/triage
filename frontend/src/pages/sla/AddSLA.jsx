import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { CustomTextField } from '../../components/sidebar-items';
import { useNotification } from '../../hooks/useNotification';
import { useSLABackend } from '../../hooks/useSLABackend';

export const AddSLA = ({ handleCreated, handleEdited, editSLA, setConfirmation }) => {
	const { createSLA, updateSLA } = useSLABackend();

	const sendNotification = useNotification();

	const [isFormValid, setIsFormValid] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		notes: '',
		grace_period: ''
	});

	const validateForm = () => {
		return formData.name !== '' && formData.grace_period !== '';
	};

	useEffect(() => {
		if (editSLA) {
			setFormData(editSLA);
		}
	}, [editSLA]);

	const prepareFormData = () => {
		const { name, notes, grace_period } = formData;
		return {
			name: name === '' ? null : name,
			notes: notes === '' ? null : notes,
			grace_period: grace_period === '' ? null : grace_period,
			...(editSLA && { sla_id: editSLA.sla_id }),
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

	const handleAction = () => {
		if (editSLA) {
			updateSLA(prepareFormData(formData))
				.then((res) => {
					handleEdited();
					setConfirmation('SLA edited successfully!')
				})
				.catch((err) => console.error(err));
		} else {
			createSLA(prepareFormData(formData))
				.then((res) => {
					handleCreated();
					setConfirmation('SLA created successfully!')
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editSLA ? 'Edit SLA' : 'Add SLA'}
			</Typography>

			<Typography variant='subtitle2'>
				{editSLA
					? 'Edit the details for this SLA'
					: 'We will gather essential details about the new SLA. Complete the following steps to ensure accurate setup and access.'}
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
					SLA information
				</Typography>

				<CustomFilledInput label='Name' onChange={handleInputChange} value={formData.name} name='name' mb={2} fullWidth />

				<Stack>
					<Stack direction='row' spacing={2} alignItems='center'>
						<CustomTextField
							type='number'
							name='grace_period'
							value={formData.grace_period}
							onChange={handleInputChange}
							label="Grace Period"
							variant="filled"
							mb={2}
							InputProps={{
								inputProps: { min: 0 }
								}}
							sx={{
								width: '25%',
								'& .MuiInputBase-root': {
									borderWidth: 1.5,
									fontWeight: 500,
								},
							}}
						/>
						<Typography variant='subtitle1'>hours</Typography>
					</Stack>
				</Stack>

				<CustomFilledInput label='Notes' onChange={handleInputChange} value={formData.notes} name='notes' mb={2} mt={2} fullWidth />

			</Box>

			<Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editSLA ? 'Edit' : 'Create'} SLA
				</CircularButton>
			</Stack>
		</>
	);
};

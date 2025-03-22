import { Alert, Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useUserBackend } from '../../hooks/useUserBackend';

export const AddUser = ({ handleCreated, handleEdited, editUser, setConfirmation }) => {
	const { createUser, updateUser } = useUserBackend();

	const [isFormValid, setIsFormValid] = useState(false);
	const [notification, setNotification] = useState('')
	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		email: '',
	});

	const validateForm = () => {
		return formData.firstname !== '' && formData.lastname !== '' && validateEmail(formData.email);
	};

	useEffect(() => {
		const isValid = validateForm();
		setIsFormValid(isValid);
	}, [formData]);

	useEffect(() => {
		if (editUser) {
			setFormData(editUser);
		}
	}, [editUser]);

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleAction = () => {
		if (editUser) {
			updateUser(formData)
				.then((res) => {
					handleEdited();
					setConfirmation('User successfully edited!')
				})
				.catch((err) => console.error(err));
		} else {
			createUser(formData)
				.then((res) => {
					handleCreated();
					setConfirmation('User successfully created!')
				})
				.catch((err) => setNotification(err.response.data.detail));
		}
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editUser ? 'Edit user' : 'Add user'}
			</Typography>

			<Typography variant='subtitle2'>
				{editUser
					? 'Edit the details for this user'
					: 'We will gather essential details about the new user. Complete the following steps to ensure accurate setup and access.'}
			</Typography>

			{notification && (
				<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
					{notification}
				</Alert>	
			)}

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
					User information
				</Typography>

				<CustomFilledInput label='First name' onChange={handleInputChange} value={formData.firstname} name='firstname' mb={2} halfWidth mr={'2%'} />

				<CustomFilledInput label='Last name' onChange={handleInputChange} value={formData.lastname} name='lastname' mb={2} halfWidth mr={'2%'} />

				<CustomFilledInput label='Email' onChange={handleInputChange} value={formData.email} name='email' mb={2} halfWidth />
			</Box>

			<Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editUser ? 'Edit' : 'Create'} user
				</CircularButton>
			</Stack>
		</>
	);
};

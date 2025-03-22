import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';
import { useStatusBackend } from '../../hooks/useStatusBackend';

export const AddStatus = ({ handleClose }) => {
	const { createStatus } = useStatusBackend();
	const { refreshStatuses } = useData();

	const sendNotification = useNotification();

	const [statusData, setStatusData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = statusData;
		const isValid = true;
		setIsFormValid(isValid);
	}, [statusData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setStatusData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addStatus = () => {
		createStatus(statusData)
			.then(res => {
				refreshStatuses();
				handleClose();
				sendNotification({ msg: 'Status created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new Status.
			</Typography>

			<Stack
				// spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={statusData.name}
					name="name"
					mb={2}
					fullWidth
				/>
			</Stack>

			<Stack
				direction={'row'}
				// spacing={1.5}
				sx={{ justifyContent: 'center', mt: 3.5, mb: 2 }}
			>
				<CircularButton
					sx={{
						background: 'transparent',
						color: '#22874E',
						fontWeight: 600,
						border: '1.5px solid #22874E',
						py: 2,
						px: 4,
						'Statuses:hover': {
							background: '#FFF',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={addStatus}
					disabled={!isFormValid}
				>
					Create Status
				</CircularButton>
			</Stack>
		</Box>
	);
};

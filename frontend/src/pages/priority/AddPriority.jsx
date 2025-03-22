import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';
import { usePriorityBackend } from '../../hooks/usePriorityBackend';

export const AddPriority = ({ handleClose }) => {
	const { createPriority } = usePriorityBackend();
	const { refreshPriorities } = useData();

	const sendNotification = useNotification();

	const [priorityData, setPriorityData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = priorityData;
		const isValid = true;
		setIsFormValid(isValid);
	}, [priorityData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setPriorityData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addPriority = () => {
		createPriority(priorityData)
			.then(res => {
				refreshPriorities();
				handleClose();
				sendNotification({ msg: 'Priority created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new Priority.
			</Typography>

			<Stack
				// spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={priorityData.name}
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
						'Priorities:hover': {
							background: '#FFF',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={addPriority}
					disabled={!isFormValid}
				>
					Create Priority
				</CircularButton>
			</Stack>
		</Box>
	);
};

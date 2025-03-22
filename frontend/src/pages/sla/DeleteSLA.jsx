import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { useSLABackend } from '../../hooks/useSLABackend';

export const DeleteSLA = ({ editSLA, handleDelete, handleClose, setConfirmation }) => {
	const { removeSLA } = useSLABackend();

	const deleteSLA = () => {
		removeSLA(editSLA)
			.then(res => {
				handleDelete();
				setConfirmation('SLA was deleted!')
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="h2"
				sx={{ mb: 2, lineHeight: 1.3 }}
			>
				Are you sure you want to delete {editSLA.name}?
			</Typography>

			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 5 }}
			>
				This will remove the SLA from your SLAs table. You can always add another SLA later
				on.
			</Typography>

			<Stack
				spacing={1.5}
				sx={{ alignItems: 'center', pb: 2.5 }}
			>
				<CircularButton
					sx={{
						py: 2,
						px: 6,
						width: 'fit-content',
						background: '#921010',
						'&:hover': {
							background: '#b82828',
						},
					}}
					onClick={deleteSLA}
				>
					Yes, delete
				</CircularButton>

				<CircularButton
					sx={{
						py: 2,
						px: 6,
						width: 'fit-content',
						background: 'transparent',
						color: '#1B1D1F',
						'&:hover': {
							background: 'rgba(0, 0, 0, 0.04)',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>
			</Stack>
		</Box>
	);
};

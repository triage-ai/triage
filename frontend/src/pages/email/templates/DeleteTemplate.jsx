import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../../components/sidebar';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';

export const DeleteTemplate = ({ editTemplate, handleDelete, handleClose }) => {
	const { removeTemplate } = useTemplateBackend();

	const transformString = (inputString) => {
		const words = inputString.split('_');
		return words[0].charAt(0).toUpperCase() +  words[0].slice(1) + ' ' + words.slice(1).join(' ');
	}

	const deleteTemplate = () => {
		removeTemplate(editTemplate)
			.then(res => {
				handleDelete();
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="h2"
				sx={{ mb: 2, lineHeight: 1.3 }}
			>
				Are you sure you want to delete template {transformString(editTemplate.template_name)}?
			</Typography>

			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 5 }}
			>
				This will remove the template from your templates table. You can always add another template later
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
					onClick={deleteTemplate}
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

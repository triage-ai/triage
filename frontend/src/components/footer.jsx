import { Box, Button, Typography } from '@mui/material';
import { CheckCheck } from 'lucide-react';

const drawerWidth = 90;

export const Footer = ({ text, buttonText, handleClick, buttonDisabled }) => {
	return (
		// <Box
		// 	sx={{
		// 		position: 'relative',
		// 		margin: 'auto -24px -32px',
		// 	}}
		// >
		<Box
			sx={{
				backgroundColor: '#FCFCFC',
				height: '80px',
				position: 'absolute',
				paddingX: '24px',
				// top: 24,
				bottom: 0,
				left: 0,
				right: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<CheckCheck color="#575757" />
				<Typography
					variant="caption"
					sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#575757', ml: '14px' }}
				>
					{text}
				</Typography>
			</Box>

			{buttonText !== '' && (
				<Button
					variant="contained"
					disableElevation
					sx={{
						// border: '2px solid #22874E',
						border: 0,
						// boxShadow: '0 0 0 2px #22874E inset',
						background: '#22874E',
						color: '#FFF',
						textTransform: 'unset',
						fontSize: '0.9375rem',
						fontWeight: 700,
						borderRadius: '12px',
						p: '10px 18px',
						transition: 'all 0.3s',
						'&:hover': {
							background: '#29b866',
						},
					}}
					disabled={buttonDisabled}
					onClick={handleClick}
				>
					{buttonText}
				</Button>
			)}
		</Box>
		// </Box>
	);
};

import { Box } from '@mui/material';

export const WhiteContainer = ({ children, noPadding }) => {
	return (
		<Box
			sx={{
				background: '#FFF',
				borderRadius: '12px',
				py: noPadding ? 0 : 1.75,
				px: noPadding ? 0 : 2.25,
				// boxShadow: 'rgba(149, 157, 165, 0.2) 0px 4px 12px',
				minHeight: '60vh',
			}}
		>
			{children}
		</Box>
	);
};

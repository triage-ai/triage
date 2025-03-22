import { TextField, styled } from '@mui/material';

const CustomInput = styled(props => (
	<TextField
		InputProps={{
			disableUnderline: true,
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		borderRadius: 12,
		backgroundColor: 'transparent',
		border: '1.5px solid #E5EFE9',
		transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
		fontSize: '0.9375rem',
		fontWeight: 500,
		'&:hover': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
		'&.Mui-focused': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
		'& input': {
			paddingBottom: '5px',
		},
	},
	'& label.Mui-focused': {
		color: '#545555',
	},
}));

export const CustomFilledInput = ({ label, halfWidth, endAdornment, borderWidth, ...props }) => {
	return (
		<CustomInput
			variant="filled"
			label={label}
			sx={{
				mt: props.mt,
				mb: props.mb,
				mr: props.mr,
				width: halfWidth && '49%',
				'& .MuiFilledInput-root': {
					borderWidth: borderWidth ? borderWidth : 1.5,
				},
			}}
			InputProps={{ disableUnderline: true, endAdornment }}
			{...props}
		/>
	);
};

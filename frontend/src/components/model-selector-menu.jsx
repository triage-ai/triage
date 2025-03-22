import { Box, Chip, Divider, Menu, MenuItem, Typography, styled } from '@mui/material';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

const StyledMenu = styled(props => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 12,
		marginTop: theme.spacing(1),
		paddingTop: 6,
		paddingBottom: 6,
		minWidth: 350,
		[theme.breakpoints.down('sm')]: {
			minWidth: 300,
		},
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			// '&:active': {
			// 	backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			// },
		},
	},
}));

export const ModelSelectorMenu = ({ devModels, anchorEl, open, handleClose, handleClickOpen }) => {
	useEffect(() => {
		if (!sessionStorage.getItem('activeModel') && devModels.length > 0) {
			setActiveModel(devModels[0], 'dev');
		}
	}, [devModels]);

	const setActiveModel = (model, environment) => {
		sessionStorage.setItem('activeModel', model);
		sessionStorage.setItem('activeModelEnv', environment);
		dispatchEvent(new Event('storage'));
		handleClose();
	};

	return (
		<div>
			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{/* To avoid mui focus on first element -- Do not delete */}
				<MenuItem sx={{ display: 'none' }} />

				<MenuItem
					onClick={() => setActiveModel(sessionStorage.getItem('activeModel'), 'dev')}
					disableRipple
					sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							background: 'unset',
						}}
					>
						<Typography
							variant="body1"
							sx={{
								fontSize: '0.9375rem',
								fontWeight: 600,
								color: '#1B1D1F',
								textTransform: 'capitalize',
							}}
						>
							{sessionStorage.getItem('activeModel')}
						</Typography>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#9A9FA5' }}
						>
							Model is in development
						</Typography>
					</Box>

					<Chip
						label={
							<Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
							>
								In development
							</Typography>
						}
						sx={{ background: '#CABDFF', color: '#1B1D1F' }}
					/>
				</MenuItem>

				{devModels.map((model, index) => (
					<MenuItem
						key={model}
						onClick={() => setActiveModel(model, 'dev')}
						disableRipple
						sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								background: 'unset',
							}}
						>
							<Typography
								variant="body1"
								sx={{
									fontSize: '0.9375rem',
									fontWeight: 600,
									color: '#1B1D1F',
									textTransform: 'capitalize',
								}}
							>
								{model}
							</Typography>
							<Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#9A9FA5' }}
							>
								Model is in development
							</Typography>
						</Box>

						<Chip
							label={
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
								>
									In development
								</Typography>
							}
							sx={{ background: '#CABDFF', color: '#1B1D1F' }}
						/>
					</MenuItem>
				))}

				<Divider sx={{ my: 0.5 }} />

				{['gamma'].map((model, index) => (
					<MenuItem
						key={model}
						onClick={() => setActiveModel(model, 'prod')}
						disableRipple
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								background: 'unset',
							}}
						>
							<Typography
								variant="body1"
								sx={{
									fontSize: '0.9375rem',
									fontWeight: 600,
									color: '#1B1D1F',
									textTransform: 'capitalize',
								}}
							>
								{model}
							</Typography>
							<Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#9A9FA5' }}
							>
								Model is in production
							</Typography>
							{/* <Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#9A9FA5' }}
							>
								serialization #{index + 3}
							</Typography> */}
						</Box>

						<Chip
							label={
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
								>
									In production
								</Typography>
							}
							sx={{ background: '#B5E4CA', color: '#1B1D1F' }}
						/>
					</MenuItem>
				))}

				<MenuItem
					onClick={() => {
						handleClickOpen();
						handleClose();
					}}
					disableRipple
					sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Box
							sx={{
								width: '36px',
								height: '36px',
								borderRadius: '8px',
								backgroundColor: '#EFEFEF',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mr: 1.5,
							}}
						>
							<Plus size={22} />
						</Box>
						<Typography
							variant="body1"
							sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
						>
							Create a new model
						</Typography>
					</Box>
				</MenuItem>
			</StyledMenu>
		</div>
	);
};

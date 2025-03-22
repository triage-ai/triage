import {
	Box,
	Button, TextField,
	Typography,
	styled
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Activity, CheckCircle, Split, Tag } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import '../../../App.css';
import logoBlack from '../../../assets/logo-black.svg';
import logo from '../../../assets/logo-white.svg';
import { useUserBackend } from '../../../hooks/useUserBackend';

const ProviderButton = styled(Box)({
	border: '2px solid #EFEFEF',
	padding: '10px',
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '10px',
	cursor: 'pointer',
	transition: 'all 0.2s',
	'&:hover': {
		borderColor: '#1B1D1F',
	},
});

const CustomTextField = styled(TextField)({
	m: 0,
	width: '100%',
	'& fieldset': { border: 'none' },
	'& input::placeholder': {
		fontSize: '0.9375rem',
		fontWeight: 600,
		opacity: 1,
		color: '#575757',
	},
	'& .MuiInputBase-root': {
		background: '#F4F4F4',
		borderRadius: '12px',
		fontWeight: 600,
		color: '#000',
		transition: 'all .3s',

		'&.Mui-focused': {
			background: '#FFF',
			borderRadius: '12px',
			border: '2px solid #EFEFEF',
		},
	},
	'& .MuiInputBase-input': {
		padding: '10.5px 14px',
		paddingLeft: '6px',
	},
});

const RedirectButton = styled('a')({
	cursor: 'pointer',
	color: '#1B1D1F',
	transition: 'color 0.3s',
	'&:hover': {
		color: '#22874E',
	},
});

export const UserResetPasswordConfirmation = () => {

	const { user_id } = useParams()
	const { resendResetPasswordEmail } = useUserBackend()

	const resendEmail = () => {
		resendResetPasswordEmail(user_id)
		.catch(error => {
			console.error(error);
		});
		window.location.reload();
	}

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#FCFCFC',
			}}
		>
			<Grid
				container
				spacing={{ xs: 6, md: 8, lg: 2 }}
			>
				<Grid
					size={{ xs: 0, md: 6 }}
					sx={{
						display: { xs: 'none', md: 'block' },
					}}
				>
					<Box
						sx={{
							width: 'calc(100% - 8px)',
							height: 'calc(100dvh - 16px)',
							padding: '8px',
							paddingRight: 0,
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								background:
									'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
								display: { xs: 'none', md: 'flex' },
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								padding: { md: '34px', lg: '44px' },
								boxSizing: 'border-box',
								flexShrink: 0,
								textAlign: 'center',
								borderRadius: '16px',
							}}
						>
							<Typography
								variant="h1"
								sx={{
									fontSize: '3.75rem',
									background: 'radial-gradient(45% 100% at 50% 50%, #fff 50%, #ffffff80)',
									fontWeight: 600,
									letterSpacing: '-0.02em',
									color: '#FFF',
									textAlign: 'left',
									backgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									WebkitBackgroundClip: 'text',
									lineHeight: 1.1,
									width: { md: '100%', lg: '75%' },
								}}
							>
								Experience the future of customer support with Triage.ai
							</Typography>

							{/* <Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: '22px',
									// textAlign: 'left',
									fontSize: '0.875rem',
									color: '#7A8087',
								}}
							>
								<div>
									<span style={{ display: 'inline-block', fontWeight: '600' }}>
										Build, Fine-Tune, Test, and Deploy your own ticket classification system in a few
										clicks!
									</span>
								</div>

								<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
									<CheckCircle
										color="#8CC279"
										size={22}
										style={{ flexShrink: 0 }}
									/>
									<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
										Auto-labels tickets
									</span>
								</Box>

								<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
									<CheckCircle
										color="#8CC279"
										size={22}
										style={{ flexShrink: 0 }}
									/>
									<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
										Ensures accurate ticket assignment
									</span>
								</Box>

								<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
									<CheckCircle
										color="#8CC279"
										size={22}
										style={{ flexShrink: 0 }}
									/>
									<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
										Pinpoints areas experiencing a surge in ticket volume
									</span>
								</Box>
							</Box> */}

							<Grid
								container
								spacing={2}
								sx={{ marginTop: '1.5rem', display: { xs: 'none', lg: 'flex' } }}
							>
								<Grid
									size={{ xs: 4 }}
									sx={{ textAlign: 'left' }}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Tag
											color="#fff"
											size={16}
											strokeWidth={2.2}
											style={{ opacity: 0.6, marginRight: '0.4rem' }}
										/>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Labels tickets
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Triage AI automatically labels your tickets to streamline your support process
									</Typography>
								</Grid>

								<Grid
									size={{ xs: 4 }}
									sx={{ textAlign: 'left' }}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Split
											color="#fff"
											size={16}
											strokeWidth={2.2}
											style={{ opacity: 0.6, marginRight: '0.4rem' }}
										/>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Assigns tickets
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Ensures that tickets are accurately assigned to the appropriate members
									</Typography>
								</Grid>

								<Grid
									size={{ xs: 4 }}
									sx={{ textAlign: 'left' }}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Activity
											color="#fff"
											size={16}
											strokeWidth={2.2}
											style={{ opacity: 0.6, marginRight: '0.4rem' }}
										/>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Identifies surges
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Pinpoints areas with an increased ticket activity for proactive management
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// backgroundColor: '#FCFCFC',
						}}
					>
						<header className="App-header-wide">
							<Box
								sx={{
									width: '100%',
									padding: { xs: '20px 28px', md: '30px 40px' },
									boxSizing: 'border-box',
									position: 'absolute',
									top: 0,
									left: 0,
									display: 'flex',
									alignItems: { xs: 'center', md: 'flex-start' },
									justifyContent: 'space-between',
								}}
							>
								<Box sx={{ display: { xs: 'none', md: 'block' } }}>
									<img
										src={logo}
										className="App-logo"
										alt="logo"
									/>
								</Box>

								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									<img
										src={logoBlack}
										className="App-logo"
										alt="logo"
									/>
								</Box>

								{/* <Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Already a member? <RedirectButton onClick={goToLogin}>Sign in</RedirectButton>
								</Typography> */}
							</Box>

							{/* <img
								src={AppIcon}
								className="App-logo"
								// style={{ width: '0px' }}
								alt="logo"
							/> */}

							<CheckCircle size={60} color='#34b233' />
							<h5
								style={{
									// fontSize: '0.95rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: '20px',
									marginBottom: 0,
									textAlign: 'center',
								}}
							>
								Check Your Email
							</h5>

							<p
								style={{
									fontSize: '0.8rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: '10px',
									marginBottom: '20px',
									textAlign: 'center',
								}}
							>
								Follow the steps in the confirmation sent to your email
							</p>

							<Button
									sx={{
										backgroundColor: '#22874E',
										color: '#FFF',
										borderRadius: '12px',
										fontSize: '0.9375rem',
										fontWeight: 600,
										lineHeight: 1,
										textTransform: 'unset',
										padding: '16.5px 10px',
										marginTop: '12px',
										marginBottom: '28px',
										transition: 'all 0.3s',
										'&:hover': {
											backgroundColor: '#29b866',
										},
										'&:disabled': {
											color: 'unset',
											opacity: 0.4,
										},
									}}
									onClick={() => resendEmail()}
								>
									Resend Email
								</Button>

						
						</header>
					</div>
				</Grid>
			</Grid>
		</Box>
	);
};

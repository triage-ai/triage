import React, { useContext, useState } from 'react';
import '../../../App.css';
import AppIcon from '../../../assets/app-icon-black.png';
import logoBlack from '../../../assets/logo-black.svg';
import logo from '../../../assets/logo-white.svg';

import { Alert, Box, Button, CircularProgress, InputAdornment, Link, TextField, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Activity, Lock, Mail, Split, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useSetAuthCookie } from '../../../hooks/useSetAuthCookie';

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

export const AgentSignIn = () => {
	const { setAgentData } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState('');
	const [error, setError] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);

	const navigate = useNavigate();
	const { agentSignInEmailAndPassword } = useSetAuthCookie();

	const [notification, setNotification] = useState('')

	const signIn = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (validateEmail(email) && password !== '') {
			agentSignInEmailAndPassword(email, password)
				.then((agentCredential) => {
					const agentData = agentCredential.data;

					const authInfo = {
						isAuth: true,
						agent_id: agentData.agent_id,
						isAdmin: agentData.admin === 1,
						token: agentData.token,
					};
					setAgentData(authInfo);
					setLoading(false);
					navigate('/tickets');
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.error(errorCode, errorMessage);
					setNotification(error.response?.data?.detail);
					setLoading(false);
				});
		} else if (!validateEmail(email)) {
			setError(true);
			setLoading(false);
		} else if (password === '') {
			setPasswordError(true);
			setLoading(false);
		}
	};

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	return (
		// <Box
		// 	sx={{
		// 		display: 'flex',
		// 		flexDirection: 'column',
		// 		alignItems: 'center',
		// 		width: '100%',
		// 	}}
		// >

		// 	<Box
		// 		sx={{
		// 			width: '300px',
		// 			display: 'flex',
		// 			flexDirection: 'column',
		// 			justifyContent: 'center',
		// 			alignItems: 'center',
		// 			pt: '35px'
		// 		}}
		// 	>


		// 		<Box
		// 			component='img'
		// 			src={AppIcon}
		// 			className='App-logo'
		// 			alt='logo'
		// 			pb={3}
		// 		/>

		// 		<Typography variant='h3' mb={3}>
		// 			Sign in to Triage
		// 		</Typography>

		// 		<Box
		// 			sx={{
		// 				border: '1px solid black',
		// 				borderRadius: '8px',
		// 				padding: '16px',
		// 			}}
		// 		>
		// 			<form onSubmit={(e) => signIn(e)}>
		// 				<CustomTextField
		// 					size='small'
		// 					label=''
		// 					id='email'
		// 					autoComplete='username'
		// 					sx={{
		// 						mb: 1,
		// 						'& .MuiInputBase-root': {
		// 							border: error ? '2px solid #ff7474' : '2px solid transparent',
		// 						},
		// 					}}
		// 					placeholder='Your email'
		// 					InputProps={{
		// 						startAdornment: (
		// 							<InputAdornment position='start'>
		// 								<Mail color='#575757' />
		// 							</InputAdornment>
		// 						),
		// 					}}
		// 					value={email}
		// 					onChange={(event) => {
		// 						if (validateEmail(email)) {
		// 							setError(false);
		// 						}
		// 						setEmail(event.target.value);
		// 					}}
		// 				/>

		// 				<CustomTextField
		// 					label=''
		// 					id='password'
		// 					type='password'
		// 					autoComplete='current-password'
		// 					sx={{
		// 						'& .MuiInputBase-root': {
		// 							border: passwordError ? '2px solid #ff7474' : '2px solid transparent',
		// 						},
		// 					}}
		// 					placeholder='Your password'
		// 					InputProps={{
		// 						startAdornment: (
		// 							<InputAdornment position='start'>
		// 								<Lock color='#575757' />
		// 							</InputAdornment>
		// 						),
		// 					}}
		// 					value={password}
		// 					onChange={(event) => {
		// 						// if (validatePassword(password)) {
		// 						// 	setError(false);
		// 						// }
		// 						setPassword(event.target.value);
		// 					}}
		// 				/>

		// 				<Button
		// 					sx={{
		// 						backgroundColor: '#22874E',
		// 						color: '#FFF',
		// 						borderRadius: '12px',
		// 						width: '100%',
		// 						fontSize: '0.9375rem',
		// 						fontWeight: 600,
		// 						lineHeight: 1,
		// 						textTransform: 'unset',
		// 						padding: '16.5px 10px',
		// 						marginTop: '12px',
		// 						marginBottom: '28px',
		// 						transition: 'all 0.3s',
		// 						'&:hover': {
		// 							backgroundColor: '#29b866',
		// 						},
		// 						'&:disabled': {
		// 							color: 'unset',
		// 							opacity: 0.4,
		// 						},
		// 					}}
		// 					type='submit'
		// 					disabled={loading || !validateEmail(email) || password === ''}
		// 				>
		// 					{loading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Sign in'}
		// 				</Button>
		// 			</form>
		// 		</Box>
		// 	</Box>
		// </Box>
		<Box
			sx={{
				width: '100%',
				// display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#FCFCFC',
			}}
		>
			<Grid container spacing={{ xs: 6, md: 8, lg: 2 }}>
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
								background: 'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
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
								variant='h1'
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

							<Grid container spacing={2} sx={{ marginTop: '1.5rem', display: { xs: 'none', lg: 'flex' } }}>
								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Tag color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Labels tickets
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
										Triage AI automatically labels your tickets to streamline your support process
									</Typography>
								</Grid>

								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Split color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Assigns tickets
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
										Ensures that tickets are accurately assigned to the appropriate members
									</Typography>
								</Grid>

								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Activity color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Identifies surges
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
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
						<header className='App-header'>
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
									<img src={logo} className='App-logo' alt='logo' />
								</Box>

								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									<img src={logoBlack} className='App-logo' alt='logo' />
								</Box>

								{/* <Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Already a member? <RedirectButton onClick={goToLogin}>Sign in</RedirectButton>
								</Typography> */}
							</Box>

							<img
								src={AppIcon}
								className='App-logo'
								// style={{ width: '0px' }}
								alt='logo'
							/>

							<h1
								style={{
									fontSize: '2rem',
									fontWeight: 500,
									color: '#1B1D1F',
									letterSpacing: '-0.03em',
									marginTop: '20px',
									marginBottom: '20px',
								}}
							>
								Agent Sign in
							</h1>

							{/* <p
								style={{
									fontSize: '0.875rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: 0,
									marginBottom: '20px',
									textAlign: 'center',
								}}
							>
								Sign in with a provider
							</p>

							<Box sx={{ display: 'flex', width: '100%', gap: '10px', mb: '35px' }}>
								<ProviderButton onClick={loginWithSAML}>
									<img
										src={microsoftIcon}
										alt="Microsoft Icon"
									/>
									<span
										style={{
											fontSize: '0.9375rem',
											fontWeight: 700,
											color: '#1B1D1F',
											marginLeft: '8px',
										}}
									>
										Microsoft
									</span>
								</ProviderButton>

								<ProviderButton>
									<img
										src={googleIcon}
										alt="Google Icon"
									/>
									<span
										style={{
											fontSize: '0.9375rem',
											fontWeight: 700,
											color: '#1B1D1F',
											marginLeft: '8px',
										}}
									>
										Google
									</span>
								</ProviderButton>
							</Box>

							<hr style={{ width: '100%', border: '1px solid #EFEFEF', margin: 0 }} /> */}

							{/* <span
								style={{
									fontSize: '0.875rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: '32px',
									marginBottom: '25px',
								}}
							>
								Or continue with email and password
							</span> */}

							{/* <p
								style={{
									fontSize: '0.875rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: 0,
									marginBottom: '20px',
									textAlign: 'center',
								}}
							>
								Sign in with email and password
							</p> */}




							<form onSubmit={(e) => signIn(e)}>
							{notification &&
								<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
								{notification}
							  </Alert>
							}
								<CustomTextField
									label=''
									id='email'
									autoComplete='username'
									sx={{
										mb: 1,
										'& .MuiInputBase-root': {
											border: error ? '2px solid #ff7474' : '2px solid transparent',
										},
									}}
									placeholder='Your email'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Mail color='#575757' />
											</InputAdornment>
										),
									}}
									value={email}
									onChange={(event) => {
										if (validateEmail(email)) {
											setError(false);
										}
										setEmail(event.target.value);
									}}
								/>

								<CustomTextField
									label=''
									id='password'
									type='password'
									autoComplete='current-password'
									sx={{
										'& .MuiInputBase-root': {
											border: passwordError ? '2px solid #ff7474' : '2px solid transparent',
										},
									}}
									placeholder='Your password'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Lock color='#575757' />
											</InputAdornment>
										),
									}}
									value={password}
									onChange={(event) => {
										// if (validatePassword(password)) {
										// 	setError(false);
										// }
										setPassword(event.target.value);
									}}
								/>

								<Button
									sx={{
										backgroundColor: '#22874E',
										color: '#FFF',
										borderRadius: '12px',
										width: '100%',
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
									type='submit'
									disabled={loading || !validateEmail(email) || password === ''}
								>
									{loading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Sign in'}
								</Button>
							</form>
							<p
								style={{
									fontSize: '0.875rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: 5,
									marginBottom: '20px',
									textAlign: 'center',
								}}
							>
								<Link underline='none' component='button' onClick={() => navigate('/agent/reset_password')}>
									Forgot password?
								</Link>
							</p>

							{/* <Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
							>
								Don't have an account? <RedirectButton onClick={goToAuth}>Sign up</RedirectButton>
							</Typography> */}
						</header>
					</div>
				</Grid>
			</Grid>
		</Box>

	);
};

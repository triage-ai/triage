import React, { useEffect, useState } from 'react';
import '../../App.css';
import LogoHorizontal from '../../assets/logo-horizontal-primary.svg';

import {
	AppBar,
	Box,
	Button,
	Typography
} from '@mui/material';
import { Search, TicketCheck, TicketPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppBarHeight } from '../../components/layout';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import { SearchTextField } from '../agent/Agents';

export const Landing = () => {
	const [logoUrl, setLogoUrl] = useState('')
	const navigate = useNavigate();
	const { getCompanyLogo } = useSettingsBackend();

	useEffect(() => {
		getCompanyLogo()
			.then(res => {
				setLogoUrl(res.data.url)
			})
			.catch(e => console.error(e))
	}, [])

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				// justifyContent: 'center',
				height: '100vh',
				alignContent: 'center',
				backgroundColor: '#FCFCFC',
				overflowY: 'auto'
			}}
		>
			<AppBar color='transparent' sx={{ boxShadow: 'none', px: 4, height: AppBarHeight, justifyContent: 'center' }} position="relative">
				<Box
					display='flex'
					flexDirection='row'
					justifyContent={'space-between'}
					width={'100%'}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
							maxWidth: '250px', // Limit max width for the logo
							height: '60px', // Limit max height for the logo
							overflow: 'hidden', // Hide any overflow from oversized logos
						}}
					>
						<img
							src={logoUrl || LogoHorizontal}
							alt='Triage logo'
							style={{
								width: 'auto',
								height: '80%', // Maintain aspect ratio
								objectFit: 'contain', // Ensure it fits within the box
							}}
						/>
					</Box>
					{/* <Box sx={{ width: '300px', alignContent: 'center' }}>
						<img src={logoUrl || LogoHorizontal} alt='Triage logo' style={{ height: '60px', maxWidth: '175px', objectFit: 'cover' }} />
					</Box> */}
					<Box alignContent={'center'}>
						<Button variant='text'
							disableRipple
							onClick={() => navigate('/user/login')}
							sx={{
								backgroundColor: 'transparent',
								':hover': {
									opacity: '80%',
									transition: 'opacity 0.3s'
								}
							}}>
							<Typography fontWeight={600} textTransform='none'>
								Sign In
							</Typography>
						</Button>
					</Box>
				</Box>
			</AppBar>

			<Box
				sx={{
					background: 'radial-gradient(180% 100% at 20% 10%, #000 5%, #0da54d, #D0FFD6), #010312',
					// background: 'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
					display: 'flex',
					flexDirection: 'column',
					width: 'calc(100% - 45px)',
					height: '300px',
					alignItems: 'center',
					justifyContent: 'center',
					alignContent: 'center',
					borderRadius: '24px',
					zIndex: 2
				}}
			>

				<Typography fontSize={45} fontWeight={600} color='white' mb={2} textAlign={'center'}>
					How can we help?
				</Typography>
				<Box sx={{ width: '60%', maxWidth: '700px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
					{/* <SearchTextField
						type="text"
						label="Search"
						variant="filled"
						placeholder="Search"
						disabled
						sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
					/> */}

					{/* <Box
						sx={{
							py: '10px',
							width: '42px',
							height: '40px',
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Search
							size={20}
							color="#FCFCFC"
						/>
					</Box> */}
				</Box>
			</Box>
			<Box width='calc(100% - 45px)' mt={3}>
				<Box
					width={'250px'}
					height={'500px'}
					borderRadius={'16px'}
					gap={'40px'}
				>
					<Button
						disableRipple
						onClick={() => navigate('/guest/ticket/create')}
						sx={{
							backgroundColor: 'transparent',
							border: '1.5px solid #22874E',
							color: '#22874E',
							borderRadius: '12px',
							width: '100%',
							fontSize: '0.9375rem',
							fontWeight: 600,
							lineHeight: 1,
							textTransform: 'unset',
							padding: '12px 10px',
							transition: 'all 0.3s',
							'&:hover': {
								backgroundColor: '#f1f4f2',
							},
							mb: 3
						}}
					>
						<TicketPlus />&nbsp;Create new ticket
					</Button>
					<Button
						disableRipple
						onClick={() => navigate('guest/ticket_search')}
						sx={{
							backgroundColor: 'transparent',
							border: '1.5px solid #22874E',
							color: '#22874E',
							borderRadius: '12px',
							width: '100%',
							fontSize: '0.9375rem',
							fontWeight: 600,
							lineHeight: 1,
							textTransform: 'unset',
							padding: '12px 10px',
							transition: 'all 0.3s',
							'&:hover': {
								backgroundColor: '#f1f4f2',
							},
						}}
					>
						<TicketCheck />&nbsp;Check ticket status
					</Button>

				</Box>
			</Box>


		</Box>
	);
};
/* <Grid
	container
	spacing={{ xs: 6, md: 8, lg: 2 }}
>
	<AppBar backgroundColor='transparent' color='transparent' sx={{ boxShadow: 'none', m: 2 }} >
		<Box width='100%' textAlign={'right'}>
			<Button variant='text'
				disableRipple
				onClick={() => navigate('/')}
				sx={{
					backgroundColor: 'transparent',
					':hover': {
						opacity: '80%',
						  transition: 'opacity 0.3s'
					}
				}}>
				<Typography fontWeight={600} textTransform='none'>
					Sign In
				</Typography>
			</Button>
		</Box>
	</AppBar>

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
			<Box
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					// backgroundColor: '#FCFCFC',
				}}
			>
				<Box className="App-header" width='100%'>
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
					</Box>

					<Typography fontSize={60} fontWeight={500} color='black' mb={2}>
						How can we help?
					</Typography>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							border: '2px solid #E5EFE9',
							borderRadius: '24px',
							px: '50px',
							py: '36px',
							gap: '16px',
						}}
					>
						<Button
							disableRipple
							sx={{
								backgroundColor: 'transparent',
								border: '1.5px solid #22874E',
								color: '#22874E',
								borderRadius: '12px',
								width: '100%',
								fontSize: '0.9375rem',
								fontWeight: 600,
								lineHeight: 1,
								textTransform: 'unset',
								padding: '12px 10px',
								transition: 'all 0.3s',
								'&:hover': {
									backgroundColor: '#f1f4f2',
								},
							}}
						>
							<TicketPlus/>&nbsp;Create new ticket
						</Button>
						<Button
							disableRipple
							sx={{
								backgroundColor: 'transparent',
								border: '1.5px solid #22874E',
								color: '#22874E',
								borderRadius: '12px',
								width: '100%',
								fontSize: '0.9375rem',
								fontWeight: 600,
								lineHeight: 1,
								textTransform: 'unset',
								padding: '12px 10px',
								transition: 'all 0.3s',
								'&:hover': {
									backgroundColor: '#f1f4f2',
								},
							}}
						>
							<TicketCheck/>&nbsp;Check ticket status
						</Button>
					</Box>

				</Box>
			</Box>
	</Grid>
</Grid> */
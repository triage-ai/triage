import {
	AddCircleOutline,
	CheckCircleOutline,
	QuestionAnswer,
	ReceiptLong,
	SupportAgent
} from "@mui/icons-material";
import {
	AppBar,
	Box,
	Button,
	Card,
	Container,
	Divider,
	Paper,
	TextField,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import LogoHorizontal from '../../assets/logo-horizontal-primary.svg';
import { useSettingsBackend } from "../../hooks/useSettingsBackend";
import { useNavigate } from "react-router-dom";


// Custom styled components
const GradientBox = styled(Box)(({ theme }) => ({
	background: "radial-gradient(180% 100% at 20% 10%, #000 5%, #0da54d, #D0FFD6), #010312",
	padding: theme.spacing(8, 0),
	borderRadius: theme.shape.borderRadius,
	marginBottom: theme.spacing(4),
	position: "relative",
	overflow: "hidden",
	"&::after": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background:
			"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23smallGrid)'/%3E%3C/svg%3E\")",
		opacity: 0.4,
	},
}))

const ActionButton = styled(Button)(({ theme }) => ({
	padding: theme.spacing(1.5, 3),
	borderRadius: 50,
	textTransform: "none",
	fontWeight: 600,
	boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
	transition: "all 0.3s ease",
	"&:hover": {
		transform: "translateY(-2px)",
		boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
	},
}))

const FeatureCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	textAlign: "center",
	transition: "all 0.3s ease",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: theme.shadows[4],
	},
}))

const SearchBox = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(0.5, 2),
	display: "flex",
	alignItems: "center",
	width: "100%",
	maxWidth: 600,
	margin: "0 auto",
	marginBottom: theme.spacing(4),
	borderRadius: 50,
	boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
}))

export const Landing = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
	const [searchQuery, setSearchQuery] = useState("")
	const [logoUrl, setLogoUrl] = useState('')
	const { getCompanyLogo } = useSettingsBackend();
	const navigate = useNavigate()

	useEffect(() => {
		getCompanyLogo()
			.then(res => {
				setLogoUrl(res.data.url)
			})
			.catch(e => console.error(e))
	}, [])

	// const handleSearchChange = (event) => {
	// 	setSearchQuery(event.target.value)
	// }

	const handleCreateTicket = () => {
		navigate('/guest/ticket/create')
	}

	const handleCheckStatus = () => {
		navigate('guest/ticket_search')
	}

	return (
		<Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: "white" }}>
				<Toolbar sx={{ height: 80, minHeight: 80 }}>
					<Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
						<Box
							component="img"
							src={logoUrl || LogoHorizontal}
							alt="Triage.ai Logo"
							sx={{
								height: "70%", // Logo takes up 70% of the header height
								maxHeight: 50,
								width: "auto", // Maintain aspect ratio
								mr: 1.5,
								objectFit: "contain",
							}}
						/>
					</Box>
					<Box sx={{ flexGrow: 1 }} />
					<Button
						variant="outlined"
						color="primary"
						onClick={() => navigate('/user/login')}
						sx={{
							borderRadius: 50,
							borderWidth: '1.5px',
							textTransform: "none",
							px: 3,
							fontWeight: 600,
							"&:hover": {
								backgroundColor: "rgba(76, 175, 80, 0.04)",
							},
						}}
					>
						Sign In
					</Button>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
				{/* Hero Section */}
				<GradientBox>
					<Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
						<Typography
							variant="h2"
							align="center"
							gutterBottom
							sx={{
								color: "white",
								fontWeight: 700,
								mb: 3,
								fontSize: isMobile ? "2.5rem" : "3.5rem",
							}}
						>
							How can we help?
						</Typography>

						{/* <SearchBox>
							<Search sx={{ color: "text.secondary", mr: 1 }} />
							<TextField
								fullWidth
								placeholder="Search for help articles or topics..."
								variant="standard"
								value={searchQuery}
								onChange={handleSearchChange}
								InputProps={{
									disableUnderline: true,
								}}
							/>
							<IconButton color="primary" aria-label="search">
								<Search />
							</IconButton>
						</SearchBox> */}

						<Grid container spacing={2} justifyContent="center">
							<Grid item>
								<ActionButton
									variant="contained"
									color="secondary"
									startIcon={<AddCircleOutline />}
									onClick={handleCreateTicket}
									sx={{
										backgroundColor: "white",
										color: theme.palette.primary.main,
										"&:hover": {
											backgroundColor: "rgba(255,255,255,0.9)",
										},
									}}
								>
									Create new ticket
								</ActionButton>
							</Grid>
							<Grid item>
								<ActionButton
									variant="outlined"
									startIcon={<CheckCircleOutline />}
									onClick={handleCheckStatus}
									sx={{
										borderColor: "white",
										color: "white",
										"&:hover": {
											borderColor: "white",
											backgroundColor: "rgba(255,255,255,0.1)",
										},
									}}
								>
									Check ticket status
								</ActionButton>
							</Grid>
						</Grid>
					</Container>
				</GradientBox>

				{/* Features Section */}
				<Typography
					variant="h4"
					align="center"
					gutterBottom
					sx={{
						mb: 4,
						fontWeight: 600,
						color: theme.palette.text.primary,
					}}
				>
					Get Support in Three Simple Steps
				</Typography>


				<Grid container spacing={4} sx={{ mb: 6, justifyContent: "center", flexWrap: { md: 'nowrap', xs: 'wrap' } }}>
					<Grid item xs={12} md={4} flexGrow={1}>
						<FeatureCard>
							<SupportAgent sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
								Submit a Request
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								Create a new support ticket with details about your issue and we'll get right on it.
							</Typography>
						</FeatureCard>
					</Grid>
					<Grid item xs={12} md={4} flexGrow={1}>
						<FeatureCard>
							<ReceiptLong sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
								Track Your Ticket
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								Check the status of your ticket anytime using your ticket number and email address.
							</Typography>
						</FeatureCard>
					</Grid>
					<Grid item xs={12} md={4} flexGrow={1}>
						<FeatureCard>
							<QuestionAnswer sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
								Get Resolution
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								Our support team will respond promptly and work with you until your issue is resolved.
							</Typography>
						</FeatureCard>
					</Grid>
				</Grid>

				{/* FAQ Section */}
				<Card sx={{ mb: 6, p: 4, borderRadius: 2 }}>
					<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Frequently Asked Questions
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								How quickly will I get a response?
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								We aim to respond to all tickets within 24 hours during business days. Priority issues may be addressed
								sooner.
							</Typography>

							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								Can I update my ticket after submission?
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								Yes, you can add comments or additional information to your ticket at any time using the ticket number.
							</Typography>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
								What information should I include in my ticket?
							</Typography>
							<Typography variant="body2" color="text.secondary" mb={2}>
								Please include detailed information, screenshots, or attachments.
							</Typography>

						</Grid>
					</Grid>
				</Card>
			</Container>

			{/* Footer */}
			<Box sx={{ bgcolor: "background.paper", py: 4, borderTop: 1, borderColor: "divider" }}>
				<Container maxWidth="lg">
					<Grid container spacing={4}>
						<Grid item xs={12} md={4}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box
							component="img"
							src={LogoHorizontal}
							alt="Triage.ai Logo"
							sx={{
								height: "70%", // Logo takes up 70% of the header height
								maxHeight: 30,
								width: "auto", // Maintain aspect ratio
								mr: 1.5,
								objectFit: "contain",
							}}
						/>
							</Box>
							<Typography variant="body2" color="text.secondary">
								Streamlining customer support with intelligent ticket management.
							</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
								Support
							</Typography>
							<Typography variant="body2" component="div">
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									Help Center
								</Box>
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									Community
								</Box>
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									Tutorials
								</Box>
							</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
								Company
							</Typography>
							<Typography variant="body2" component="div">
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									About Us
								</Box>
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									Careers
								</Box>
								<Box
									component="a"
									href="#"
									sx={{
										display: "block",
										mb: 1,
										color: "text.secondary",
										textDecoration: "none",
										"&:hover": { color: "primary.main" },
									}}
								>
									Blog
								</Box>
							</Typography>
						</Grid>
						<Grid item xs={12} md={4}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
								Stay Connected
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Coming Soon
							</Typography>
						</Grid>
					</Grid>
					<Divider sx={{ my: 3 }} />
					<Typography variant="body2" color="text.secondary" align="center">
						© {new Date().getFullYear()} triage.ai. All rights reserved.
					</Typography>
				</Container>
			</Box>
		</Box>
	)
}



// import React, { useEffect, useState } from 'react';
// import '../../App.css';
// import LogoHorizontal from '../../assets/logo-horizontal-primary.svg';

// import {
// 	AppBar,
// 	Box,
// 	Button,
// 	Typography
// } from '@mui/material';
// import { Search, TicketCheck, TicketPlus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { AppBarHeight } from '../../components/layout';
// import { useSettingsBackend } from '../../hooks/useSettingsBackend';
// import { SearchTextField } from '../agent/Agents';

// export const Landing = () => {
// 	const [logoUrl, setLogoUrl] = useState('')
// 	const navigate = useNavigate();
// 	const { getCompanyLogo } = useSettingsBackend();

// 	useEffect(() => {
// 		getCompanyLogo()
// 			.then(res => {
// 				setLogoUrl(res.data.url)
// 			})
// 			.catch(e => console.error(e))
// 	}, [])

// 	return (
// 		<Box
// 			sx={{
// 				width: '100%',
// 				display: 'flex',
// 				flexDirection: 'column',
// 				alignItems: 'center',
// 				// justifyContent: 'center',
// 				height: '100vh',
// 				alignContent: 'center',
// 				backgroundColor: '#FCFCFC',
// 				overflowY: 'auto'
// 			}}
// 		>
// 			<AppBar color='transparent' sx={{ boxShadow: 'none', px: 4, height: AppBarHeight, justifyContent: 'center' }} position="relative">
// 				<Box
// 					display='flex'
// 					flexDirection='row'
// 					justifyContent={'space-between'}
// 					width={'100%'}
// 				>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'flex-start',
// 							maxWidth: '250px', // Limit max width for the logo
// 							height: '60px', // Limit max height for the logo
// 							overflow: 'hidden', // Hide any overflow from oversized logos
// 						}}
// 					>
// 						<img
// 							src={logoUrl || LogoHorizontal}
// 							alt='Triage logo'
// 							style={{
// 								width: 'auto',
// 								height: '80%', // Maintain aspect ratio
// 								objectFit: 'contain', // Ensure it fits within the box
// 							}}
// 						/>
// 					</Box>
// 					{/* <Box sx={{ width: '300px', alignContent: 'center' }}>
// 						<img src={logoUrl || LogoHorizontal} alt='Triage logo' style={{ height: '60px', maxWidth: '175px', objectFit: 'cover' }} />
// 					</Box> */}
// 					<Box alignContent={'center'}>
// 						<Button variant='text'
// 							disableRipple
// 							onClick={() => navigate('/user/login')}
// 							sx={{
// 								backgroundColor: 'transparent',
// 								':hover': {
// 									opacity: '80%',
// 									transition: 'opacity 0.3s'
// 								}
// 							}}>
// 							<Typography fontWeight={600} textTransform='none'>
// 								Sign In
// 							</Typography>
// 						</Button>
// 					</Box>
// 				</Box>
// 			</AppBar>

// 			<Box
// 				sx={{
// 					background: 'radial-gradient(180% 100% at 20% 10%, #000 5%, #0da54d, #D0FFD6), #010312',
// 					// background: 'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
// 					display: 'flex',
// 					flexDirection: 'column',
// 					width: 'calc(100% - 45px)',
// 					height: '300px',
// 					alignItems: 'center',
// 					justifyContent: 'center',
// 					alignContent: 'center',
// 					borderRadius: '24px',
// 					zIndex: 2
// 				}}
// 			>

// 				<Typography fontSize={45} fontWeight={600} color='white' mb={2} textAlign={'center'}>
// 					How can we help?
// 				</Typography>
// 				<Box sx={{ width: '60%', maxWidth: '700px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
// 					{/* <SearchTextField
// 						type="text"
// 						label="Search"
// 						variant="filled"
// 						placeholder="Search"
// 						disabled
// 						sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
// 					/> */}

// 					{/* <Box
// 						sx={{
// 							py: '10px',
// 							width: '42px',
// 							height: '40px',
// 							position: 'absolute',
// 							top: 0,
// 							left: 0,
// 							zIndex: 0,
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'center',
// 						}}
// 					>
// 						<Search
// 							size={20}
// 							color="#FCFCFC"
// 						/>
// 					</Box> */}
// 				</Box>
// 			</Box>
// 			<Box width='calc(100% - 45px)' mt={3}>
// 				<Box
// 					width={'250px'}
// 					height={'500px'}
// 					borderRadius={'16px'}
// 					gap={'40px'}
// 				>
// 					<Button
// 						disableRipple
// 						onClick={() => navigate('/guest/ticket/create')}
// 						sx={{
// 							backgroundColor: 'transparent',
// 							border: '1.5px solid #22874E',
// 							color: '#22874E',
// 							borderRadius: '12px',
// 							width: '100%',
// 							fontSize: '0.9375rem',
// 							fontWeight: 600,
// 							lineHeight: 1,
// 							textTransform: 'unset',
// 							padding: '12px 10px',
// 							transition: 'all 0.3s',
// 							'&:hover': {
// 								backgroundColor: '#f1f4f2',
// 							},
// 							mb: 3
// 						}}
// 					>
// 						<TicketPlus />&nbsp;Create new ticket
// 					</Button>
// 					<Button
// 						disableRipple
// 						onClick={() => navigate('guest/ticket_search')}
// 						sx={{
// 							backgroundColor: 'transparent',
// 							border: '1.5px solid #22874E',
// 							color: '#22874E',
// 							borderRadius: '12px',
// 							width: '100%',
// 							fontSize: '0.9375rem',
// 							fontWeight: 600,
// 							lineHeight: 1,
// 							textTransform: 'unset',
// 							padding: '12px 10px',
// 							transition: 'all 0.3s',
// 							'&:hover': {
// 								backgroundColor: '#f1f4f2',
// 							},
// 						}}
// 					>
// 						<TicketCheck />&nbsp;Check ticket status
// 					</Button>

// 				</Box>
// 			</Box>


// 		</Box>
// 	);
// };
// /* <Grid
// 	container
// 	spacing={{ xs: 6, md: 8, lg: 2 }}
// >
// 	<AppBar backgroundColor='transparent' color='transparent' sx={{ boxShadow: 'none', m: 2 }} >
// 		<Box width='100%' textAlign={'right'}>
// 			<Button variant='text'
// 				disableRipple
// 				onClick={() => navigate('/')}
// 				sx={{
// 					backgroundColor: 'transparent',
// 					':hover': {
// 						opacity: '80%',
// 						  transition: 'opacity 0.3s'
// 					}
// 				}}>
// 				<Typography fontWeight={600} textTransform='none'>
// 					Sign In
// 				</Typography>
// 			</Button>
// 		</Box>
// 	</AppBar>

// 	<Grid
// 		size={{ xs: 0, md: 6 }}
// 		sx={{
// 			display: { xs: 'none', md: 'block' },
// 		}}
// 	>
// 		<Box
// 			sx={{
// 				width: 'calc(100% - 8px)',
// 				height: 'calc(100dvh - 16px)',
// 				padding: '8px',
// 				paddingRight: 0,
// 			}}
// 		>
// 			<Box
// 				sx={{
// 					width: '100%',
// 					height: '100%',
// 					background:
// 						'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
// 					display: { xs: 'none', md: 'flex' },
// 					flexDirection: 'column',
// 					alignItems: 'flex-start',
// 					justifyContent: 'flex-end',
// 					padding: { md: '34px', lg: '44px' },
// 					boxSizing: 'border-box',
// 					flexShrink: 0,
// 					textAlign: 'center',
// 					borderRadius: '16px',
// 				}}
// 			>
// 				<Typography
// 					variant="h1"
// 					sx={{
// 						fontSize: '3.75rem',
// 						background: 'radial-gradient(45% 100% at 50% 50%, #fff 50%, #ffffff80)',
// 						fontWeight: 600,
// 						letterSpacing: '-0.02em',
// 						color: '#FFF',
// 						textAlign: 'left',
// 						backgroundClip: 'text',
// 						WebkitTextFillColor: 'transparent',
// 						WebkitBackgroundClip: 'text',
// 						lineHeight: 1.1,
// 						width: { md: '100%', lg: '75%' },
// 					}}
// 				>
// 					Experience the future of customer support with Triage.ai
// 				</Typography>

// 				<Grid
// 					container
// 					spacing={2}
// 					sx={{ marginTop: '1.5rem', display: { xs: 'none', lg: 'flex' } }}
// 				>
// 					<Grid
// 						size={{ xs: 4 }}
// 						sx={{ textAlign: 'left' }}
// 					>
// 						<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
// 							<Tag
// 								color="#fff"
// 								size={16}
// 								strokeWidth={2.2}
// 								style={{ opacity: 0.6, marginRight: '0.4rem' }}
// 							/>
// 							<Typography
// 								variant="subtitle1"
// 								sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
// 							>
// 								Labels tickets
// 							</Typography>
// 						</Box>

// 						<Typography
// 							variant="body2"
// 							sx={{ color: '#FFF', opacity: 0.6 }}
// 						>
// 							Triage AI automatically labels your tickets to streamline your support process
// 						</Typography>
// 					</Grid>

// 					<Grid
// 						size={{ xs: 4 }}
// 						sx={{ textAlign: 'left' }}
// 					>
// 						<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
// 							<Split
// 								color="#fff"
// 								size={16}
// 								strokeWidth={2.2}
// 								style={{ opacity: 0.6, marginRight: '0.4rem' }}
// 							/>
// 							<Typography
// 								variant="subtitle1"
// 								sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
// 							>
// 								Assigns tickets
// 							</Typography>
// 						</Box>

// 						<Typography
// 							variant="body2"
// 							sx={{ color: '#FFF', opacity: 0.6 }}
// 						>
// 							Ensures that tickets are accurately assigned to the appropriate members
// 						</Typography>
// 					</Grid>

// 					<Grid
// 						size={{ xs: 4 }}
// 						sx={{ textAlign: 'left' }}
// 					>
// 						<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
// 							<Activity
// 								color="#fff"
// 								size={16}
// 								strokeWidth={2.2}
// 								style={{ opacity: 0.6, marginRight: '0.4rem' }}
// 							/>
// 							<Typography
// 								variant="subtitle1"
// 								sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
// 							>
// 								Identifies surges
// 							</Typography>
// 						</Box>

// 						<Typography
// 							variant="body2"
// 							sx={{ color: '#FFF', opacity: 0.6 }}
// 						>
// 							Pinpoints areas with an increased ticket activity for proactive management
// 						</Typography>
// 					</Grid>
// 				</Grid>
// 			</Box>
// 		</Box>
// 	</Grid>

// 	<Grid size={{ xs: 12, md: 6 }}>
// 			<Box
// 				style={{
// 					width: '100%',
// 					display: 'flex',
// 					alignItems: 'center',
// 					justifyContent: 'center',
// 					// backgroundColor: '#FCFCFC',
// 				}}
// 			>
// 				<Box className="App-header" width='100%'>
// 					<Box
// 						sx={{
// 							width: '100%',
// 							padding: { xs: '20px 28px', md: '30px 40px' },
// 							boxSizing: 'border-box',
// 							position: 'absolute',
// 							top: 0,
// 							left: 0,
// 							display: 'flex',
// 							alignItems: { xs: 'center', md: 'flex-start' },
// 							justifyContent: 'space-between',
// 						}}
// 					>
// 						<Box sx={{ display: { xs: 'none', md: 'block' } }}>
// 							<img
// 								src={logo}
// 								className="App-logo"
// 								alt="logo"
// 							/>
// 						</Box>

// 						<Box sx={{ display: { xs: 'block', md: 'none' } }}>
// 							<img
// 								src={logoBlack}
// 								className="App-logo"
// 								alt="logo"
// 							/>
// 						</Box>
// 					</Box>

// 					<Typography fontSize={60} fontWeight={500} color='black' mb={2}>
// 						How can we help?
// 					</Typography>

// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							border: '2px solid #E5EFE9',
// 							borderRadius: '24px',
// 							px: '50px',
// 							py: '36px',
// 							gap: '16px',
// 						}}
// 					>
// 						<Button
// 							disableRipple
// 							sx={{
// 								backgroundColor: 'transparent',
// 								border: '1.5px solid #22874E',
// 								color: '#22874E',
// 								borderRadius: '12px',
// 								width: '100%',
// 								fontSize: '0.9375rem',
// 								fontWeight: 600,
// 								lineHeight: 1,
// 								textTransform: 'unset',
// 								padding: '12px 10px',
// 								transition: 'all 0.3s',
// 								'&:hover': {
// 									backgroundColor: '#f1f4f2',
// 								},
// 							}}
// 						>
// 							<TicketPlus/>&nbsp;Create new ticket
// 						</Button>
// 						<Button
// 							disableRipple
// 							sx={{
// 								backgroundColor: 'transparent',
// 								border: '1.5px solid #22874E',
// 								color: '#22874E',
// 								borderRadius: '12px',
// 								width: '100%',
// 								fontSize: '0.9375rem',
// 								fontWeight: 600,
// 								lineHeight: 1,
// 								textTransform: 'unset',
// 								padding: '12px 10px',
// 								transition: 'all 0.3s',
// 								'&:hover': {
// 									backgroundColor: '#f1f4f2',
// 								},
// 							}}
// 						>
// 							<TicketCheck/>&nbsp;Check ticket status
// 						</Button>
// 					</Box>

// 				</Box>
// 			</Box>
// 	</Grid>
// </Grid> */
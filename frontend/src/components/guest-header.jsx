import { useTheme } from '@emotion/react';
import {
	Box,
	Button,
	Chip,
	CssBaseline,
	IconButton,
	Typography, styled,
	useMediaQuery
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Menu } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DrawerContext } from '../context/DrawerContext';
import formatDate from '../functions/date-formatter';
import { AppBarHeight } from './layout';

const drawerWidth = 250;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer - 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	backgroundColor: '#f1f4f2',
	// backgroundColor: '#F3F8F5',
	boxShadow: 'none',
	color: '#1B1D1F',
	// borderBottom: '1px solid #F4F4F4',
}));

const CircularButton = styled(Button)(() => ({
	backgroundColor: '#22874E',
	color: '#FFF',
	borderRadius: '50px',
	fontSize: '0.9375rem',
	fontWeight: 600,
	lineHeight: 1.1,
	textTransform: 'unset',
	padding: '8px 20px',
	'&:hover': {
		backgroundColor: '#29b866',
	},
	'& svg': {
		marginRight: '6px',
		// marginBottom: 2,
	},
	'&:disabled': {
		color: '#FFF',
		opacity: 0.38,
	},
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
// 	({ theme, open }) => ({
// 		width: drawerWidth,
// 		flexShrink: 0,
// 		whiteSpace: 'nowrap',
// 		boxSizing: 'border-box',
// 		...(!open && {
// 			...closedMixin(theme),
// 			'& .MuiDrawer-paper': closedMixin(theme),
// 		}),
// 	})
// );


export const GuestHeader = ({ ticket, buttonInfo }) => {
    const { guestLogout } = useContext(AuthContext);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const initialTime = 10; // in seconds
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const navigate = useNavigate();
    const { handleDrawerToggle } = useContext(DrawerContext);


	const theme = useTheme();
	const [openDialog, setOpenDialog] = useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleTicketClose = () => {
        guestLogout();
        navigate("/")
    }



	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />

            <Box
				component="nav"
				sx={{
					width: { md: drawerWidth },
					flexShrink: { md: 0 },
				}}
				aria-label="mailbox folders"
			/>

			<AppBar
				position="fixed"
				sx={{
					width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
					ml: `${drawerWidth}px`,
				}}
			>
				<Box
					sx={{
						height: AppBarHeight,
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						py: { xs: 1, md: 3 },
						px: { xs: 2, md: 5 },
					}}
				>
					<Box
						sx={{ display: 'flex', alignItems: 'flex-start'  }}
					>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { md: 'none' } }}
						>
							<Menu />
						</IconButton>

						<Box sx={{ display: 'flex', flexDirection: 'column', color: '#1B1D1F' }}>
							<Typography variant="h2">#{ticket.number} - "{ticket.title}"</Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.9,
                                    color: '#545555',
                                }}
                            >
									Created: {formatDate(ticket.created, 'MM-DD-YY hh:mm A')} · Updated: {formatDate(ticket.updated, 'MM-DD-YY hh:mm A')} · Priority: <Chip label={ticket.priority.priority_desc} sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }} />
                            </Typography>
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>

						<CircularButton
							sx={{ mr: 1 }}
							onClick={handleTicketClose}
						>
							{buttonInfo.icon}
							{buttonInfo.label}
						</CircularButton>

					</Box>
				</Box>
			</AppBar>
		</Box>
	);
};

import { useTheme } from '@emotion/react';
import {
	Box,
	Button, CssBaseline,
	Drawer,
	Slide,
	styled
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import React, { forwardRef, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DrawerContext } from '../context/DrawerContext';
import { SidebarItems } from './sidebar-items';

export const drawerWidth = 250;

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

export const CircularButton = styled(Button)(() => ({
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
		// marginRight: '6px',
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

export const Transition = forwardRef(function Transition(props, ref) {
	return (
		<Slide
			direction="up"
			ref={ref}
			{...props}
		/>
	);
});

export const Sidebar = () => {

	// const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const initialTime = 10; // in seconds
	const { mobileOpen, handleDrawerTransitionEnd, handleDrawerClose } = useContext(DrawerContext);

	const theme = useTheme();

	// const handleDrawerClose = () => {
	// 	setIsClosing(true);
	// 	setMobileOpen(false);
	// };

	// const handleDrawerTransitionEnd = () => {
	// 	setIsClosing(false);
	// };

	return ( <>
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Box
				component="nav"
				sx={{
					width: { md: drawerWidth },
					flexShrink: { md: 0 },
				}}
				aria-label="mailbox folders"
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							alignItems: "center",
							backgroundColor: "#FFF",
							borderRight: "1px solid #F4F4F4",
						},
					}}
				>
					<SidebarItems />
				</Drawer>

				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							alignItems: "center",
							backgroundColor: "#FFF",
							borderRight: "1.5px solid #E5EFE9",
						},
					}}
					open
				>
					<SidebarItems />
				</Drawer>

			</Box>

			{/* <AppBar
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
						sx={{ display: 'flex', alignItems: 'flex-start' }}
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

					</Box>

				</Box>
			</AppBar> */}

		</Box>
		<Outlet/>
		</>
	);
};

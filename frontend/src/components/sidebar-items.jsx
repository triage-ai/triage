import {
	Box,
	Collapse,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListSubheader,
	Stack,
	TextField,
	Typography,
	styled,
} from '@mui/material';
import {
	AlarmClock,
	BriefcaseBusiness,
	Building2,
	ChevronDown,
	ChevronUp,
	CircleUserRound,
	Files,
	Filter,
	Headset,
	KeyRound,
	LogOut,
	Mail,
	MailPlus,
	MailX,
	Mails,
	MessageCircleQuestion,
	MonitorCog,
	PanelLeft,
	Settings,
	SlidersHorizontal,
	SquareUserRound,
	Ticket,
	UserRound,
	Wrench
} from 'lucide-react';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoHorizontal from '../assets/logo-horizontal-primary.svg';
import SubMenuHook from '../assets/submenu-hook.svg';
import { AuthContext } from '../context/AuthContext';

export const CustomTextField = styled((props) => {
	return <TextField {...props} />;
})({
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
		background: 'transparent',
		border: '2px solid #E5EFE9',
		borderRadius: '12px',
		fontWeight: 600,
		color: '#000',
		transition: 'all .3s',

		'&:before, &:after': {
			content: 'none',
			border: 0,
		},

		'&:hover': {
			background: 'transparent',
			borderColor: '#22874E',
			'&:before': {
				content: 'none',
			},
		},

		'&.Mui-focused': {
			borderColor: '#22874E',
		},
		// },
		// '& .MuiInputBase-input': {
		// 	padding: '10.5px 14px',
		// 	paddingLeft: '6px',
	},
});

const StyledListItemBtn = styled(ListItemButton)({
	minHeight: 42,
	alignItems: 'center',
	justifyContent: 'flex-start',
	paddingLeft: 5.5,
	paddingRight: 8,
	borderRadius: '12px',
	'.MuiListItemIcon-root, .MuiTypography-root': {
		color: '#000',
	},
	'&:hover': {
		background: '#f1f4f2',
	},
	'&.Mui-selected': {
		background: '#ECFFEF',
		'&:hover': {
			background: '#ECFFEF',
			// cursor: 'default',
		},
		'.MuiListItemIcon-root, .MuiTypography-root': {
			color: '#1A4A13',
		},
		svg: {
			color: '#1A4A13',
		},
	},
});

const StlyedListItemIcon = styled(ListItemIcon)({
	width: '38px',
	minWidth: '38px',
	height: '38px',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '8px',
	color: '#575757',
	transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
});

const MenuItemTitle = styled(Typography)({
	fontWeight: 600,
	color: '#575757',
	letterSpacing: '-0.05em',
	transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
	mt: '3px',
});

export const getMenuItems = (adminStatus) => [
	{
		title: 'Dashboard',
		icon: (
			<PanelLeft
				size={20}
			// strokeWidth={2}
			/>
		),
	},

	// { subheader: 'PEOPLE' },
	{
		title: 'Tickets',
		icon: (
			<Ticket
				size={20}
			// strokeWidth={2}
			/>
		),
	},
	...(adminStatus
		? [
			{
				title: 'Settings',
				icon: (
					<Settings
						size={20}
					// strokeWidth={2}
					/>
				),
			},
			{
				title: 'Email',
				icon: <Mail size={20} />,
			},
		]
		: []),
	{
		title: 'Manage',
		icon: (
			<BriefcaseBusiness
				size={20}
			// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Profile',
		icon: <CircleUserRound size={20} />,
	},
];

export const getManageSubmenuItems = (permissions, adminStatus) => [
	...(permissions.hasOwnProperty('agent.view')
		? [
			{
				title: 'Agents',
				icon: <Headset size={20} />,
			},
		]
		: []),
	...(permissions.hasOwnProperty('user.view')
		? [
			{
				title: 'Users',
				icon: <UserRound size={20} />,
			},
		]
		: []),
	...(permissions.hasOwnProperty('group.view')
		? [
			// {
			// 	title: 'Groups',
			// 	icon: <Users size={20} />,
			// },
		]
		: []),
	{
		title: 'Queues',
		icon: <Filter size={20} />,
	},
	...(adminStatus
		? [
			{
				title: 'SLAs',
				icon: <AlarmClock size={20} />,
			},
			// {
			// 	title: 'Schedules',
			// 	icon: <Calendar size={20} />,
			// },
			{
				title: 'Departments',
				icon: <SquareUserRound size={20} />,
			},
			// {
			// 	title: 'Priorities',
			// 	icon: <CircleAlert size={20} />,
			// },
			// {
			// 	title: 'Statuses',
			// 	icon: <TicketCheck size={20} />,
			// },
			{
				title: 'Topics',
				icon: <MessageCircleQuestion size={20} />,
			},
			{
				title: 'Forms',
				icon: <Files size={20} />,
			},
			{
				title: 'Roles',
				icon: <KeyRound size={20} />,
			},
		]
		: []),
];

const settingsSubmenuItems = [
	{
		title: 'System',
		icon: <MonitorCog size={20} />,
	},
	{
		title: 'Company',
		icon: <Building2 size={20} />,
	},
	{
		title: 'Tickets',
		icon: <Ticket size={20} />,
	},
	// {
	// 	title: 'Tasks',
	// 	icon: <ClipboardList size={20} />,
	// },
	// {
	// 	title: 'Agents',
	// 	icon: <Headset size={20} />,
	// },
	// {
	// 	title: 'Users',
	// 	icon: <UserRound size={20} />,
	// },
	// {
	// 	title: 'Knowledgebase',
	// 	icon: <Lightbulb size={20} />,
	// },
];

const emailSubmenuItems = [
	{
		title: 'Emails',
		icon: <Mails size={20} />,
	},
	{
		title: 'Settings',
		icon: <SlidersHorizontal size={20} />,
	},
	{
		title: 'Banlist',
		icon: <MailX size={20} />,
	},
	{
		title: 'Templates',
		icon: <MailPlus size={20} />,
	},
	{
		title: 'Diagnostic',
		icon: <Wrench size={20} />,
	},
];

// const urlCheck = new RegExp('')

export const SidebarItems = () => {
	const [path, setPath] = useState('');
	const [drawerTop, setDrawerTop] = useState(0); // State to store top position of the drawer
	const settingsRef = useRef(null); // Ref to the 'Settings' menu item
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [manageOpen, setManageOpen] = useState(false);
	const [emailOpen, setEmailOpen] = useState(false);
	const { agentAuthState, permissions } = useContext(AuthContext);
	const { agentLogout } = useContext(AuthContext);
	const navigate = useNavigate();

	const menuItems = getMenuItems(agentAuthState.isAdmin);
	const manageSubmenuItems = getManageSubmenuItems(permissions, agentAuthState.isAdmin);

	const handleSettingsClick = () => {
		setSettingsOpen((p) => !p);
	};

	const handleManageClick = () => {
		setManageOpen((p) => !p);
	};

	const handleEmailClick = () => {
		setEmailOpen((p) => !p);
	};

	const authLogout = async () => {
		agentLogout();
		navigate('/', { replace: true });
	};

	let location = useLocation();

	useEffect(() => {
		setPath(location.pathname);

		if (location.pathname.split('/')[1] !== 'settings') {
			setSettingsOpen(false);
		} else {
			setSettingsOpen(true);
		}
	}, [location, setPath]);

	useEffect(() => {
		setPath(location.pathname);

		if (location.pathname.split('/')[1] !== 'manage') {
			setManageOpen(false);
		} else {
			setManageOpen(true);
		}
	}, [location, setPath]);

	useEffect(() => {
		setPath(location.pathname);

		if (location.pathname.split('/')[1] !== 'email') {
			setEmailOpen(false);
		} else {
			setEmailOpen(true);
		}
	}, [location, setPath]);

	const activeRoute = (route) => {
		return route === path.replace('/', '');
	};

	return (
		<Drawer variant='permanent' sx={{ zIndex: '1100' }}>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					pt: '26px',
					px: '16px',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Box sx={{ width: '100%', px: 1 }}>
						<img src={LogoHorizontal} alt='Triage logo' style={{ width: '60%', objectFit: 'cover' }} />
					</Box>

					<List sx={{ p: 0, mt: 4 }} dense={true}>
						{menuItems.map((item, index) => (
							<Fragment key={index}>
								{item?.subheader && (
									<ListSubheader sx={{ lineHeight: 'unset', mt: 3, mb: 1 }}>
										<Typography
											variant='overline'
											sx={{
												color: '#585858',
											}}
										>
											{item.subheader}
										</Typography>
									</ListSubheader>
								)}

								{!item?.subheader && (
									<ListItem disablePadding sx={{ display: 'block', mt: index !== 0 ? 0.2 : 0 }}>
										{item.title !== 'Settings' && item.title !== 'Manage' && item.title !== 'Profile' && item.title !== 'Email' && (
											<StyledListItemBtn
												component={Link}
												to={'/' + item.title.toLowerCase()}
												selected={activeRoute(item.title.toLowerCase())}
												disabled={item.title !== 'Dashboard' && item.title !== 'Tickets'}
												disableRipple
											>
												<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

												<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
											</StyledListItemBtn>
										)}

										{manageSubmenuItems.length > 0 && item.title === 'Manage' && (
											<>
												<StyledListItemBtn
													onClick={handleManageClick}
													selected={!manageOpen && path.split('/')[1] === 'manage'}
													disableRipple
													sx={{ justifyContent: 'space-between' }}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'flex-start',
														}}
													>
														<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>
														<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
													</Box>
													{manageOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
												</StyledListItemBtn>

												<Collapse in={manageOpen} timeout='auto' unmountOnExit>
													<List
														sx={{
															p: 0,
															mt: 0.3,
															pl: 4.6,
															':before': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: '24px',
																bottom: '32px',
																width: '2px',
																borderRadius: '2px',
																background: '#EFEFEF',
															},
														}}
														dense={true}
													>
														{manageSubmenuItems.map((item, index) => (
															<ListItem
																key={index}
																disablePadding
																sx={{
																	display: 'block',
																	mt: index !== 0 ? 0.2 : 0,
																	':before': {
																		content: '""',
																		position: 'absolute',
																		top: '12px',
																		left: '-13px',
																		width: '12px',
																		height: '12px',
																		background: `url(${SubMenuHook}) no-repeat 50% 50% / 100% auto`,
																	},
																}}
															>
																<StyledListItemBtn
																	component={Link}
																	to={'/manage/' + item.title.toLowerCase()}
																	selected={
																		path.split('/')[2] === item.title.toLowerCase() && path.split('/')[1] === 'manage'
																	}
																	sx={{ pl: 1 }}
																	disableRipple
																>
																	<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

																	<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
																</StyledListItemBtn>
															</ListItem>
														))}
													</List>
												</Collapse>
											</>
										)}

										{item.title === 'Settings' && (
											<>
												<StyledListItemBtn
													onClick={handleSettingsClick}
													selected={!settingsOpen && path.split('/')[1] === 'settings'}
													disableRipple
													sx={{ justifyContent: 'space-between' }}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'flex-start',
														}}
													>
														<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>
														<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
													</Box>
													{settingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
												</StyledListItemBtn>

												<Collapse in={settingsOpen} timeout='auto' unmountOnExit>
													<List
														sx={{
															p: 0,
															mt: 0.3,
															pl: 4.6,
															':before': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: '24px',
																bottom: '32px',
																width: '2px',
																borderRadius: '2px',
																background: '#EFEFEF',
															},
														}}
														dense={true}
													>
														{settingsSubmenuItems.map((item) => (
															<ListItem
																key={item.title}
																disablePadding
																sx={{
																	display: 'block',
																	mt: index !== 0 ? 0.2 : 0,
																	':before': {
																		content: '""',
																		position: 'absolute',
																		top: '12px',
																		left: '-13px',
																		width: '12px',
																		height: '12px',
																		background: `url(${SubMenuHook}) no-repeat 50% 50% / 100% auto`,
																	},
																}}
															>
																<StyledListItemBtn
																	component={Link}
																	to={'/settings/' + item.title.toLowerCase()}
																	selected={
																		path.split('/')[2] === item.title.toLowerCase() && path.split('/')[1] === 'settings'
																	}
																	sx={{ pl: 1 }}
																	disableRipple
																>
																	<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

																	<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
																</StyledListItemBtn>
															</ListItem>
														))}
													</List>
												</Collapse>
											</>
										)}

										{item.title === 'Email' && (
											<>
												<StyledListItemBtn
													onClick={handleEmailClick}
													selected={!emailOpen && path.split('/')[1] === 'email'}
													disableRipple
													sx={{ justifyContent: 'space-between' }}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'flex-start',
														}}
													>
														<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>
														<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
													</Box>
													{emailOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
												</StyledListItemBtn>

												<Collapse in={emailOpen} timeout='auto' unmountOnExit>
													<List
														sx={{
															p: 0,
															mt: 0.3,
															pl: 4.6,
															':before': {
																content: '""',
																position: 'absolute',
																top: 0,
																left: '24px',
																bottom: '32px',
																width: '2px',
																borderRadius: '2px',
																background: '#EFEFEF',
															},
														}}
														dense={true}
													>
														{emailSubmenuItems.map((item, index) => (
															<ListItem
																key={index}
																disablePadding
																sx={{
																	display: 'block',
																	mt: index !== 0 ? 0.2 : 0,
																	':before': {
																		content: '""',
																		position: 'absolute',
																		top: '12px',
																		left: '-13px',
																		width: '12px',
																		height: '12px',
																		background: `url(${SubMenuHook}) no-repeat 50% 50% / 100% auto`,
																	},
																}}
															>
																<StyledListItemBtn
																	component={Link}
																	to={'/email/' + item.title.toLowerCase()}
																	selected={
																		path.split('/')[2] === item.title.toLowerCase() && path.split('/')[1] === 'email'
																	}
																	sx={{ pl: 1 }}
																	disableRipple
																>
																	<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

																	<MenuItemTitle variant='subtitle2'>{item.title}</MenuItemTitle>
																</StyledListItemBtn>
															</ListItem>
														))}
													</List>
												</Collapse>
											</>
										)}
									</ListItem>
								)}
							</Fragment>
						))}
					</List>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flexGrow: 1, width: '100%' }}>
					<List sx={{ p: 0, mt: 4 }} dense={true}>
						<ListItem disablePadding sx={{ display: 'block', mt: 0.2 }}>
							<Stack direction='row' alignItems='center' sx={{ justifyContent: 'space-between' }}>
								<Box flexGrow='1'>
									<StyledListItemBtn component={Link} to='/profile' selected={activeRoute('profile')} disableRipple>
										<StlyedListItemIcon>{menuItems.find((item) => item.title === 'Profile').icon}</StlyedListItemIcon>
										<MenuItemTitle variant='subtitle2'>Profile</MenuItemTitle>
									</StyledListItemBtn>
								</Box>

								<IconButton aria-label='logout' onClick={authLogout} sx={{ borderRadius: '12px' }}>
									<LogOut color='#000' size={20} />
								</IconButton>
							</Stack>
						</ListItem>
					</List>
				</Box>
			</Box>
		</Drawer>
	);
};

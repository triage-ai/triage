import {
	Box,
	Chip,
	CssBaseline,
	Dialog,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Stack,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { ChevronDown, CircleUserRound, LogOut, Menu, Pencil, Search, TicketPlus, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBarHeight } from '../../components/layout';
import { CircularButton, Transition } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useQueueBackend } from '../../hooks/useQueueBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { SearchTextField } from '../agent/Agents';
import { UserProfile } from '../profile/UserProfile';
import { TicketDetailContainer } from '../ticket/TicketDetailContainer';
import { UserAddTicket } from './UserAddTicket';
import { TableRowsLoader } from '../../components/table-loader';
import formatDate from '../../functions/date-formatter';

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

const DrawerHeader = styled('div')(({ theme }) => ({
	height: `calc(${AppBarHeight} + 5px)`,
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const DrawerContentContainer = styled(Box)(() => ({
	width: '100%',
	minHeight: '100vh',
	background: '#f1f4f2',
}));

export const UserTickets = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();
	// const { getAllPriorities } = usePriorityBackend();
	const { getQueuesForUser } = useQueueBackend();
	const { getTicketsbyAdvancedSearchForUser } = useTicketBackend();

	const [ticketList, setTicketList] = useState([]);
	const [totalTickets, setTotalTickets] = useState(0);

	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [openDetail, setOpenDetail] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});
	const [loading, setLoading] = useState(true)

	const [queues, setQueues] = useState([]);
	const [queueIdx, setQueueIdx] = useState(0);
	const { userLogout } = useContext(AuthContext);

	const drawerWidth = 250;
	const appBarTitle = 'Ticket List';
	const appBarSubtitle = 'View your tickets';

	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const columnFormatter = {
		1: (ticket) => (ticket.number),
		2: (ticket) => (formatDate(ticket.created, 'MM-DD-YY hh:mm A')),
		3: (ticket) => (ticket.title),
		4: (ticket) => (ticket.user ? ticket.user.firstname + ' ' + ticket.user.lastname : ''),
		5: (ticket) => (
			<></>
		),
		6: (ticket) => (ticket.status?.name),
		7: (ticket) => (formatDate(ticket.closed, 'MM-DD-YY hh:mm A')),
		8: (ticket) => (ticket.agent ? ticket.agent.firstname + ' ' + ticket.agent.lastname : ''),
		9: (ticket) => (ticket.due_date ? formatDate(ticket.due_date, 'MM-DD-YY hh:mm A') : formatDate(ticket.est_due_date, 'MM-DD-YY hh:mm A')),
		10: (ticket) => (formatDate(ticket.updated, 'MM-DD-YY hh:mm A')),
		11: (ticket) => (ticket.dept?.name),
		12: (ticket) => { },
		13: (ticket) => { },
		14: (ticket) => (ticket.group?.name),
	}

	useEffect(() => {
		// getPriorityList();
		// refreshQueues();
		getQueueList();
	}, []);

	const getQueueList = () => {
		getQueuesForUser()
			.then(res => {
				res.data.map(entry => {
					entry.config = JSON.parse(entry.config);
				});
				setQueues(res.data);
				setQueueIdx(0);
			})
			.catch(err => {
				console.error(err);
			});
	};

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};
	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	useEffect(() => {
		getTicketList();
	}, [page, size, queues, queueIdx]);

	const handleTicketEdited = () => {
		handleDialogClose();
		getTicketList();
	};

	const handleTicketCreated = () => {
		handleDialogClose();
		getTicketList();
	};

	const getTicketList = () => {
		if (queues.length != 0) {
			setLoading(true)
			getTicketsbyAdvancedSearchForUser({
				...queues[queueIdx].config,
				size: size,
				page: page + 1,
			}).then(res => {
				setTicketList(res.data.items);
				setTotalTickets(res.data.total);
			});
			setLoading(false)
		}
	};

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = e => {
		setSize(e.target.value);
		setPage(0);
	};

	useEffect(() => {
		if (ticketList.length > 0 && ticketId) {
			const ticket = {
				ticket_id: parseInt(ticketId, 10),
			};

			setOpenDetail(true);
			setSelectedTicket(ticket);
		}
	}, [ticketList, ticketId]);

	// useEffect(() => {
	// 	if (priorities.length > 0 && tickets) {
	// 		const mappedTicketsPriority = tickets.map(ticket => ({
	// 			...ticket,
	// 			priority: priorities.find(priority => priority.priority_id === ticket.priority_id),
	// 		}));
	// 		setTicketList(mappedTicketsPriority);
	// 	}
	// }, [tickets]);

	// const getPriorityList = () => {
	// 	getAllPriorities()
	// 		.then(res => {
	// 			setPriorities(res.data);
	// 		})
	// 		.catch(err => {
	// 			console.error(err);
	// 		});
	// };

	const handleDialogOpen = (event, ticket) => {
		event.stopPropagation();

		setSelectedTicket(ticket);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		// getTicketList(size, page + 1)
	};

	const handleQueueChange = e => {
		setPage(0);
		setSize(10);
		setQueueIdx(e.target.value);
	};

	const handleProfileDialogOpen = (event) => {
		event.stopPropagation();


		setOpenProfile(true);
	}

	const handleProfileDialogClose = () => {
		setOpenProfile(false);
	}

	const authLogout = async () => {
		userLogout();
		navigate('/', { replace: true });
	};


	const toggleDetailDrawer =
		(newOpen, ticket = null) =>
			() => {
				if (newOpen) {
					navigate('/user/tickets/' + ticket.ticket_id);
				} else {
					navigate('/user/tickets');
				}
				setOpenDetail(newOpen);
				setSelectedTicket(ticket);
			};


	return (
		<Box sx={{ display: 'flex', background: '#FFF' }}>
			<CssBaseline />
			<AppBar position="fixed">
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
					<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', color: '#1B1D1F' }}>
							<Typography variant="h2">{appBarTitle}</Typography>
							{appBarSubtitle !== '' && (
								<Typography
									variant="subtitle2"
									sx={{
										letterSpacing: '-0.03em',
										lineHeight: 1.9,
										color: '#545555',
									}}
								>
									{appBarSubtitle}
								</Typography>
							)}
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<CircularButton
							sx={{ mr: 1 }}
							onClick={handleDialogOpen}
						>
							{<TicketPlus size={20} />}
							{'Add ticket'}
						</CircularButton>

						<IconButton
							aria-label='profile'
							onClick={event => handleProfileDialogOpen(event)}
						>
							<CircleUserRound
								color="#585858"
								size={22}
							/>
						</IconButton>

						<IconButton
							aria-label="logout"
							onClick={authLogout}
						>
							<LogOut
								color="#585858"
								size={22}
							/>
						</IconButton>
					</Box>
				</Box>
			</AppBar>

			<DrawerContentContainer>
				<DrawerHeader />
				<Box
					sx={{
						height: `calc(100% - ${AppBarHeight})`,
						px: { xs: 2, md: 5 },
						zIndex: '4',
						position: 'relative',
					}}
				>
					<WhiteContainer noPadding>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								py: 1.75,
								px: 2.25,
							}}
						>
							<Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
								<SearchTextField
									type="text"
									label="Search"
									variant="filled"
									placeholder="Search"
									disabled
									sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
								/>
								<Box
									sx={{
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
										color="#575757"
									/>
								</Box>
							</Box>

							<Box
								display={'flex'}
								alignItems={'center'}
								sx={{ px: 2.25 }}
							>
								<Typography
									variant="caption"
									className="text-muted"
									fontWeight={600}
								>
									Queue
								</Typography>
								<FormControl
									sx={{ m: 1, minWidth: 120 }}
									size="small"
								>
									<Select
										displayEmpty
										value={queues.length ? queueIdx : ''}
										onChange={handleQueueChange}
										renderValue={item => (
											<Box
												display={'flex'}
												alignItems={'center'}
											>
												<Box
													width={'6px'}
													height={'6px'}
													borderRadius={'6px'}
													marginRight={1}
													sx={{ backgroundColor: '#D9D9D9' }}
												/>

												<Typography
													variant="subtitle2"
													fontWeight={600}
													sx={{ color: '#1B1D1F' }}
												>
													{item !== '' ? queues[item].title : ''}
												</Typography>
											</Box>
										)}
										sx={{
											'.MuiOutlinedInput-notchedOutline': {
												borderRadius: '8px',
												borderColor: '#E5EFE9',
											},
										}}
										IconComponent={props => (
											<ChevronDown
												{...props}
												size={17}
												color="#1B1D1F"
											/>
										)}
									>
										{queues.map((queue, idx) => (
											<MenuItem
												key={queue.queue_id}
												value={idx}
											>
												<Typography variant="subtitle2">{queue.title}</Typography>
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>



						<TableContainer>
							<Table>
								<TableHead>
									<TableRow
										sx={{
											background: '#F1F4F2',
											'& .MuiTypography-overline': {
												color: '#545555',
											},
										}}
									>
										{
											queues.length !== 0 ? queues[queueIdx].columns.slice(0,3).map((column, idx) => (
												<TableCell key={idx} >
													<Typography key={idx} variant="overline">{column.name}</Typography>
												</TableCell>
											)) :
												<>
													<TableCell />
													<TableCell />
													<TableCell />
													<TableCell />
													<TableCell />
												</>
										}
										<TableCell align="right">
											<Typography variant="overline"></Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{loading ?
										<TableRowsLoader
											rowsNum={10}
											colNum={5}
										/>
										:
										ticketList.map(ticket => (
											<TableRow
												key={ticket.ticket_id}
												onClick={toggleDetailDrawer(true, ticket)}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 },
													'& .MuiTableCell-root': {
														color: '#1B1D1F',
														fontWeight: 500,
														letterSpacing: '-0.02em',
													},
													'&:hover': {
														background: '#f9fbfa',
														cursor: 'pointer',
													},
												}}
											>
												{
													queues.length !== 0 && queues[queueIdx].columns.slice(0,3).map((column, idx) => (
														<TableCell key={idx} >
															{columnFormatter[column.default_column_id](ticket)}
														</TableCell>
													)
													)
												}
												{/* <TableCell
											component="th"
											scope="row"
											sx={{ maxWidth: '200px' }}
										>
											{ticket.title}
											<Typography
												variant="subtitle2"
												sx={{
													fontSize: '0.75rem',
													lineHeight: 1.2,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													display: '-webkit-box',
													WebkitBoxOrient: 'vertical',
													WebkitLineClamp: 2,
												}}
											>
												{ticket.description}
											</Typography>
										</TableCell>
										<TableCell>{ticket.number}</TableCell>
										<TableCell>{formatDate(ticket.updated, 'MM-DD-YY hh:mm A')}</TableCell>
										<TableCell>
											<Chip
												label={ticket.priority.priority_desc}
												sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
											/>
										</TableCell>
										<TableCell>{ticket.user.firstname + ' ' + ticket.user.lastname}</TableCell> */}
												{/* <TableCell>{ticket.user.firstname + ' ' + ticket.user.lastname}</TableCell> */}
												<TableCell
													component="th"
													scope="row"
													align="right"
												>
													<Stack
														direction="row"
														// spacing={0.5}
														sx={{ justifyContent: 'flex-end' }}
													>
														<IconButton onClick={event => handleDialogOpen(event, ticket)}>
															<Pencil size={18} />
														</IconButton>
													</Stack>
												</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
							<TablePagination
								component="div"
								count={totalTickets}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={size}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableContainer>
					</WhiteContainer>

					<Dialog
						open={openDialog}
						TransitionComponent={Transition}
						onClose={handleDialogClose}
						PaperProps={{
							sx: {
								width: '100%',
								maxWidth: 'unset',
								height: 'calc(100% - 64px)',
								maxHeight: 'unset',
								margin: 0,
								background: '#f1f4f2',
								borderBottomLeftRadius: 0,
								borderBottomRightRadius: 0,
								padding: 2,
							},
						}}
						sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
					>
						<Box sx={{ maxWidth: '650px', margin: '14px auto 0px', textAlign: 'center' }}>
							<IconButton
								aria-label="close dialog"
								onClick={handleDialogClose}
								sx={{
									width: '40px',
									height: '40px',
									position: 'fixed',
									right: '26px',
									top: 'calc(64px + 26px)',
									color: '#545555',
									transition: 'all 0.2s',
									'&:hover': {
										color: '#000',
									},
								}}
							>
								<X size={20} />
							</IconButton>

							<UserAddTicket
								handleTicketCreated={handleTicketCreated}
								handleTicketEdited={handleTicketEdited}
								editTicket={selectedTicket}
							/>
						</Box>
					</Dialog>

					<Drawer
						open={openDetail}
						anchor={'right'}
						onClose={toggleDetailDrawer(false)}
						PaperProps={{
							sx: {
								minWidth: 700,
								maxWidth: 735,
								margin: '12px',
								height: 'calc(100vh - 24px)',
								borderRadius: '24px',
								background: '#F1F4F2',
							},
						}}
					>
						<TicketDetailContainer
							ticketInfo={selectedTicket}
							openEdit={handleDialogOpen}
							closeDrawer={toggleDetailDrawer(false)}
							type='user'
						/>
					</Drawer>
				</Box>
			</DrawerContentContainer>

			<Dialog
				open={openProfile}
				onClose={handleProfileDialogClose}
				PaperProps={{
					sx: {
						maxWidth: '500px',
						background: '#f1f4f2',
						py: 2,
						px: 3,
						m: 2,
						borderRadius: '10px',
					},
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Box
						sx={{
							width: '100%',
							textAlign: 'right',
							// pb: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ width: '40px', height: '40px' }} />

						<IconButton
							aria-label="close dialog"
							onClick={handleProfileDialogClose}
							sx={{
								width: '40px',
								height: '40px',
								color: '#545555',
								transition: 'all 0.2s',
								'&:hover': {
									color: '#000',
								},
							}}
						>
							<X size={20} />
						</IconButton>
					</Box>

					<UserProfile />
				</Box>

			</Dialog>
		</Box>
	);
};

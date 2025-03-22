import {
	Alert,
	Badge,
	Box,
	Chip,
	Dialog,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography
} from '@mui/material';
import { Filter, Pencil, RotateCw, Search, TicketPlus, X } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledInput } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { Transition } from '../../components/sidebar';
import { TableRowsLoader } from '../../components/table-loader';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import formatDate from '../../functions/date-formatter';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { SearchTextField } from '../agent/Agents';
import { AddTicket } from './AddTicket';
import { AdvancedSearch } from './AdvancedSearch';
import { CustomChevron } from './TicketDetail';
import { TicketDetailContainer } from './TicketDetailContainer';

// TimeAgo.addDefaultLocale(en)

export const Tickets = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();
	const { permissions } = useContext(AuthContext);
	const { getTicketByQueue, getTicketsbyAdvancedSearch } = useTicketBackend();


	// const timeAgo = new TimeAgo('en-US')
	const { queues, refreshQueues } =
		useData();
	const [openDialog, setOpenDialog] = useState(false);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});
	const [loading, setLoading] = useState(true)
	const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false)
	const [searchColumns, setSearchColumns] = useState([]);
	const [queueColumns, setQueueColumns] = useState([]);
	const [searchFilters, setSearchFilters] = useState([])
	const [searchSorts, setSearchSorts] = useState([])
	const [advancedSearchMode, setAdvancedSearchMode] = useState(false)
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [tickets, setTickets] = useState([]);
	const [totalTickets, setTotalTickets] = useState(0);
	const [selectedQueueId, setSelectedQueueId] = useState(null);
	const [searchActive, setSearchActive] = useState(false);
	const [confirmation, setConfirmation] = useState('')

	const [search, setSearch] = useState('')

	const selectedQueue = useMemo(() => {
		if (queues.length !== 0 && selectedQueueId) {
			return queues.find((q) => q.queue_id === selectedQueueId)
		}
		else return null
	}, [selectedQueueId, queues])


	const columnFormatter = {
		1: (ticket) => (ticket.number),
		2: (ticket) => (formatDate(ticket.created, 'MM-DD-YY hh:mm A')),
		3: (ticket) => (ticket.title),
		4: (ticket) => (ticket.user ? ticket.user.firstname + ' ' + ticket.user.lastname : ''),
		5: (ticket) => CustomPriorityChip(ticket),
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
		if (selectedQueue) {
			selectedQueue.columns.sort((a,b) => a.sort - b.sort)
			setSearchColumns(selectedQueue.columns)
			setQueueColumns(selectedQueue.columns)
			setSearch('')
			setSearchFilters(selectedQueue.config.filters)
			setSearchSorts(selectedQueue.config.sorts)
		}
	}, [selectedQueue])

	useEffect(() => {
		refreshQueues();
		refreshTicketQueue(null, 0, null, '');
	}, []);

	const refreshCurrentTicketList = (page = 0, size = null, search = '') => {
		if (advancedSearchMode) {
			refreshTicketSearch({ filters: searchFilters, sorts: searchSorts }, page, size, search)
		}
		else {
			refreshTicketQueue(selectedQueueId, page, size, search)
		}
	}


	const handleTicketEdited = () => {
		handleDialogClose();
		refreshCurrentTicketList()
	};

	const handleTicketCreated = () => {
		handleDialogClose();
		refreshCurrentTicketList()
	};


	const refreshTicketQueue = async (queue_id, new_page, new_size, new_search) => {
		setLoading(true)
		await getTicketByQueue(queue_id, new_search, new_page + 1, new_size).then(ticketList => {
			const { items, total, queue_id } = ticketList.data;
			setTotalTickets(total)
			setTickets(items);
			if (selectedQueueId !== queue_id) {
				setSelectedQueueId(queue_id)
			}
			if (page !== ticketList.data.page - 1) {
				setPage(ticketList.data.page - 1)
			}
			if (size !== ticketList.data.size) {
				setSize(ticketList.data.size)
			}
			if (search !== new_search) {
				setSearch(new_search)
				if (!new_search) {
					setSearchActive(false)
				}
			}

		}).catch((e) => console.error(e));
		setLoading(false);
	};

	const refreshTicketSearch = async (config, new_page, new_size, new_search) => {
		setLoading(true)
		await getTicketsbyAdvancedSearch(config, new_search, new_page + 1, new_size).then(ticketList => {
			const { items, total } = ticketList.data;
			setTotalTickets(total)
			setTickets(items);
			if (page !== ticketList.data.page - 1) {
				setPage(ticketList.data.page - 1)
			}
			if (size !== ticketList.data.size) {
				setSize(ticketList.data.size)
			}
			if (search !== new_search) {
				setSearch(new_search)
				if (!new_search) {
					setSearchActive(false)
				}
			}
		}).catch((e) => console.error(e));
		setLoading(false);
	};


	const handleSubmitSearch = () => {
		setOpenAdvancedSearch(false)
		setAdvancedSearchMode(true)
		setSelectedQueueId(null)
		setQueueColumns([...searchColumns])
		refreshTicketSearch({ filters: searchFilters, sorts: searchSorts }, 0, null, '')
	}

	const handleChangePage = (e, newValue) => {
		refreshCurrentTicketList(newValue, size, search)
	};

	const handleChangeSize = e => {
		refreshCurrentTicketList(0, e.target.value, search)
	};

	useEffect(() => {
		if (tickets.length > 0 && ticketId) {
			const ticket = {
				ticket_id: parseInt(ticketId, 10),
			};

			setOpenDetail(true);
			setSelectedTicket(ticket);
		}
	}, [tickets, ticketId]);

	const handleDialogOpen = (event, ticket) => {
		event.stopPropagation();

		setSelectedTicket(ticket);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		refreshCurrentTicketList()
	};

	const handleAdvancedSearchOpen = () => {
		setOpenAdvancedSearch(true)
	}

	const handleAdvancedSearchClose = () => {
		setOpenAdvancedSearch(false)
		setSearchFilters(p => p.filter((filter) => filter[0] && filter[1] && (filter[2] !== '' && filter[2]?.length !== 0)))
		setSearchSorts(p => p.filter((sort) => sort))
		setSearchColumns(p => p.filter((column) => column.default_column_id !== 0 && column.name !== ''))
	}

	const handleQueueChange = e => {
		setAdvancedSearchMode(false)
		refreshTicketQueue(e.target.value.queue_id, 0, null, '')
	};

	const handleSearchBarChange = (e) => {
		setSearch(e.target.value)
	};

	const handleSearchBar = (e) => {
		if (e.key === 'Enter') {
			setSearchActive(true)
			refreshCurrentTicketList(0, null, search)
		}
	};

	const handleSearchClear = () => {
		refreshCurrentTicketList()
	}

	const toggleDetailDrawer =
		(newOpen, ticket = null) =>
			() => {
				if (newOpen) {
					navigate('/tickets/id/' + ticket.ticket_id);
				} else {
					navigate('/tickets');
				}
				setOpenDetail(newOpen);
				setSelectedTicket(ticket);
			};

	return (
		<Layout
			title={'Ticket List'}
			subtitle={'View your tickets and add new ones'}
			buttonInfo={{
				label: 'Add ticket',
				icon: <TicketPlus size={20} />,
				hidden: permissions.hasOwnProperty('ticket.create')
			}}
			AddResource={AddTicket}
			refreshResource={refreshCurrentTicketList}
			setConfirmation={setConfirmation}
		>
			{confirmation && (
				<Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
					{confirmation}
				</Alert>	
			)}
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
					<Box sx={{ position: 'relative', width: '20%' }}>
						<SearchTextField
							type="text"
							label="Search"
							variant="filled"
							placeholder="Search"
							value={search}
							sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
							onChange={handleSearchBarChange}
							onKeyDown={handleSearchBar}
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
								color={searchActive ? '#29b866' : '#575757'}
							/>
						</Box>
						{search && <Box
							sx={{
								width: '42px',
								height: '40px',
								position: 'absolute',
								top: 0,
								right: 0,
								zIndex: 5,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<IconButton onClick={handleSearchClear}>
								<X
									size={20}
									color='#575757'
								/>
							</IconButton>
						</Box>}
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
							sx={{
								m: 1,
								minWidth: 120,
								'& .MuiSelect-select': {
									alignContent: 'center'
								}
							}}
							size="small"
						>
							<Select
								displayEmpty
								value={advancedSearchMode ? '' : selectedQueue ?? ''}
								onChange={handleQueueChange}
								input={<StyledInput />}
								renderValue={item => (
									<Box
										display={'flex'}
										alignItems={'center'}
										height={'100%'}
										sx={{

										}}
									>
										<Box
											width={'6px'}
											height={'6px'}
											borderRadius={'6px'}
											marginRight={1}
											sx={{ backgroundColor: advancedSearchMode ? '#D9D9D9' : '#29b866' }}
										/>

										<Typography
											variant="subtitle2"
											fontWeight={600}
											sx={{ color: '#1B1D1F' }}
										>
											{item?.title ?? ''}
										</Typography>
									</Box>
								)}
								IconComponent={CustomChevron}
							>
								{queues.map((queue) => (
									<MenuItem
										key={queue.queue_id}
										value={queue}
									>
										<Typography variant="subtitle2">{queue.title}</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Badge badgeContent={advancedSearchMode ? searchFilters.length : 0} color="primary">
							<IconButton sx={{ borderRadius: '8px', border: '1.5px solid #E5EFE9' }} onClick={handleAdvancedSearchOpen} >
								<Filter color={advancedSearchMode ? '#29b866' : 'currentColor'} size={20} />
							</IconButton>
						</Badge>
						<IconButton sx={{ borderRadius: '8px', border: '1.5px solid #E5EFE9', ml: 1 }} onClick={() => refreshCurrentTicketList()} >
							<RotateCw size={20} />
						</IconButton>
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
									queues.length !== 0 ? queueColumns.map((column) => (
										<TableCell key={column.name} >
											<Typography variant="overline">{column.name}</Typography>
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
									colNum={6}
								/>
								:
								tickets.map(ticket => (
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
											queues.length !== 0 && (queueColumns).map((column) => (
												<TableCell key={column.default_column_id} >
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
												{permissions.hasOwnProperty('ticket.edit') && <IconButton onClick={event => handleDialogOpen(event, ticket)}>
													<Pencil size={18} />
												</IconButton>}
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
						onRowsPerPageChange={handleChangeSize}
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

					<AddTicket
						handleCreated={handleTicketCreated}
						handleEdited={handleTicketEdited}
						editTicket={selectedTicket}
						setConfirmation={setConfirmation}
					/>
				</Box>
			</Dialog>

			<Dialog
				open={openAdvancedSearch}
				onClose={() => { }}
				PaperProps={{
					sx: {
						minWidth: '700px',
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
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ width: '40px', height: '40px' }} />

						<Typography
							variant="h2"
							sx={{ lineHeight: 1.3, textAlign: 'center' }}
						>
							Advanced Search
						</Typography>

						<IconButton
							aria-label="close dialog"
							onClick={handleAdvancedSearchClose}
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
					<AdvancedSearch
						rows={searchColumns}
						setRows={setSearchColumns}
						filters={searchFilters}
						setFilters={setSearchFilters}
						sorts={searchSorts}
						setSorts={setSearchSorts}
						submitSearch={handleSubmitSearch}
					/>
				</Box>
			</Dialog>

			<Drawer
				open={openDetail}
				anchor={'right'}
				onClose={toggleDetailDrawer(false)}
				PaperProps={{
					sx: {
						// minWidth: 700,
						// maxWidth: 735,
						width: 700,
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
					type='agent'
				/>
			</Drawer>
		</Layout>
	);
};

const CustomPriorityChip = (ticket) => (
	<Chip
		label={ticket.priority.priority_desc}
		sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
	/>
)

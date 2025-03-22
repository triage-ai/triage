import {
	Alert,
	Box,
	Dialog,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	styled,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { ChevronDown, Mail, Pencil, Search, Trash2, UserRoundPlus, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StyledInput } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { Transition } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useAgentBackend } from '../../hooks/useAgentBackend';
import { useDepartmentBackend } from '../../hooks/useDepartmentBackend';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import { AddAgent } from './AddAgent';
import { DeleteAgent } from './DeleteAgent';

export const SearchTextField = styled('input')({
	width: '100%',
	height: '42px',
	border: '1.5px solid #E5EFE9',
	borderRadius: '12px',
	padding: '10px',
	paddingLeft: '36px',
	paddingRight: '36px',
	fontWeight: 500,
	fontSize: '0.9375rem',
	color: '#000',
	position: 'relative',
	zIndex: 1,
	background: 'transparent',
	'&:hover': {
		background: 'transparent',
		borderColor: '#22874E',
	},
	'&::placeholder': {
		fontWeight: 500,
		color: '#575757',
	},
	'&:focus': {
		outline: 'none',
		// borderColor: '#22874E',
	},
});

export const Agents = () => {
	const { getAllDepartments } = useDepartmentBackend();
	const { getAllGroups } = useGroupBackend();
	const { getAllAgentsByDeptAndGroup, resendConfirmationEmail } = useAgentBackend();
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalAgents, setTotalAgents] = useState(0);
	const [agents, setAgents] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [groups, setGroups] = useState([]);
	const [dept, setDept] = useState(-1);
	const [group, setGroup] = useState(-1);
	const [selectedAgent, setSelectedAgent] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [buttonClicked, setButtonClicked] = useState('');
	const [confirmation, setConfirmation] = useState('');
	const { agentAuthState } = useContext(AuthContext);

	useEffect(() => {
		refreshAgents();

		getAllDepartments()
			.then((res) => {
				setDepartments(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
		// getAllGroups()
		// 	.then((res) => {
		// 		setGroups(res.data);
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
	}, []);

	useEffect(() => {
		refreshAgents();
	}, [dept, group, page, size]);

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value);
	};

	const refreshAgents = () => {
		getAllAgentsByDeptAndGroup(departments[dept]?.dept_id ?? null, groups[group]?.group_id ?? null, page + 1, size)
			.then((res) => {
				setAgents(res.data.items);
				setTotalAgents(res.data.total);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handleDialogOpen = (agent, button) => {
		setSelectedAgent(agent);
		setButtonClicked(button);

		if (button === 'edit') {
			setOpenDialog(true);
		} else if (button === 'delete') {
			setOpenDeleteDialog(true);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleAgentEdited = () => {
		handleDialogClose();
		refreshAgents();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshAgents();
	};

	const handleDeptChange = (e) => {
		setDept(e.target.value);
	};

	const handleGroupChange = (e) => {
		setGroup(e.target.value);
	};

	const resendEmail = (agent_id) => {
		//Do some notification stuff here
		resendConfirmationEmail(agent_id)
		.then(() => {
			setConfirmation('Confirmation email was resent if an email was configured')
		})
		.catch(error => {
			console.error(error);
		});
		// window.location.reload();
	}

	return (
		<Layout
			title={'Agent List'}
			subtitle={'View your agents and add new ones'}
			buttonInfo={{
				label: 'Add agent',
				icon: <UserRoundPlus size={20} />,
				hidden: agentAuthState.isAdmin,
			}}
			AddResource={AddAgent}
			refreshResource={refreshAgents}
			setConfirmation={setConfirmation}
		>
			{confirmation && (
				<Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
					{confirmation}
				</Alert>	
			)}
			<WhiteContainer noPadding>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
					<Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
						<SearchTextField
							type='text'
							label='Search'
							variant='filled'
							placeholder='Search'
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
							<Search size={20} color='#575757' />
						</Box>
					</Box>

					<FormControl sx={{ minWidth: 200 }}>
						<Select
							displayEmpty
							size='small'
							value={dept}
							input={<StyledInput/>}
							onChange={handleDeptChange}
							renderValue={(item) => (
								<Box display={'flex'} alignItems={'center'}>
									<Typography variant='subtitle2' fontWeight={600} sx={{ color: '#1B1D1F' }}>
										{item === -1 ? 'All Departments' : departments[item].name}
									</Typography>
								</Box>
							)}
							IconComponent={(props) => <ChevronDown {...props} size={17} color='#1B1D1F' />}
							sx={{
								'.MuiOutlinedInput-notchedOutline': {
									borderRadius: '8px',
									borderColor: '#E5EFE9',
								},
								ml: 2
							}}
						>
							<MenuItem key={-1} value={-1}>
								<Typography variant='subtitle2'>All Departments</Typography>
							</MenuItem>
							{departments.map((x, y) => (
								<MenuItem key={y} value={y}>
									<Typography variant='subtitle2'>{x.name}</Typography>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl sx={{ minWidth: 200 }}>
						<Select
							displayEmpty
							size='small'
							value={group}
							onChange={handleGroupChange}
							input={<StyledInput/>}
							renderValue={(item) => (
								<Box display={'flex'} alignItems={'center'}>
									<Typography variant='subtitle2' fontWeight={600} sx={{ color: '#1B1D1F' }}>
										{item === -1 ? 'All Groups' : groups[item].name}
									</Typography>
								</Box>
							)}
							IconComponent={(props) => <ChevronDown {...props} size={17} color='#1B1D1F' />}
							sx={{
								'.MuiOutlinedInput-notchedOutline': {
									borderRadius: '8px',
									borderColor: '#E5EFE9',
								},
								ml: 2
							}}
						>
							<MenuItem key={-1} value={-1}>
								<Typography variant='subtitle2'>All Groups</Typography>
							</MenuItem>
							{groups.map((x, y) => (
								<MenuItem key={y} value={y}>
									<Typography variant='subtitle2'>{x.name}</Typography>
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

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
							<TableCell>
								<Typography variant='overline'>Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Username</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Department</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Email</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Phone</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Status</Typography>
							</TableCell>
							<TableCell align='right'>
								<Typography variant='overline'></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{agents.map((agent) => (
							<TableRow
								key={agent.agent_id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
									'& .MuiTableCell-root': {
										color: '#1B1D1F',
										fontWeight: 500,
										letterSpacing: '-0.02em',
									},
								}}
							>
								<TableCell component='th' scope='row'>
									{agent.firstname + ' ' + agent.lastname}
								</TableCell>
								<TableCell>{agent.username}</TableCell>
								<TableCell>{agent.department.name}</TableCell>
								<TableCell>{agent.email}</TableCell>
								<TableCell>{agent.phone}</TableCell>
								<TableCell>{agent.status === 0 ? 'Complete' : 'Pending'}</TableCell>
								<TableCell component='th' scope='row' align='right'>
									<Stack direction='row' spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
										{agent.status === 0 ? (
											agentAuthState.isAdmin && (
												<IconButton
													sx={{
														'&:hover': {
															background: '#f3f6fa',
															color: '#105293',
														},
													}}
													onClick={() => handleDialogOpen(agent, 'edit')}
												>
													<Pencil size={18} />
												</IconButton>
											)
										) : (
											<IconButton
												sx={{
													'&:hover': {
														background: '#f3f6fa',
														color: '#105293',
													},
												}}
												onClick={() => resendEmail(agent.agent_id)}
											>
												<Mail size={18} />
											</IconButton>
										)}

										{agentAuthState.isAdmin && (
											<IconButton
												sx={{
													'&:hover': {
														background: '#faf3f3',
														color: '#921010',
													},
												}}
												onClick={() => handleDialogOpen(agent, 'delete')}
											>
												<Trash2 size={18} />
											</IconButton>
										)}
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Box>
					<TablePagination
						component='div'
						count={totalAgents}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={size}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box>
			</WhiteContainer>

			{buttonClicked === 'edit' && (
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
							aria-label='close dialog'
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

						<AddAgent handleEdited={handleAgentEdited} editAgent={selectedAgent} setConfirmation={setConfirmation} />
					</Box>
				</Dialog>
			)}

			{buttonClicked === 'delete' && (
				<Dialog
					open={openDeleteDialog}
					onClose={handleDeleteDialogClose}
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
						<Box sx={{ width: '100%', textAlign: 'right', pb: 2 }}>
							<IconButton
								aria-label='close dialog'
								onClick={handleDeleteDialogClose}
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

						<DeleteAgent editAgent={selectedAgent} handleDelete={handleDelete} handleClose={handleDeleteDialogClose} setConfirmation={setConfirmation} />
					</Box>
				</Dialog>
			)}
		</Layout>
	);
};

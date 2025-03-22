import { Alert, Box, Dialog, IconButton, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { MailPlus, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/layout';
import { Transition } from '../../../components/sidebar';
import { WhiteContainer } from '../../../components/white-container';
import { useData } from '../../../context/DataContext';
import { AddEmail } from './AddEmail';
import { DeleteEmail } from './DeleteEmail';

export const Emails = () => {
	const { emails, refreshEmails } = useData();

	const [openDetail, setOpenDetail] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalEmails, setTotalEmails] = useState(0);
	const navigate = useNavigate();
	const { emailId } = useParams();

	const [selectedEmail, setSelectedEmail] = useState({});
	const [buttonClicked, setButtonClicked] = useState('');
	const [confirmation, setConfirmation] = useState('');

	useEffect(() => {
		refreshEmails();
	}, []);

	useEffect(() => {
		setTotalEmails(emails.length);
	}, [emails]);

	const handleDialogOpen = (event, email, button) => {
		event.stopPropagation();

		setSelectedEmail(email);
		setButtonClicked(button);

		if (button === 'edit') {
			setOpenDialog(true);
		} else if (button === 'delete') {
			setOpenDeleteDialog(true);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		refreshEmails();
	};

	const handleEmailEdited = () => {
		handleDialogClose();
		refreshEmails();
	};

	const handleEmailCreated = () => {
		handleDialogClose();
		refreshEmails();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshEmails();
	};

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value);
		setPage(0);
	};

	return (
		<Layout
			title={'Emails'}
			subtitle={'View all registered email addresses'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: true,
			}}
			AddResource={AddEmail}
			refreshResource={refreshEmails}
			setConfirmation={setConfirmation}
		>
			{confirmation && (
				<Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
					{confirmation}
				</Alert>	
			)}
			<WhiteContainer noPadding>
				{emails.length !== 0 && (
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
									<Typography variant='overline'>Email</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>From Name</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Notes</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Created</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Updated</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography variant='overline'></Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{emails.map((email) => (
								<TableRow
									key={email.email_id}
									onClick={(event) => handleDialogOpen(event, email, 'edit')}
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
									<TableCell>
										{email.email}
									</TableCell>
									<TableCell
										noWrap
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											maxWidth: '200px'
										}}
									>
										{email.email_from_name}
									</TableCell>
									<TableCell
										noWrap
										sx={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											maxWidth: '200px'
										}}
									>
										{email.notes}
									</TableCell>
									<TableCell>{email.created.replace('T', ' ')}</TableCell>
									<TableCell>{email.updated.replace('T', ' ')}</TableCell>
									<TableCell component='th' scope='row' align='right'>
										<Stack
											direction='row'
											// spacing={0.5}
											sx={{ justifyContent: 'flex-end' }}
										>
											<IconButton onClick={(event) => handleDialogOpen(event, email, 'edit')}>
												<Pencil size={18} />
											</IconButton>

											<IconButton onClick={(event) => handleDialogOpen(event, email, 'delete')}>
												<Trash2 size={18} />
											</IconButton>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
				<Box>
					<TablePagination
						component='div'
						count={totalEmails}
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

						<AddEmail handleCreated={handleEmailCreated} handleEdited={handleEmailEdited} editEmail={selectedEmail} setConfirmation={setConfirmation} />
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

						<DeleteEmail editEmail={selectedEmail} handleDelete={handleDelete} handleClose={handleDeleteDialogClose} setConfirmation={setConfirmation} />
					</Box>
				</Dialog>
			)}
		</Layout>
	);
};

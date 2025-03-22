import { Alert, Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { CirclePlus, MailPlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CustomSelect } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useData } from '../../context/DataContext';
import { useEmailBackend } from '../../hooks/useEmailBackend';

export const EmailBanlist = () => {
	const { getAllEmails, updateEmail } = useEmailBackend();
	const { formattedEmails, refreshEmails } = useData();
	const [allEmails, setAllEmails] = useState([]);
	const [confirmation, setConfirmation] = useState('');
	const [notification, setNotification] = useState('');
	const [isFormValid, setIsFormValid] = useState(false);
	const [selectedEmail, setSelectedEmail] = useState({});
	const [formData, setFormData] = useState({
		email_id: '',
		banned_email: '',
	});


	const handleDeleteBannedEmail = (email_to_remove, email_id) => {
		var email = allEmails.find((email) => email.email_id === email_id)
		email.banned_emails = email.banned_emails.filter(item => item !== email_to_remove)
		updateEmail(email)
		.then(res => {
			setSelectedEmail(res.data)
			setFormData({
				...formData,
				banned_email: ''	
			})
			setConfirmation('Email deleted from banlist!')
		})
		.catch(err => {
			setNotification(err.response.data.detail)
		})
		
	}

	const handleAddBannedEmail = () => {
		if(selectedEmail.banned_emails.includes(formData.banned_email)) {
			setNotification('Cannot ban the same email more than once!')
			setFormData({
				...formData,
				banned_email: ''	
			})
		} else {
			selectedEmail.banned_emails.push(formData.banned_email);
			updateEmail(selectedEmail)
			.then(res => {
				setSelectedEmail(res.data)
				setFormData({
					...formData,
					banned_email: ''	
				})
				setConfirmation('Email added to banlist!')
			})
			.catch(err => {
				setNotification(err.response.data.detail)
			})
		}
	}


	const handleChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
		var email = allEmails.find((email) => email.email_id === entry.target.value)
		if (email) {
			setSelectedEmail(email);
		}
	};

	const handleTextChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
	};

	const validateEmail = email => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	useEffect(() => {
		refreshEmails();
		getAllEmails()
		.then(res => {
			setAllEmails(res.data)
			setSelectedEmail(res.data[0])
		})
	}, []);

	useEffect(() => {
		if (formattedEmails.length > 0) {
			setFormData({
				...formData,
				email_id: formattedEmails[0].value
			});
		}
	},[formattedEmails])

	useEffect(() => {
		const isValid = validateEmail(formData.banned_email);
		setIsFormValid(isValid);
	}, [formData]);


	return (
		<Layout
			title={'Banlist'}
			subtitle={'View all banned email addresses for each registered email. Banning emails prevents ticket creation originating from those email addresses.'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
		>
			{confirmation && (
				<Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
					{confirmation}
				</Alert>	
			)}
			{notification && (
				<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
					{notification}
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
					<CustomSelect label='Email' onChange={handleChange} value={formData.email_id} name='email_id' mb={2} options={formattedEmails} sx={{width: '50%'}}/>

					<CustomFilledInput label='Add Email' onChange={handleTextChange} value={formData.banned_email} name='banned_email' sx={{width: '40%'}}/>

					<IconButton onClick={() => handleAddBannedEmail()} disabled={!(isFormValid && (formattedEmails.length !== 0))}>
						<CirclePlus size={20}/>
					</IconButton>

				</Box>
				
				{formattedEmails.length !== 0 ? (
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
									<Typography variant='overline'>Banned Emails</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography variant='overline'></Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedEmail.banned_emails?.length > 0 ? ( 
								selectedEmail.banned_emails.map((item, index) => (
									<TableRow
									key={index}
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
										<TableCell>{item}</TableCell>
										<TableCell component='th' scope='row' align='right'>
											<Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
												<IconButton onClick={() => handleDeleteBannedEmail(item, selectedEmail.email_id)}>
													<Trash2 size={18} />
												</IconButton>
											</Stack>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableCell colspan={5} sx={{ borderBottom: 'none' }}>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '40vh',
										}}
									>
										<Typography variant='h1' color='grey'>No banned emails</Typography>
									</Box>

								</TableCell>
							)}
						</TableBody>
					</Table>
				) : (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '40vh',
						}}
					>
						<Typography variant='h1' color='grey'>No emails found</Typography>
					</Box>
				)}

				{/* <Dialog
					open={openDeleteDialog}
					onClose={() => setOpenDeleteDialog(false)}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				)
				{/* <Box>
					<TablePagination
						component='div'
						count={totalEmails}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={size}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box> */}
			</WhiteContainer>
		</Layout>
	);
};

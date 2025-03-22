import { Alert, Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { CircleHelp, Eye, EyeOff, Pencil, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { HtmlTooltip } from '../../../components/tooltip';
import { useEmailBackend } from '../../../hooks/useEmailBackend';

export const AddEmail = ({ handleCreated, handleEdited, editEmail, setConfirmation }) => {
	const [isFormValid, setIsFormValid] = useState(false);  
	const { updateEmail, createEmail } = useEmailBackend();
	const [passwordExists, setPasswordExists] = useState(true);
	const [emailChange, setEmailChange] = useState(true);
	const [editable, setEditable] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [notification, setNotification] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		email_from_name: '',
		notes: '',
		mail_server: '',
		imap_active_status: 'off',
		imap_server: '',
	});

	const validateSubmit = () => {
		if (editEmail) {
			return (emailChange ? validateEmail(formData.email) && formData.password && formData.mail_server : true) && formData.mail_server && (formData.imap_active_status === 'on' ? formData.imap_server : true)
		} else {
			return validateEmail(formData.email) && formData.password && formData.mail_server && (formData.imap_active_status === 'on' ? formData.imap_server : true)
		}
	};

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	useEffect(() => {
		if (editEmail) {
			setFormData({
				email: editEmail.email,
				email_from_name: editEmail.email_from_name,
				notes: editEmail.notes,
				mail_server: editEmail.mail_server,
				imap_active_status: editEmail.imap_active_status === 1 ? 'on' : 'off',
				imap_server: editEmail.imap_server,
			});
			setPasswordExists(false);
			setEmailChange(false);
		}
	}, [editEmail]);

	const handleChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
	};

	const handleCheckBox = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});
	};

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleAction = () => {
		formData['imap_active_status'] = formData.imap_active_status === 'on' ? 1 : 0
		if (editEmail) {
			let updates = { ...editEmail };
			if (!emailChange) {
				formData['password'] = editEmail.password;
			}
			Object.entries(formData).forEach((update) => {
				updates[update[0]] = update[1];
			});
			updateEmail(updates)
				.then((res) => {
					handleEdited();
					setConfirmation('Email successfully edited!')
				})
				.catch((err) => {
					console.error(err);
					setNotification(err.response?.data?.detail);
					formData['imap_active_status'] = 'off'
				})
		} else {
			createEmail(formData)
				.then((res) => {
					handleCreated();
					setConfirmation('Email successfully created!')
				})
				.catch((err) => {
					console.error(err)
					setNotification(err.response?.data?.detail);
					formData['imap_active_status'] = 'off'
				});
		}
	};

	useEffect(() => {
		const isValid = validateSubmit();
		setIsFormValid(isValid);
	}, [formData, emailChange]);

	const EmailChange = () => {
		setEmailChange(true);
		setPasswordExists(true);
		setEditable(false);
		setFormData((p) => ({
			...p,
			imap_active_status: 'off',
		}));
	};

	const ClearEmail = () => {
		setFormData((p) => ({
			...p,
			email: editEmail.email,
			password: '',
			imap_active_status: editEmail.active === 1 ? 'on' : 'off',
			imap_server: editEmail.imap_server,
		}));
		setEmailChange(false);
		setPasswordExists(false);
		setEditable(true);
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editEmail ? 'Edit email' : 'Add email'}
			</Typography>

			<Typography variant='subtitle2'>
				{editEmail ? 'Edit email information.' : 'Please fill out the following information for the new email.'}
			</Typography>

			{notification && (
				<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
					{notification}
				</Alert>	
			)}

			<Box
				sx={{
					background: '#FFF',
					m: 4,
					p: 4,
					pt: 3,
					borderRadius: '12px',
					textAlign: 'left',
				}}
			>
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Required information
				</Typography>

				{editEmail ? (
					<Stack direction='row' alignItems='center' spacing={0.5}>
						{emailChange ? (
							<Stack direction='row' alignItems='center'>
								<CustomFilledInput label='Email Address' onChange={handleChange} value={formData?.email} name='email' fullWidth mb={2} />

								<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={ClearEmail}>
									<X size={16} />
								</IconButton>
							</Stack>
						) : (
							<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
								{formData?.email}
							</Typography>
						)}

						{editable && (
							<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={EmailChange}>
								<Pencil size={16} />
							</IconButton>
						)}

						<HtmlTooltip
							title={
								<React.Fragment>
									<Typography color='inherit'>Editiing Email Address</Typography>
									{'Changing the email will require you to update your password and re-verify the email!'}
									{" Hit the 'X' icon to cancel changes and restore the original email and password"}
								</React.Fragment>
							}
							placement='right'
							arrow
						>
							<CircleHelp size={20} />
						</HtmlTooltip>
					</Stack>
				) : (
					<CustomFilledInput label='Email Address' onChange={handleChange} value={formData?.email} name='email' fullWidth mb={2} />
				)}

				{passwordExists && (
					<Stack direction='row' alignItems='center' spacing={0.5}>
						<CustomFilledInput
							label='Password'
							onChange={handleChange}
							value={formData?.password}
							name='password'
							type={showPassword ? 'text' : 'password'}
							mb={2}
							fullWidth
							endAdornment={
								<>
									<InputAdornment>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={(e) => e.preventDefault()}
											edge='end'
										>
											{showPassword ? <EyeOff /> : <Eye />}
										</IconButton>
									</InputAdornment>
									<InputAdornment position='end'>
										<HtmlTooltip
											title={
												<React.Fragment>
													<Typography color='inherit'>Email Password</Typography>
													{'The password provided here will not be the regular password used to log in to your email.'}
													{' This feature is usually only supported for accounts that have 2FA/MFA, but consult'}
													{' your email service provider\'s documentation on third-party app passwords to see if'}
													{' 2FA/MFA is required to generate an app password.'}
													<br />
													<br />
													{'Find where the app password settings are (usually in the security or privacy tab where 2FA/MFA was at).'}
													{' Pick a name that will signify you are using an app password for this site so you can monitor and revoke it when needed.'}
													{' Then, copy and paste the generated password into this box.'}
												</React.Fragment>
											}
											placement='right'
											arrow
										>
											<CircleHelp size={20} />
										</HtmlTooltip>
									</InputAdornment>
								</>
							}
						/>

					</Stack>
				)}


				{/* <CustomSelect
					label='Email Server'
					onChange={handleChange}
					value={formData?.mail_server}
					name='mail_server'
					mb={2}
					fullWidth
					options={[{ label: 'smtp.gmail.com', value: 'smtp.gmail.com' }]}
				/> */}
				
				<CustomFilledInput 
					label='Email Server' 
					onChange={handleChange} 
					value={formData?.mail_server} 
					name='mail_server' 
					fullWidth 
					mb={2} 
					mt={2} 
					endAdornment={
						<InputAdornment position='end'>
							<HtmlTooltip
								title={
									<React.Fragment>
										<Typography color='inherit'>SMTP Server</Typography>
										{'This will control your '}<b>Outgoing Mail</b>{'.'}
										{' This will allow you to send emails with the provided email address through the site, which you can set up in the "Email Settings" tab.'}
										{' Visit your email provider’s support page and search for SMTP settings. Most providers'}
										{' list them in their help documentation. You can also try looking up "[Your Email Provider]'}
										{' SMTP server" to find the correct server. This will typically begin with "smtp" and'}
										{' have some unique name following it that signifies it is that provider\'s SMTP server'}

									</React.Fragment>
								}
								placement='right'
								arrow
							>
								<CircleHelp size={20} />
							</HtmlTooltip>
						</InputAdornment>
					}
					/>


				<FormControlLabel
					name='imap_active_status'
					control={<Checkbox checked={formData.imap_active_status === 'on' ? true : false} onChange={handleCheckBox} />}
					label={
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							Enable IMAP Server
						</Typography>
					}
				/>
				
				<CustomFilledInput 
					label='IMAP Mail Server' 
					onChange={handleChange} 
					value={formData?.imap_server} 
					disabled={formData.imap_active_status === 'off' ? true : false} 
					name='imap_server' 
					fullWidth 
					mb={2}
					endAdornment={
						<InputAdornment position='end'>
							<HtmlTooltip
								title={
									<React.Fragment>
										<Typography color='inherit'>IMAP Server</Typography>
										{'This will control your '}<b>Incoming Mail</b>{'.'}
										{' This will allow you to enable emails\' inboxes to be monitored and have any emails sent automatically turn into tickets.'}
										{' Visit your email provider’s support page and search for IMAP settings. Most providers'}
										{' list them in their help documentation. You can also try looking up "[Your Email Provider]'}
										{' IMAP server" to find the correct server. This will typically begin with "imap" and'}
										{' have some unique name following it that signifies it is that provider\'s IMAP server'}
										{' Some providers may have IMAP disabled by default, so you must enable it in the IMAP settings before submitting.'}
										<b> This feature is best supported by Gmail, but is also supported by AOL, Yahoo and iCloud mail. Support for Outlook will be added soon.</b>

									</React.Fragment>
								}
								placement='right'
								arrow
							>
								<CircleHelp size={20} />
							</HtmlTooltip>
						</InputAdornment>
					} 
				/>
			

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
					Optional information
				</Typography>

				<CustomFilledInput label='Email From Name' onChange={handleChange} value={formData?.email_from_name} name='email_from_name' fullWidth mb={2} />

				<CustomFilledInput label='Internal Notes' onChange={handleChange} value={formData?.notes} name='notes' fullWidth mb={2} />
			</Box>

			<Stack
				direction='row'
				// spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editEmail ? 'Edit' : 'Create'} email
				</CircularButton>
			</Stack>
		</>
	);
};

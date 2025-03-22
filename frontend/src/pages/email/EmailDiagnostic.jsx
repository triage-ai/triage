import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { MailPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CustomSelect } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { useData } from '../../context/DataContext';
import { useEmailBackend } from '../../hooks/useEmailBackend';

export const EmailSelect = ({ handleInputChange, value, label, name }) => {
	const { formattedEmails, refreshEmails } = useData();

	useEffect(() => {
		refreshEmails();
	}, []);

	return (
		<>
			<CustomSelect label={label} onChange={handleInputChange} value={value} name={name} mb={2} fullWidth options={formattedEmails} />
		</>
	);
};

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const handleSend = (formData, setLoading, setCircleLoading, sendTestEmail, setNotification, setConfirmation, setFormData) => {
	try {
		setCircleLoading(true);
		sendTestEmail(formData)
			.then((res) => {
				setConfirmation(res.data.message);
				setFormData({
					...formData,
					['recipient_email']: '',
				});
			})
			.catch((err) => {
				const errorCode = err.code;
				const errorMessage = err.message;
				console.error(errorCode, errorMessage);
				setNotification(err.response?.data?.message);
				setFormData({
					...formData,
					['recipient_email']: '',
				});
			});
		setCircleLoading(false);
		setLoading(true);
	} catch (err) {
		console.error('Error with saving settings:', err);
	}
};

export const EmailDiagnostic = () => {
	const { sendTestEmail } = useEmailBackend();
	const [formData, setFormData] = useState({
		recipient_email: '',
		sender_email_id: '',
	});
	const [loading, setLoading] = useState(false);
	const [circleLoading, setCircleLoading] = useState(false);
	const [notification, setNotification] = useState(false);
	const [confirmation, setConfirmation] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	
	
	const handleChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
		
		setLoading(false);
	};

	useEffect(() => {
		const isValid = validateEmail(formData.recipient_email) && formData.sender_email_id;
		setIsFormValid(isValid);
	}, [formData]);

	return (
		<Layout
			title={'Test Outgoing Email'}
			subtitle={'Use the following form to test whether your Outgoing Email settings are properly established'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
		>
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>
					{notification && (
						<Alert severity="error" onClose={() => setNotification('')} icon={false} sx={{mb: 2, border: '1px solid rgb(239, 83, 80);'}} >
							{notification}
						</Alert>	
					)}
					{confirmation && (
						<Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
							{confirmation}
						</Alert>	
					)}
					<Typography variant='subtitle1'>Note: You can change the test template that is sent in the templates tab</Typography>

					<Stack sx={{ maxWidth: 400, pb: 2 }}>
						<EmailSelect
							handleInputChange={handleChange}
							value={formData?.sender_email_id}
							name='sender_email_id'
							label='Sender Email'
						/>

						<CustomFilledInput
							label='Recipient Email'
							onChange={handleChange}
							value={formData?.recipient_email}
							name='recipient_email'
							fullWidth
							mb={2}
						/>


					</Stack>

					<CircularButton
						sx={{ py: 2, px: 6, width: 250 }}
						onClick={() => handleSend(formData, setLoading, setCircleLoading, sendTestEmail, setNotification, setConfirmation, setFormData)}
						disabled={loading || circleLoading || !isFormValid}
					>
						{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Send Email'}
					</CircularButton>

				</Box>
			</WhiteContainer>
		</Layout>
	);
};

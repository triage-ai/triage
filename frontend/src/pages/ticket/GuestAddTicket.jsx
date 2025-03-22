import { Alert, Box, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Activity, ArrowLeft, Split, Tag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import logoBlack from '../../assets/logo-black.svg';
import logo from '../../assets/logo-white.svg';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useFormBackend } from '../../hooks/useFormBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { FormInput } from '../form/FormInput';
import { TopicSelect } from '../topic/TopicSelect';


export const GuestAddTicket = () => {
    const { createTicketForGuest, getTicketForms } = useTicketBackend();
    const { getFormById } = useFormBackend();
    const [notification, setNotification] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
	const navigate = useNavigate();

    const [forms, setForms] = useState([]);
    const [formFields, setFormFields] = useState([]);
    const [formValues, setFormValues] = useState({});

    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        description: '',
        title: '',
        form_id: null,
    });

	const validateEmail = email => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const validateTicket = () => {
		let valid = true
		for (const key in formValues) {
			if (!formValues[key]) {
				valid = false
				break
			}
		}

		return valid && formData.description && formData.title && formData.topic_id && validateEmail(formData.email) && formData.firstname && formData.lastname
	}


	useEffect(() => {
		const isValid = validateTicket();
		setIsFormValid(isValid);
	}, [formData, formValues]);

    useEffect(() => {
		getTicketForms()
			.then(res => {
				setForms(res.data)
			})
			.catch(err => console.error(err))
	}, [])


	const handleFormChange = e => {
		const { name, value } = e.target;
		setFormValues(prev => ({
			...prev,
			[name]: value,
		}));
	}

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

    const prepareNewTicketFormData = () => {

        const form_values = []
        for (const item of formFields) {
            form_values.push({
                field_id: item.field_id,
                form_id: formData.form_id,
                value: formValues[item.name]
            })
        }
        return {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname, 
            description: formData.description,
            title: formData.title,
            topic_id: formData.topic_id,
            form_values: form_values
        }
	}

    const setupForm = (topic_id) => {
		const values = {}
		const form = forms.find((form) => form.topic_id === topic_id)?.form

		form?.fields?.forEach((field) => {
			values[field.name] = ''
		})
		setFormValues(values)
		setFormFields(form?.fields ?? [])
		setFormData(prev => ({
			...prev,
			form_id: form?.form_id,
		}));

	}

    const handleAction = () => {
        createTicketForGuest(prepareNewTicketFormData())
            .then(res => {
                setFormData({
                    email: '',
                    firstname: '',
                    lastname: '',
                    description: '',
                    title: '',
                    form_id: null,
                })
                setConfirmation('Ticket created successfully! Check your email for a confirmation and instructions on how to view the ticket.')
            })
            .catch(err => {
                setNotification(err.response.data.detail)
            });
	};

	return (
		<Box
			sx={{
				width: '100%',
				// display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#FCFCFC',
			}}
		>
			{/* <IconButton
				sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
				onClick={() => navigate('/')}
			>
				<ArrowRight />
			</IconButton> */}
				
			<Grid container spacing={{ xs: 6, md: 8, lg: 2 }}>
				<Grid
					size={{ xs: 0, md: 6 }}
					sx={{
						display: { xs: 'none', md: 'block' },
					}}
				>
					<Box
						sx={{
							width: 'calc(100% - 8px)',
							height: 'calc(100dvh - 16px)',
							padding: '8px',
							paddingRight: 0,
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								background: 'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
								display: { xs: 'none', md: 'flex' },
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								padding: { md: '34px', lg: '44px' },
								boxSizing: 'border-box',
								flexShrink: 0,
								textAlign: 'center',
								borderRadius: '16px',
							}}
						>
							<Typography
								variant='h1'
								sx={{
									fontSize: '3.75rem',
									background: 'radial-gradient(45% 100% at 50% 50%, #fff 50%, #ffffff80)',
									fontWeight: 600,
									letterSpacing: '-0.02em',
									color: '#FFF',
									textAlign: 'left',
									backgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									WebkitBackgroundClip: 'text',
									lineHeight: 1.1,
									width: { md: '100%', lg: '75%' },
								}}
							>
								Experience the future of customer support with Triage.ai
							</Typography>


							<Grid container spacing={2} sx={{ marginTop: '1.5rem', display: { xs: 'none', lg: 'flex' } }}>
								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Tag color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Labels tickets
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
										Triage AI automatically labels your tickets to streamline your support process
									</Typography>
								</Grid>

								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Split color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Assigns tickets
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
										Ensures that tickets are accurately assigned to the appropriate members
									</Typography>
								</Grid>

								<Grid size={{ xs: 4 }} sx={{ textAlign: 'left' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Activity color='#fff' size={16} strokeWidth={2.2} style={{ opacity: 0.6, marginRight: '0.4rem' }} />
										<Typography variant='subtitle1' sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}>
											Identifies surges
										</Typography>
									</Box>

									<Typography variant='body2' sx={{ color: '#FFF', opacity: 0.6 }}>
										Pinpoints areas with an increased ticket activity for proactive management
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// backgroundColor: '#FCFCFC',
						}}
					>
						<Box
                            sx={{
                                width: '450px',
                                maxWidth: '500px',
                                minHeight: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'calc(10px + 2vmin)',
                                color: 'white',
                                textAlign: 'left'
                            }}
                        >
							<Box
								sx={{
									width: '100%',
									padding: { xs: '20px 28px', md: '30px 40px' },
									boxSizing: 'border-box',
									position: 'absolute',
									top: 0,
									left: 0,
									display: 'flex',
									alignItems: { xs: 'center', md: 'flex-start' },
									justifyContent: 'space-between',
								}}
							>
								<Box sx={{ display: { xs: 'none', md: 'block' } }}>
									<img src={logo} className='App-logo' alt='logo' />
								</Box>

								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									<img src={logoBlack} className='App-logo' alt='logo' />
								</Box>

							</Box>

                            <>
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
								<Box
									sx={{position: 'relative', width: '100%', textAlign: 'center'}}
								>
									<IconButton
										sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
										onClick={() => navigate('/')}
									>
										<ArrowLeft />
									</IconButton>
									<Typography
										variant="h1"
										sx={{ mb: 1.5, color: '#1B1D1F' }}
									>
										Add ticket
									</Typography>
								</Box>

                                <Typography variant="subtitle2">
                                    We will gather essential details about the new ticket. Please fill out the following information.
                                </Typography>


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

                                    <CustomFilledInput
                                        label="Email"
                                        onChange={handleInputChange}
                                        value={formData.email}
                                        name="email"
                                        fullWidth
                                        mb={2}
                                    />

                                    <CustomFilledInput
                                        label="First Name"
                                        onChange={handleInputChange}
                                        value={formData.firstname}
                                        name="firstname"
                                        fullWidth
                                        mb={2}
                                    />

                                    <CustomFilledInput
                                        label="Last Name"
                                        onChange={handleInputChange}
                                        value={formData.lastname}
                                        name="lastname"
                                        fullWidth
                                        mb={2}
                                    />

                                    <TopicSelect
                                        handleInputChange={(e) => {
                                            handleInputChange(e)
                                            setupForm(e.target.value)
                                        }}
                                        value={formData.topic_id ?? ''}
                                        mb={2}
                                    />

                                    <CustomFilledInput
                                        label="Title"
                                        onChange={handleInputChange}
                                        value={formData.title}
                                        name="title"
                                        fullWidth
                                        mb={2}
                                    />

                                    <CustomFilledInput
                                        label="Description"
                                        onChange={handleInputChange}
                                        value={formData.description}
                                        name="description"
                                        mb={2}
                                        fullWidth
                                        multiline
                                        rows={5}
                                    />

                                    {formFields?.length !== 0 &&
                                        formFields.map((formField) => (
                                            <FormInput
                                                value={formValues[formField.name] ?? ''}
                                                key={formField.field_id}
                                                formField={formField}
                                                handleInputChange={handleFormChange}
                                            />
                                        ))

                                    }
                                </Box>



                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    sx={{ justifyContent: 'center' }}
                                >

                                    <CircularButton
                                        sx={{ py: 2, px: 6, mb: 2 }}
                                        onClick={handleAction}
                                        disabled={!isFormValid}
                                    >
                                        Create ticket
                                    </CircularButton>
                                </Stack>
                            </>

						</Box>
					</div>
				</Grid>
			</Grid>
		</Box>
	);
};

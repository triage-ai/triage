import { Alert, Box, CssBaseline, Drawer, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LogoHorizontal from '../assets/logo-horizontal-primary.svg';
import { CustomFilledInput } from '../components/custom-input';
import { CircularButton } from '../components/sidebar';
import { DrawerContext } from '../context/DrawerContext';
import formatDate from '../functions/date-formatter';
import { useFormBackend } from '../hooks/useFormBackend';
import { useTicketBackend } from '../hooks/useTicketBackend';
import { FormInput } from '../pages/form/FormInput';

dayjs.extend(utc)

const drawerWidth = 250;


const TicketDetail = ({ ticket, setTicket, preProcessTicket }) => {
    const { getTicketForms, updateTicketForGuest } = useTicketBackend();
    const { getFormById } = useFormBackend();

    const [forms, setForms] = useState([])
    const [formFields, setFormFields] = useState([])
    const [formValues, setFormValues] = useState({})
    const [confirmation, setConfirmation] = useState(false)
    const [notification, setNotification] = useState(false)

    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        title: '',
        topic_id: '',
        company_name: '',
    });
    
    useEffect(() => {
		getTicketForms()
			.then(res => {
				setForms(res.data)
			})
			.catch(err => console.error(err))
	}, [])

	useEffect(() => {
		const isValid = validateTicket();
		setIsFormValid(isValid);
	}, [formData, formValues]);

	useEffect(() => {
        const form_id = ticket?.form_entry?.form_id
        setFormData({ ...ticket, form_id: form_id });
        if (form_id) {
            getFormById(form_id)
                .then((res) => {
                    populateFormInfo(res)
                })
        }
	}, [ticket]);

    const populateFormInfo = (res) => {
		setFormFields(res.data.fields)
		let values = {}
		ticket.form_entry.values.forEach(value => {
			const field = res.data.fields.find((field) => field.field_id === value.field_id)
			if (field) {
				values[field.name] = value.value
			}
		})
		setFormValues(values)
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

    const prepareEditTicketFormData = () => {

		const form_values = []
		const field_to_value_map = {}
		if (formFields.length) {
			ticket.form_entry.values.map(value => {
				field_to_value_map[value.field_id] = value.value_id
			})
		}
		for (const item of formFields) {
			form_values.push({
				field_id: item.field_id,
				value_id: field_to_value_map[item.field_id],
				value: formValues[item.name]
			})
		}

		return {
			ticket_id: formData.ticket_id,
			agent_id: formData.agent?.agent_id ?? null,
			user_id: formData.user?.user_id ?? null,
			description: formData.description,
			title: formData.title,
			dept_id: formData.dept_id ? formData.dept_id : null,
			sla_id: formData.sla_id ? formData.sla_id : null,
			status_id: formData.status_id ? formData.status_id : null,
			priority_id: formData.priority_id ? formData.priority_id : null,
			topic_id: formData.topic_id ? formData.topic_id : null,
			group_id: formData.group_id ? formData.group_id : null,
			due_date: formData.due_date,
			form_values: form_values
		}
	}

	const validateTicket = () => {
        let valid = true
		for (const key in formValues) {
			if (!formValues[key]) {
				valid = false
				break
			}
		}

		return valid && formData.description && formData.title && formData.topic_id
	}

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


	const handleAction = () => {
        updateTicketForGuest(prepareEditTicketFormData())
            .then((response) => response.data)
            .then((ticket) => {
                ticket = preProcessTicket(ticket);
                setTicket(ticket);
                setConfirmation('Ticket updated successfully')
            })
            .catch(err => console.error(err));
	};

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
            <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                <img src={LogoHorizontal} alt='Triage logo' style={{ width: '60%', objectFit: 'cover' }} />
            </Box>

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
            
            <Typography variant='subtitle1' fontWeight='bold'>User:</Typography>

            <Typography variant='body2' sx={{ mb: 1 }}>{ticket.user.firstname + ' ' + ticket.user.lastname}</Typography>

            <Typography variant='subtitle1' fontWeight='bold'>Agent:</Typography>

            <Typography variant='body2' sx={{ mb: 1 }}>{ticket.agent ? ticket.agent.firstname + ' ' + ticket.agent.lastname : 'Not Assigned'}</Typography>

            <Typography variant='subtitle1' fontWeight='bold'>Topic:</Typography>

            <Typography variant='body2' sx={{ mb: 1 }}>{ticket.topic.topic}</Typography>

            <Typography variant='subtitle1' fontWeight='bold'>Due Date:</Typography>

            <Typography variant='body2' sx={{ mb: 4 }}>{ticket.due_date ? formatDate(ticket.due_date, 'MM-DD-YY hh:mm A') : formatDate(ticket.est_due_date, 'MM-DD-YY hh:mm A')}</Typography>


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



            <Stack
				direction="row"
				spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={handleAction}
					disabled={!isFormValid}
				>
					Edit ticket
				</CircularButton>
			</Stack>

        </Box>
    )
}

export const GuestSidebar = ({ ticket, setTicket, preProcessTicket }) => {
	const [isClosing, setIsClosing] = useState(false);
    const { mobileOpen, handleDrawerTransitionEnd, handleDrawerClose } = useContext(DrawerContext);

	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<Box
					component='nav'
					sx={{
						width: { md: drawerWidth },
						flexShrink: { md: 0 },
					}}
					aria-label='mailbox folders'
				>
					<Drawer
						variant='temporary'
						open={mobileOpen}
						onTransitionEnd={handleDrawerTransitionEnd}
						onClose={handleDrawerClose}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
						sx={{
							display: { xs: 'block', md: 'none' },
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
								alignItems: 'center',
								backgroundColor: '#FFF',
								borderRight: '1px solid #F4F4F4',
							},
						}}
					>
						<TicketDetail ticket={ticket} setTicket={setTicket} preProcessTicket={preProcessTicket} />
					</Drawer>

					<Drawer
						variant='permanent'
						sx={{
							display: { xs: 'none', md: 'block' },
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
								alignItems: 'center',
								backgroundColor: '#FFF',
								borderRight: '1.5px solid #E5EFE9',
							},
						}}
						open
					>
						<TicketDetail ticket={ticket} setTicket={setTicket} preProcessTicket={preProcessTicket} />
					</Drawer>
				</Box>
			</Box>
			<Outlet />
		</>
	);
};

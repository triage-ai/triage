import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { AuthContext } from '../../context/AuthContext';
import { useFormBackend } from '../../hooks/useFormBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { FormInput } from '../form/FormInput';
import { TopicSelect } from '../topic/TopicSelect';

export const UserAddTicket = ({ handleTicketCreated, handleTicketEdited, editTicket }) => {
    const { userAuthState } = useContext(AuthContext)
    const { createTicketForUser, updateTicketForUser, getTicketForms } = useTicketBackend();
    const { getFormById } = useFormBackend();

    const [forms, setForms] = useState([])
    const [formFields, setFormFields] = useState([])
    const [formValues, setFormValues] = useState({})

    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        user_id: userAuthState.user_id,
        description: '',
        title: '',
        topic_id: '',
        source: 'native',
        form_id: null,
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
        if (editTicket) {
            const form_id = editTicket?.form_entry?.form_id
            setFormData({ ...editTicket, form_id: form_id });
            if (form_id) {
                getFormById(form_id)
                    .then((res) => {
                        setFormFields(res.data.fields)
                        let values = {}
                        editTicket.form_entry.values.map(value => {
                            const field = res.data.fields.find((field) => field.field_id === value.field_id)
                            values[field.name] = value.value
                        })
                        setFormValues(values)
                    })
            }

        }
    }, [editTicket]);

    const setupForm = (topic_id) => {
        const values = {}
        const form = forms.find((form) => form.topic_id == topic_id)?.form

        form?.fields?.map((field) => {
            values[field.name] = ''
        })
        setFormValues(values)
        setFormFields(form?.fields ?? [])
        setFormData(prev => ({
            ...prev,
            form_id: form?.form_id,
        }));

    }

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
            user_id: formData.user_id,
            description: formData.description,
            title: formData.title,
            topic_id: formData.topic_id ? formData.topic_id : null,
            form_values: form_values,
            source: 'native'
        }
    }

    const prepareEditTicketFormData = () => {

        const form_values = []
        const field_to_value_map = {}
        if (formFields.length) {
            editTicket.form_entry.values.map(value => {
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
            title: formData.title,
            description: formData.description,
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
        if (editTicket) {
            updateTicketForUser(prepareEditTicketFormData(formData))
                .then(res => {
                    handleTicketEdited();
                })
                .catch(err => console.error(err));
        } else {
            createTicketForUser(prepareNewTicketFormData(formData))
                .then(res => {
                    handleTicketCreated();
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <>
            <Typography
                variant="h1"
                sx={{ mb: 1.5 }}
            >
                {editTicket ? 'Edit ticket' : 'Add ticket'}
            </Typography>

            <Typography variant="subtitle2">
                {editTicket ? 'Edit ticket information.' : 'We will gather essential details about the new ticket. Please fill out the following information.'}
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
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, mb: 2 }}
                >
                    Required information
                </Typography>

                {editTicket ? <></> :
                    <TopicSelect
                        handleInputChange={(e) => {
                            handleInputChange(e)
                            if (!editTicket) {
                                setupForm(e.target.value)
                            }
                        }}
                        value={formData.topic_id ?? ''}
                    />}

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
                // spacing={1.5}
                sx={{ justifyContent: 'center' }}
            >

                <CircularButton
                    sx={{ py: 2, px: 6 }}
                    onClick={handleAction}
                    disabled={!isFormValid}
                >
                    {editTicket ? 'Edit' : 'Create'} ticket
                </CircularButton>
            </Stack>
        </>
    );
};

import { Autocomplete, Box, Popper, Stack, styled, TextField, Typography } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useGridApiContext } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import CustomDataGrid from '../../components/data-grid';
import { CircularButton } from '../../components/sidebar';
import { useAgentBackend } from '../../hooks/useAgentBackend';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import { useNotification } from '../../hooks/useNotification';
import { AgentSelect } from '../agent/AgentSelect';

export const AddGroup = ({ handleCreated, handleEdited, editGroup }) => {
	const { createGroup, updateGroup } = useGroupBackend();

	const sendNotification = useNotification();

	const [lead, setLead] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false);

	const [members, setMembers] = useState([]);

	const [formData, setFormData] = useState({
		lead_id: '',
		name: '',
		notes: '',
	});

	const columns = [
		{
			field: 'name',
			headerName: 'Name',
			width: 300,
			editable: true,
			isValid: (value) => false,
			renderCell: (obj) => {
				const { value } = obj;
				return value ? value.firstname + ' ' + value.lastname : '';
			},
			renderEditCell: (params) => {
				return <CustomEditAutoCompleteComponent {...params} />;
			},
			preProcessEditCellProps: async (params) => {
				const hasError = params.props.value === null ? 'Please enter an agent' : null;
				return { ...params.props, error: hasError };
			},
		},
	];

	const validateForm = () => {
		return formData.name !== '';
	};

	useEffect(() => {
		if (editGroup) {
			setFormData(editGroup);
			setLead(editGroup.lead);
		}
	}, [editGroup]);

	const prepareFormData = () => {
		const { lead_id, name, notes } = formData;
		return {
			lead_id: lead_id === '' ? null : lead_id,
			name: name,
			notes: notes,
			...(editGroup && { group_id: formData.group_id }),
		};
	};

	useEffect(() => {
		setIsFormValid(validateForm());
	}, [formData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleLeadChange = (e, newValue) => {
		setLead(newValue);
		setFormData((p) => ({ ...p, lead_id: newValue?.agent_id ?? '' }));
	};

	const handleAction = () => {
		if (editGroup) {
			updateGroup(prepareFormData(formData))
				.then((res) => {
					handleEdited();
				})
				.catch((err) => console.error(err));
		} else {
			createGroup(prepareFormData(formData))
				.then((res) => {
					handleCreated();
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editGroup ? 'Edit group' : 'Add group'}
			</Typography>

			<Typography variant='subtitle2'>
				{editGroup
					? 'Edit the details for this group'
					: 'We will gather essential details about the new group. Complete the following steps to ensure accurate setup and access.'}
			</Typography>

			<Box
				sx={{
					background: '#FFF',
					m: 4,
					p: 4,
					pt: 3,
					textAlign: 'left',
				}}
			>
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Group information
				</Typography>

				<CustomFilledInput label='Name' onChange={handleInputChange} value={formData.name} name='name' mb={2} fullWidth />

				<AgentSelect name='lead' handleInputChange={handleLeadChange} value={lead ?? ''} mb={2} />

				<CustomFilledInput label='Notes' onChange={handleInputChange} value={formData.notes} name='notes' fullWidth multiline rows={3} />

				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Members
				</Typography>

				<CustomDataGrid rows={members} setRows={setMembers} columns={columns} />
			</Box>

			<Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editGroup ? 'Edit' : 'Create'} group
				</CircularButton>
			</Stack>
		</>
	);
};

const CustomEditAutoCompleteComponent = (props) => {
	const { id, value, field, hasFocus, error } = props;
	const apiRef = useGridApiContext();
	const ref = useRef();

	// useLayoutEffect(() => {
	// 	if (hasFocus) {
	// 		ref.current.focus();
	// 	}
	// }, [hasFocus]);

	const handleValueChange = (event, newValue) => {
		apiRef.current.setEditCellValue({ id, field, value: newValue });
	};

	return (
		<StyledTooltip open={!!error} title={error} placement='top'>
			<CustomAgentSelect {...props} value={value ?? ''} handleInputChange={handleValueChange} />
		</StyledTooltip>
	);
};

const CustomAgentSelect = ({ handleInputChange, value, ...props }) => {
	const { getAgentBySearch } = useAgentBackend();
	const [agentOptions, setAgentOptions] = useState([]);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const { mt, mb, ...otherProps } = props;

	const handleAgentSearchChange = (e) => {
		if (e?.target?.value) {
			getAgentBySearch(e.target.value)
				.then((res) => {
					setAgentOptions(res.data);
				})
				.catch((err) => alert('Agent search failed'));
		}
	};

	const openDialog = () => {
		setOpenCreateDialog(true);
	};

	const handleClose = () => {
		setOpenCreateDialog(false);
	};

	return (
		<Autocomplete
			fullWidth
			name='agent'
			label='Agent'
			filterOptions={(x) => x}
			options={agentOptions}
			value={value}
			onInputChange={handleAgentSearchChange}
			onChange={handleInputChange}
			getOptionLabel={(item) => (item ? item.firstname + ' ' + item.lastname : '')}
			renderInput={(params) => <TextField {...params} />}
			sx={{
				'&.Mui-focused fieldset': {
					border: 'none',
				},
				'&:hover fieldset': {
					border: 'none',
				},
				'& fieldset': { borderRadius: 0, p: 0, m: 0, border: 'none' },
				'& .MuiFilledInput-root': {
					overflow: 'hidden',
					backgroundColor: 'transparent',
					fontSize: '0.9375rem',
					fontWeight: 500,
					textAlign: 'left',
				},
			}}
			PopperComponent={(props) => <Popper {...props} style={{ maxWidth: 400 }} placement='bottom-start' />}
			renderOption={(props, item) => (
				<li {...props} key={item.email}>
					{item.firstname + ' ' + item.lastname}&nbsp;
					<span style={{ color: 'grey', fontSize: 10 }}>{item.email}</span>
				</li>
			)}
		/>
	);
};

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
	},
}));

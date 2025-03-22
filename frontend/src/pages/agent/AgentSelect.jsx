import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';
import { CustomAutocomplete } from '../../components/custom-select';
// import { AddAgent } from './AddAgent';
import { useAgentBackend } from '../../hooks/useAgentBackend';

export const AgentSelect = ({ handleInputChange, value, ...props }) => {
	const { getAgentBySearch } = useAgentBackend();
	const [agentOptions, setAgentOptions] = useState([]);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const { mt, mb, ...otherProps } = props;

	const handleAgentSearchChange = e => {
		if (e?.target?.value) {
			getAgentBySearch(e.target.value)
				.then(res => {
					setAgentOptions(res.data);
				})
				.catch(err => alert('Agent search failed'));
		}
	};

	return (
		<>
			<CustomAutocomplete
				{...otherProps}
				label="Agent"
				onChange={handleInputChange}
				onInputChange={handleAgentSearchChange}
				name="agent"
				value={value}
				mb={2}
				fullWidth
				options={agentOptions}
				getOptionLabel={item => (item ? item.firstname + ' ' + item.lastname : '')}
				sx={{ marginBottom: mb, borderRadius: 0 }}
				renderOption={(props, item) => (
					<li
						{...props}
						key={item.email}
					>
						{item.firstname + ' ' + item.lastname}&nbsp;
						<span style={{ color: 'grey', fontSize: 10 }}>{item.email}</span>
					</li>
				)}
			/>
		</>
	);
};

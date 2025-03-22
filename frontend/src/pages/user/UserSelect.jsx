import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';
import { CustomAutocomplete } from '../../components/custom-select';
// import { AddUser } from './AddUser';
import { useUserBackend } from '../../hooks/useUserBackend';

export const UserSelect = ({ handleInputChange, value, ...props }) => {
	const { getUserBySearch } = useUserBackend();
	const [userOptions, setUserOptions] = useState([]);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const { mt, mb, ...otherProps } = props;

	const handleUserSearchChange = e => {
		if (e?.target?.value) {
			getUserBySearch(e.target.value)
				.then(res => {
					setUserOptions(res.data);
				})
				.catch(err => alert('User search failed'));
		}
	};

	return (
		<>
			<CustomAutocomplete
				label="User"
				onChange={handleInputChange}
				onInputChange={handleUserSearchChange}
				name="user"
				value={value}
				mt={mt}
				mb={mb}
				fullWidth
				options={userOptions}
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

import {
	Box,
	CircularProgress,
	FormControl,
	MenuItem,
	Stack,
	Typography
} from '@mui/material';
import { useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CustomSelect } from '../../../components/custom-select';
import { CircularButton } from '../../../components/sidebar';
import { CustomTextField } from '../../../components/sidebar-items';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave, StyledSelect } from '../SettingsMenus';

export const Attachments = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		store_attachments: settingsData.store_attachments.value,
		agent_max_file_size: settingsData.agent_max_file_size.value,
		// login_required: settingsData.login_required.value,
		s3_bucket_name: settingsData.s3_bucket_name.value,
		s3_bucket_region: settingsData.s3_bucket_region.value,
		s3_access_key: settingsData.s3_access_key.value,
		s3_secret_access_key: settingsData.s3_secret_access_key.value
	});
	const [fileSize, setFileSize] = useState({
		agent_file_size_number: parseInt(settingsData.agent_max_file_size.value) >= 1e6 ? parseInt(settingsData.agent_max_file_size.value) / 1e6 : parseInt(settingsData.agent_max_file_size.value) / 1000,
		agent_file_size_unit: parseInt(settingsData.agent_max_file_size.value) >= 1e6 ? 'MB' : 'kB'
	})

	const handleChange = event => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});

		setLoading(false);
	};

	const handleFileSizeChange = event => {
		if(event.target.name === 'agent_file_size_number') {
			setFormState({
				...formState,
				['agent_max_file_size']: fileSize.agent_file_size_unit === 'MB' ? (event.target.value * 1e6).toString() : (event.target.value * 1000).toString()
			})

			setLoading(false);
		} else if(event.target.name === 'agent_file_size_unit') {
			if(fileSize.agent_file_size_unit === 'MB' && event.target.value === 'kB') {
				setFormState({
					...formState,
					['agent_max_file_size']: (parseInt(formState.agent_max_file_size) / 1000).toString()
				})

				setLoading(false);
			} else if(fileSize.agent_file_size_unit === 'kB' && event.target.value === 'MB') {
				setFormState({
					...formState,
					['agent_max_file_size']: (parseInt(formState.agent_max_file_size) * 1000).toString()
				})

				setLoading(false);
			}
		}

		setFileSize({
			...fileSize,
			[event.target.name]: event.target.value
		})
	}

	const handleCheckBox = event => {

		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);

	};

	const storageOptions = [{ label: 'AWS S3', value: 's3' }]
	const customStorageOptions = {
		's3': [
			{ label: 'S3 Bucket Name', name: 's3_bucket_name' },
			{ label: 'S3 Bucket Region', name: 's3_bucket_region' },
			{ label: 'S3 Bucket Access Key', name: 's3_access_key', type: 'hidden' },
			{ label: 'S3 Bucket Secret Access Key', name: 's3_secret_access_key', type: 'hidden' }
		]
	}

	return (
		<Box
			p={3}
			maxWidth={600}
			sx={{ display: 'flex', flexDirection: 'column' }}
		>
			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mb: 1.5 }}
			>
				Store Attachments
			</Typography>

			<CustomSelect
				label={'Storage Backend'}
				onChange={handleChange}
				value={formState.store_attachments}
				name="store_attachments"
				options={storageOptions}
				sx={{ width: '200px', mb: 2 }}
			/>

			<Stack>
				{
					customStorageOptions[formState.store_attachments]?.map((field) => (
						field.type === 'hidden' ?
						<HiddenInput key={field.name} label={field.label} name={field.name} value={formState[field.name]} sx={{ width: 400, mb: 2 }} onChange={handleChange} />
						:
						<CustomFilledInput key={field.name} label={field.label} name={field.name} value={formState[field.name]} sx={{ width: 400, mb: 2 }} onChange={handleChange} />
					))
				}
			</Stack>


			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 1, mb: 1.5 }}
			>
				Agent Maximum File Size
			</Typography>

			<FormControl>
				<Stack direction='row' spacing={2} alignItems='center'>
					<CustomTextField
						type='number'
						name='agent_file_size_number'
						value={fileSize.agent_file_size_number}
						onChange={handleFileSizeChange}
						label="File Size"
						variant="filled"
						mb={2}
						InputProps={{
							inputProps: { min: 0 }
							}}
						sx={{
							width: '50%',
							'& .MuiInputBase-root': {
								borderWidth: 1.5,
								fontWeight: 500,
							},
						}}
					/>

					<StyledSelect name='agent_file_size_unit' value={fileSize.agent_file_size_unit} onChange={handleFileSizeChange} sx={{width: '70px', mb: 1.5}}>
						<MenuItem value='kB'>kB</MenuItem>
						<MenuItem value='MB'>MB</MenuItem>
					</StyledSelect>
				</Stack>

			</FormControl>

			{/* <Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
			>
				Login Required
			</Typography>

			<FormControlLabel
				name="login_required"
				control={
					<Checkbox
						checked={formState.login_required === 'on' ? true : false}
						onChange={handleCheckBox}
					/>
				}
				label={
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 500 }}
					>
						Require login to view any attachments
					</Typography>
				}
			/> */}

			<CircularButton
				sx={{ py: 2, px: 6, mt: 3, width: 250 }}
				onClick={() => {
					handleSave(
						formState,
						setLoading,
						setCircleLoading,
						settingsData,
						updateSettings,
						refreshSettings
					)
				}
				}
				disabled={loading || circleLoading}
			>
				{circleLoading ? (
					<CircularProgress
						size={22}
						thickness={5}
						sx={{ color: '#FFF' }}
					/>
				) : (
					'Save Changes'
				)}
			</CircularButton>

		</Box>
	);
};

const HiddenInput = ({
	label,
	name,
	value,
	onChange,
	...props
}) => {
	const { ...otherProps } = props

	const [editMode, setEditMode] = useState(false)
	
	const maskValue = (text) => {
		if (!text || text.length <= 4) return text;
		return "•".repeat(text.length - 4) + text.slice(-4);
	};
	
	const onEditChange = (e) => {
		if (!editMode) {
			setEditMode(true)
			e.target.value = ''
		}
		onChange(e)
	}

	return (
		<CustomFilledInput label={label} name={name} value={editMode ? value : maskValue(value)} onChange={onEditChange} {...otherProps} />
	)
}

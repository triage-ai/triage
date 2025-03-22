import { Avatar, Box, CircularProgress, Stack, Tab, Typography } from '@mui/material';
import { UserRound } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useUserBackend } from '../../hooks/useUserBackend';
import { StyledTabs } from '../settings/SettingsMenus';

const Header = ({ headers, components }) => {
	// const [menuState, setMenuState] = useState(headers[0].id);
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// const handleMenuChange = newMenuState => {
	// 	setMenuState(newMenuState);
	// };

	return (
		<Box>
			{/* Tab Bar */}
			<Box
				sx={{
					mb: 4,
					ml: 4.2,
					justifyContent: 'center',
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant='fullWidth'
					scrollButtons='auto'
					sx={{
						position: 'relative',
						width: '100%',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: '100%',
							height: '2px',
							background: '#E5EFE9',
							zIndex: -1,
						},
					}}
				>
					{headers.map((header, idx) => (
						<Tab key={idx} label={header.label} sx={{ textTransform: 'none', p: 0, mr: 5 }} />
					))}
				</StyledTabs>
			</Box>

			{/* Tab Content */}
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</WhiteContainer>
		</Box>
	);
};

const profileSave = async (formData, profileData, updateUserProfile, refreshUser, setLoading, setCircleLoading) => {
	let updates = { ...profileData };
	try {
		Object.entries(formData).forEach((update) => {
			updates[update[0]] = update[1];
		});
		setCircleLoading(true);
		await updateUserProfile(updates).then((res) => {
			refreshUser(res.data);
		});
		setCircleLoading(false);
		setLoading(true);
	} catch (error) {
		console.error('Error updating profile:  ', error);
	}
};

// const profileSavePref = async (preferences, profileData, updateUser, refreshUser, setLoading, setCircleLoading) => {
// 	try {
// 		let updates = { ...profileData };
// 		updates['preferences'] = preferences;
// 		setCircleLoading(true);
// 		await updateUser(updates)
// 			.then(res => {
// 				refreshUser(res.data)
// 			});
// 		setCircleLoading(false);
// 		setLoading(true);
// 	} catch (error) {
// 		console.error('Error updating profile:  ', error);
// 	}
// };

export const UserProfile = () => {
	const headers = [
		{ id: 1, label: 'Account' },
	];
	const [components, setComponents] = useState([]);
	const { userAuthState } = useContext(AuthContext);
	const { getUserById } = useUserBackend();

	const [profileData, setProfileData] = useState({});

	useEffect(() => {
		refreshUser();
	}, []);


	const refreshUser = (user = null) => {
		if (user) {
			setProfileData({ ...profileData, ...user });
		} else {
			getUserById(userAuthState.user_id).then((res) => {
				setProfileData(res.data);
			});
		}
	};

	useEffect(() => {
		setComponents([<Account profileData={profileData} refreshUser={refreshUser} />]);
	}, [profileData]);

	return <Header headers={headers} components={components} />;
};

const Account = ({ refreshUser, profileData }) => {
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const { updateUserProfile } = useUserBackend();
	const [formData, setFormData] = useState({});

	useEffect(() => {
		setFormData({
			firstname: profileData.firstname || '',
			lastname: profileData.lastname || '',
			email: profileData.email || '',
			// default_2fa: ,
		});
	}, [profileData]);

	const handleChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	return (
		<Box>
			{Object.keys(formData).length !== 0 && (
				<>
					<Stack spacing={5} pb={4}>
						<Stack alignItems='center'>
							<Avatar sx={{ width: 200, height: 200 }} variant='rounded'>
								<UserRound size={120} />
							</Avatar>
						</Stack>

						<Stack spacing={2}>
							<Stack direction='row' spacing={2} alignItems='center'>
								<Typography variant='subtitle1' pr={14}>
									Name:
								</Typography>
								<CustomFilledInput label='First Name' name='firstname' value={formData.firstname} onChange={handleChange} />

								<CustomFilledInput label='Last Name' name='lastname' value={formData.lastname} onChange={handleChange} />
							</Stack>

							<Stack direction='row' spacing={2} alignItems='center'>
								<Typography variant='subtitle1' pr={14.7}>
									Email:
								</Typography>
								<CustomFilledInput label='Email' name='email' sx={{ width: 430 }} value={formData.email} onChange={handleChange} />
							</Stack>
						</Stack>
					</Stack>

					{/* <Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='subtitle1' pr={24.2}>Default 2FA:</Typography>
					<StyledSelect 
						name='default_2FA' 
						// value={formData.default_2fa} 
						onChange={handleChange}
						sx={{width: 435}}
					>
						<MenuItem value='Disable'>Disable</MenuItem>
						<MenuItem value='Email'>Email</MenuItem>
					</StyledSelect>
				</Stack> */}

					<CircularButton
						sx={{ py: 2, px: 6, width: 250 }}
						onClick={() => profileSave(formData, profileData, updateUserProfile, refreshUser, setLoading, setCircleLoading)}
						disabled={loading || circleLoading}
					>
						{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
					</CircularButton>
				</>
			)}
		</Box>
	);
};

// const Preferences = () => {
// 	return (
// 		<Stack maxWidth={455} alignItems='center'>
// 			<Typography variant='subtitle1' width={455}>
// 				user preference
// 			</Typography>
// 		</Stack>
// 	);
// };

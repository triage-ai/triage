import { Avatar, Box, CircularProgress, MenuItem, Stack, Tab, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import { Settings2, UserRound } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { Layout } from '../../components/layout';
import { extensions, RichTextEditorBox } from '../../components/rich-text-editor';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useAgentBackend } from '../../hooks/useAgentBackend';
import { StyledSelect, StyledTabs } from '../settings/SettingsMenus';

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
					display: 'flex',
					mb: 4,
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant='scrollable'
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

const profileSave = async (formData, profileData, updateAgent, refreshAgent, setLoading, setCircleLoading) => {
	let updates = { ...profileData };
	try {
		Object.entries(formData).forEach((update) => {
			updates[update[0]] = update[1];
		});
		setCircleLoading(true);
		await updateAgent(updates)
			.then(res => {
				refreshAgent(res.data)
			});
		setCircleLoading(false);
		setLoading(true);
	} catch (error) {
		console.error('Error updating profile:  ', error);
	}
};

const profileSaveSig = async (signature, profileData, updateAgent, refreshAgent, setLoading, setCircleLoading) => {
	try {
		let updates = { ...profileData };
		updates['signature'] = signature;
		setCircleLoading(true);
		await updateAgent(updates)
			.then(res => {
				refreshAgent(res.data)
			});
		setCircleLoading(false);
		setLoading(true);
	} catch (error) {
		console.error('Error updating profile:  ', error);
	}
};

const profileSavePref = async (setPreferences, preferences, profileData, updateAgent, refreshAgent, setLoading, setCircleLoading) => {
	try {
		setPreferences(JSON.parse(preferences))
		let updates = { ...profileData };
		updates['preferences'] = preferences;
		setCircleLoading(true);
		await updateAgent(updates)
			.then(res => {
				refreshAgent(res.data)
			});
		setCircleLoading(false);
		setLoading(true);
	} catch (error) {
		console.error('Error updating profile:  ', error);
	}
};

const clearEditor = (editor) => {
	editor.commands.setContent('');
};

export const Profile = () => {
	const headers = [
		{ id: 1, label: 'Account' },
		{ id: 2, label: 'Preferences' },
		{ id: 3, label: 'Signature' },
	];
	const [components, setComponents] = useState([]);
	const { agentAuthState } = useContext(AuthContext);
	const { getAgentById } = useAgentBackend();

	const [profileData, setProfileData] = useState({});

	useEffect(() => {
		refreshAgent()
	}, []);

	const refreshAgent = (agent = null) => {
		if (agent) {
			setProfileData({ ...profileData, ...agent });
		}
		else {
			getAgentById(agentAuthState.agent_id).then((res) => {
				setProfileData(res.data);
			});
		}
	}

	useEffect(() => {
		setComponents([<Account profileData={profileData} refreshAgent={refreshAgent} />, <Preferences profileData={profileData} refreshAgent={refreshAgent} />, <Signature profileData={profileData} refreshAgent={refreshAgent} />]);
	}, [profileData]);

	return (
		<Layout
			title={'My Profile'}
			subtitle={'Edit your profile'}
			buttonInfo={{
				label: 'Edit Profile',
				icon: <Settings2 size={20} />,
				hidden: false,
			}}
		>
			<Header headers={headers} components={components} />
		</Layout>
	);
};

const Account = ({ refreshAgent, profileData }) => {
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const { updateAgent } = useAgentBackend();
	const [formData, setFormData] = useState({});

	useEffect(() => {
		setFormData({
			firstname: profileData.firstname || '',
			lastname: profileData.lastname || '',
			email: profileData.email || '',
			phone: profileData.phone || '',
			username: profileData.username || '',
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
					<Stack direction='row' spacing={5}>
						<Avatar sx={{ width: 200, height: 200 }} variant='rounded'>
							<UserRound size={120} />
						</Avatar>

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

							<Stack direction='row' spacing={2} alignItems='center'>
								<Typography variant='subtitle1' pr={6}>
									Phone Number:
								</Typography>
								<CustomFilledInput label='Phone Number' name='phone' sx={{ width: 430 }} value={formData.phone} onChange={handleChange} />
							</Stack>
						</Stack>
					</Stack>
					<Typography variant='h4' pt={6} pb={2}>
						Authentication
					</Typography>

					<Stack spacing={2} width={800} pb={4}>
						<Stack direction='row' spacing={2} alignItems='center'>
							<Typography variant='subtitle1' pr={25}>
								Username:
							</Typography>
							<CustomFilledInput label='Username' name='username' sx={{ width: 430 }} value={formData.username} onChange={handleChange} />
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
					</Stack>

					<CircularButton
						sx={{ py: 2, px: 6, width: 250 }}
						onClick={() => profileSave(formData, profileData, updateAgent, refreshAgent, setLoading, setCircleLoading)}
						disabled={loading || circleLoading}
					>
						{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
					</CircularButton>
				</>
			)}
		</Box>
	);
};

const Preferences = ({ refreshAgent, profileData }) => {
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const { setPreferences } = useContext(AuthContext);
	const { updateAgent } = useAgentBackend();
	const { formattedQueues, refreshQueues } = useData()
	const [formData, setFormData] = useState({
		agent_default_page_size: profileData.default_preferences.agent_default_page_size,
		default_from_name: profileData.default_preferences.default_from_name,
		agent_default_ticket_queue: profileData.default_preferences.agent_default_ticket_queue,
		default_signature: profileData.default_preferences.default_signature,
		// editor_spacing: profileData.default_preferences.editor_spacing,
		preferences: profileData.preferences,
	});

	const handleChange = (entry) => {
		let preferences = JSON.parse(formData.preferences)
		preferences[entry.target.name] = entry.target.value
		preferences = JSON.stringify(preferences)
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
			['preferences']: preferences
		});

		setLoading(false);
	};

	useEffect(() => {
		refreshQueues()
	}, [])

	return (
		<Box>
			<Stack direction='row' spacing={2} alignItems='center' pb={4}>
				<Typography variant='subtitle1' pr={20.8}>
					Maximum Page Size:
				</Typography>
				<StyledSelect
					name='agent_default_page_size'
					value={formData.agent_default_page_size}
					onChange={handleChange}
					sx={{ width: 435 }}
				>
					<MenuItem value='10'>10</MenuItem>
					<MenuItem value='25'>25</MenuItem>
					<MenuItem value='50'>50</MenuItem>
					<MenuItem value='100'>100</MenuItem>
				</StyledSelect>
				<Typography variant='subtitle1'>records per page</Typography>
			</Stack>

			<Stack direction='row' spacing={2} alignItems='center' pb={4}>
				<Typography variant='subtitle1' pr={21.3}>
					Default From Name:
				</Typography>
				<StyledSelect
					name='default_from_name'
					value={formData.default_from_name}
					onChange={handleChange}
					sx={{ width: 435 }}
				>
					<MenuItem value='Email Address Name'>Email Address Name</MenuItem>
					<MenuItem value='Department Name'>Department Name</MenuItem>
					<MenuItem value='My Name'>My Name</MenuItem>
				</StyledSelect>
			</Stack>

			<Stack direction='row' spacing={2} alignItems='center' pb={4}>
				<Typography variant='subtitle1' pr={20}>
					Default Ticket Queue:
				</Typography>
				<StyledSelect
					name='agent_default_ticket_queue'
					value={formattedQueues.length !== 0 ? formData.agent_default_ticket_queue : 0}
					onChange={handleChange}
					sx={{ width: 435 }}
					renderValue={(item) => (
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							{formattedQueues.find(x => x.value === item)?.label ?? 'System Default'}
						</Typography>
					)}
				>
					<MenuItem value={0} key={0}>System Default</MenuItem>
					{formattedQueues.map((queue) => (
						<MenuItem value={queue.value} key={queue.value}>{queue.label}</MenuItem>
					))}
				</StyledSelect>
			</Stack>

			<Stack direction='row' spacing={2} alignItems='center' pb={4}>
				<Typography variant='subtitle1' pr={23}>
					Default Signature:
				</Typography>
				<StyledSelect
					name='default_signature'
					value={formData.default_signature}
					onChange={handleChange}
					sx={{ width: 435 }}
				>
					<MenuItem value='None'>None</MenuItem>
					<MenuItem value='My Signature'>My Signature</MenuItem>
					<MenuItem value='Department Signature'>Department Signature</MenuItem>
				</StyledSelect>
			</Stack>

			{/* <Stack direction='row' spacing={2} alignItems='center' pb={4}>
				<Typography variant='subtitle1' pr={25.8}>
					Editor Spacing:
				</Typography>
				<StyledSelect
					name='editor_spacing'
					value={formData.editor_spacing}
					onChange={handleChange}
					sx={{ width: 435 }}
				>
					<MenuItem value='Single'>Single</MenuItem>
					<MenuItem value='Double'>Double</MenuItem>
				</StyledSelect>
			</Stack> */}

			<CircularButton
				sx={{ py: 2, px: 6, width: 250 }}
				onClick={() => profileSavePref(setPreferences, formData.preferences, profileData, updateAgent, refreshAgent, setLoading, setCircleLoading)}
				disabled={loading || circleLoading}
			>
				{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
			</CircularButton>
		</Box>
	);
};

const Signature = ({ refreshAgent, profileData }) => {
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const { updateAgent } = useAgentBackend();
	const firstUpdate = useRef(true);

	// useEffect(() => {
	// 	setFormData({
	// 		signature: profileData.signature || '',
	// 	})
	// }, [profileData])

	const editor = useEditor({
		extensions: extensions,
		content: profileData.signature,
	});

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		if (loading) {
			setLoading(false);
		}
	}, [editor.getHTML()]);

	return (
		<Box>
			<Typography variant='h4'>Signature:</Typography>
			<Typography variant='subtitle1' pb={2}>
				Optional signature to be included on outgoing emails. Signature will also be a choice on ticket replies.
			</Typography>

			<Box sx={{ maxWidth: 1000 }}>
				<RichTextEditorBox editor={editor} />
			</Box>

			<Typography sx={{ pb: 6 }}></Typography>

			<Stack direction='row' spacing={10} width={800}>
				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => profileSaveSig(editor.getHTML(), profileData, updateAgent, refreshAgent, setLoading, setCircleLoading)}
					disabled={loading || circleLoading}
				>
					Save Changes
				</CircularButton>

				<CircularButton
					sx={{
						py: 2,
						px: 6,
						width: 250,
						backgroundColor: '#808080',
						'&:hover': {
							backgroundColor: '#808080',
						},
					}}
					onClick={() => clearEditor(editor)}
				>
					Reset
				</CircularButton>
			</Stack>
		</Box>
	);
};

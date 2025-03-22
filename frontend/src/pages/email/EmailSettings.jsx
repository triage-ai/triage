import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { MailPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomSelect } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { useData } from '../../context/DataContext';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
// import { useTemplateBackend } from '../../hooks/useTemplateBackend';

const EmailSelect = ({ handleInputChange, value, label, name }) => {
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

// const TemplateSelect = ({ handleInputChange, value, label, name }) => {
// 	const { formattedTemplates, refreshTemplates } = useData();

// 	useEffect(() => {
// 		refreshTemplates();
// 	}, []);

// 	return (
// 		<>
// 			<CustomSelect label={label} onChange={handleInputChange} value={value} name={name} mb={2} fullWidth options={formattedTemplates} />
// 		</>
// 	);
// };

const handleSave = (settingsFormData, setLoading, setCircleLoading, UpdateSettings, refreshSettings, settings) => {
	try {
		let temp = settings;
		temp.default_alert_email.value = settingsFormData.default_alert_email.toString();
		temp.default_system_email.value = settingsFormData.default_system_email.toString();
		temp.default_admin_email.value = settingsFormData.default_admin_email.toString();

		let settings_update = [];
		settings_update.push(temp.default_system_email, temp.default_alert_email, temp.default_admin_email);

		settings_update = settings_update.map((item) => ({
			...item,
			value: item.value === '' ? null : item.value,
		}));
		// let template_map = {};

		// Object.entries(templateFormData).forEach((value) => {
		// 	if (value[1] !== '') {
		// 		template_map[value[1]] = value[0];
		// 	}
		// });

		// let template_updates = [];
		// let template_update = [...templates];

		// template_update.map((template) => {
		// 	if (template.template_name in template_map) {
		// 		template.code_name = template_map[template.template_name];
		// 		template_updates.push(template);
		// 	}
		// });

		setCircleLoading(true);
		UpdateSettings(settings_update)
			.then((res) => {
				refreshSettings();
			})
			.catch((err) => {
				console.error(err);
			});

		// bulkUpdateTemplate(template_updates)
		// 	.then((res) => {
		// 		refreshTemplates();
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});

		setCircleLoading(false);
		setLoading(true);
	} catch (err) {
		console.error('Error with saving settings:', err);
	}
};

export const EmailSettings = () => {
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	const { settings, refreshSettings, emails, refreshEmails } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
	const [validForm, setValidForm] = useState(false);
	const [settingsFormData, settingsSetFormData] = useState({
		default_system_email: '',
		default_alert_email: '',
		default_admin_email: '',
	});


	useEffect(() => {
		refreshSettings();
		refreshEmails();
	}, []);

	useEffect(() => {
		settingsSetFormData({
			default_system_email: settings?.default_system_email?.value ?? '',
			default_alert_email: settings?.default_alert_email?.value ?? '',
			default_admin_email: settings?.default_admin_email?.value ?? '',
		});
	}, [settings]);


	const handleChangeSettings = (entry) => {
		settingsSetFormData({
			...settingsFormData,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};



	return (
		<Layout
			title={'Email Settings'}
			subtitle={'Email settings and options'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
		>
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>
					<Typography variant='h4' pb={2}>
						Email Selection
					</Typography>

					<Stack sx={{ maxWidth: 400, pb: 2 }}>
						<EmailSelect
							handleInputChange={handleChangeSettings}
							value={settingsFormData?.default_system_email}
							name='default_system_email'
							label='Default System Email'
						/>

						<EmailSelect
							handleInputChange={handleChangeSettings}
							value={settingsFormData?.default_alert_email}
							name='default_alert_email'
							label='Default Alert Email'
						/>

						<EmailSelect handleInputChange={handleChangeSettings} value={settingsFormData?.default_admin_email} name='default_admin_email' label='Admin Email' />
					</Stack>


					<CircularButton
						sx={{ py: 2, px: 6, width: 250 }}
						onClick={() => handleSave(settingsFormData, setLoading, setCircleLoading, updateSettings, refreshSettings, settings)}
						disabled={loading || circleLoading}
					>
						{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
					</CircularButton>

					{validForm && (
						<Typography variant='subtitle1' color='red'>
							Error: Cannot select the same template for multiple alert scenarios
						</Typography>
					)}
				</Box>
			</WhiteContainer>
		</Layout>
	);
};

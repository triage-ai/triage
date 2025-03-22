import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { extensions, RichTextEditorBox } from '../../../components/rich-text-editor';
import { CircularButton } from '../../../components/sidebar';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';


export const AddTemplate = ({ handleCreated, handleEdited, editTemplate }) => {
	const [isFormValid, setIsFormValid] = useState(false);
	const { updateTemplate, createTemplate } = useTemplateBackend();
	const [formData, setFormData] = useState({
		code_name: '',
		subject: '',
		body: '',
		notes: '',
		active: '',
	})

	const validateTemplate = () => {
		return formData.subject && formData.body
	}

	useEffect(() => {
		if (editTemplate) {
			setFormData({
				code_name: editTemplate.code_name,
				subject: editTemplate.subject,
				body: editTemplate.body,
				notes: editTemplate.notes,
				active: editTemplate.active === 1 ? 'on' : 'off'
			})
			editor.commands.setContent(editTemplate.body)
		}
	}, [editTemplate])

	const handleChange = (entry) => {
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
	};

	const handleCheckBox = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

	};


	const handleAction = () => {
		if (editTemplate) {
			// formData['body'] = editor.getHTML();
			try {
				let updates = { ...editTemplate }
				formData.active = formData.active === 'on' ? 1 : 0
				Object.entries(formData).forEach((update) => {
					updates[update[0]] = update[1];
				});
				updateTemplate(updates).then(res => {
					handleEdited();
				})
					.catch(err => console.error(err))
			} catch (error) {
				console.error(error)
			}
		} else {
			try {
				// formData['body'] = editor.getHTML();
				createTemplate(formData).then(res => {
					handleCreated();
				})
					.catch(err => console.error(err))
			} catch (error) {
				console.error(error)
			}
		}
	}

	const editor = useEditor({
		extensions: extensions,
		content: formData?.body,
		onUpdate({ editor }) {
			setFormData(p => ({
				...p,
				body: editor.getHTML()
			}))
		}
	});

	useEffect(() => {
		const isValid = validateTemplate();
		setIsFormValid(isValid);
	}, [formData]);

	const transformString = (inputString) => {
		const words = inputString.split('_');
		return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ');
	}


	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				Edit template
			</Typography>

			<Typography variant='subtitle2'>
				Edit template information.
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
				<Typography variant='h2' sx={{ fontWeight: 600, mb: 2 }}>
					{transformString(formData.code_name)}
				</Typography>

				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Required information
				</Typography>


				<CustomFilledInput
					label='Email Subject'
					onChange={handleChange}
					value={formData?.subject}
					name='subject'
					mb={2}
					fullWidth
				/>

				<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
					Email Body:
				</Typography>

				<Box sx={{ maxWidth: 410.8, pb: 4 }}>
					<RichTextEditorBox editor={editor} />
				</Box>


				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Optional information
				</Typography>

				<CustomFilledInput
					label='Internal Notes'
					onChange={handleChange}
					value={formData?.notes}
					name='notes'
					fullWidth
					mb={2}
				/>

				<FormControlLabel
					name='active'
					control={<Checkbox checked={formData.active === 'on' ? true : false} onChange={handleCheckBox} />}
					label={
						<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
							Enable Template
						</Typography>
					}
				/>


			</Box>

			<Stack
				direction='row'
				// spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={handleAction}
					disabled={!isFormValid}
				>
					Edit template
				</CircularButton>
			</Stack>
		</>
	);
};

import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Check, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { extensions, RichTextEditorBox } from '../../../components/rich-text-editor';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';


export const TemplateDetail = ({ templateInfo, closeDrawer, openEdit }) => {
    const [template, setTemplate] = useState(null)
    const { getTemplateById } = useTemplateBackend();


	const openEditModal = (event, template) => {
		closeDrawer();
		openEdit(event, template, 'edit');
	};


    useEffect(() => {
		if (templateInfo) {
			getTemplateById(templateInfo.template_id)
				.then(response => response.data)
				.then(template => {
					setTemplate(template);
                    editor.commands.setContent(template.body)
				})
		}
	}, [templateInfo]);

    const editor = useEditor({
		extensions: extensions,
		content: template?.body,
        editable: false,
	});

    const transformString = (inputString) => {
		const words = inputString.split('_');
		return words[0].charAt(0).toUpperCase() +  words[0].slice(1) + ' ' + words.slice(1).join(' ');
	}

	return (
        <Box sx={{ height: '100%', bgcolor: '#FFF' }}>
                <Box sx={{ height: '100%', padding: '28px', position: 'relative'  }}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // marginBottom: '10px',
                            
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Stack direction='row'>
                                <Typography variant='h2'>{template ? transformString(template.code_name) : ''}</Typography>
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={(event) => openEditModal(event, template)}>
                                <Pencil color='#22874E' size={16} />
                            </IconButton>

                            <Box sx={{ borderLeft: '1.5px solid #E5EFE9', height: '24px' }} ml={1} mr={1} />

                            <IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={closeDrawer}>
                                <X color='#6E7772' strokeWidth={1.5} />
                            </IconButton>
                        </Box>

                    </Box>

                    
                    <Typography variant='subtitle1' pb={2}>
                        Email Subject and Body
                    </Typography>

                    <CustomFilledInput label='Subject' name='subject' sx={{ width: 430, pb: 4 }} value={template?.subject} disabled/>

                    <Box sx={{ maxWidth: 1000, pb: 4 }}>
                        <RichTextEditorBox editor={editor} />
                    </Box>

                    <CustomFilledInput label='Notes' name='notes' sx={{ width: 430, pb: 4 }} value={template?.notes} disabled/>

                       
                </Box>
        </Box>
	);
};

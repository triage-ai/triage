import { Box, styled } from '@mui/material';
import {
	LinkBubbleMenuHandler,
	MenuButtonAddTable,
	MenuButtonBlockquote,
	MenuButtonBold,
	MenuButtonBulletedList,
	MenuButtonCode,
	MenuButtonCodeBlock,
	MenuButtonItalic,
	MenuButtonOrderedList,
	MenuButtonStrikethrough,
	MenuControlsContainer,
	MenuDivider,
	RichTextEditorProvider,
	RichTextField,
	TableBubbleMenu,
	TableImproved,
} from 'mui-tiptap';

import StarterKit from '@tiptap/starter-kit';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useRef } from 'react';
import { useEditor } from '@tiptap/react';

export const extensions = [
	TableImproved.configure({
		resizable: true,
	}),
	TableRow,
	TableHeader,
	TableCell,
	// LinkBubbleMenuHandler,
	StarterKit
];



export const RichTextEditorBox = ({ editor, children, footer, PostButton }) => (
	<Box>
		<RichTextEditorProvider editor={editor}>
			<StyledRichTextField
				RichTextContentProps={{
					className: 'App-rich-text-field',
				}}
				variant='outlined'
				controls={<MenuControlsContainer>
					<Box display='flex' flexDirection='row' alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
						<Box display='flex' flexDirection='row' alignItems={'center'} gap={'2.4px'}>
							<MenuButtonBold />
							<MenuButtonItalic />
							<MenuButtonStrikethrough />
							<MenuDivider />
							<MenuButtonOrderedList />
							<MenuButtonBulletedList />
							<MenuDivider />
							<MenuButtonBlockquote />
							<MenuDivider />
							<MenuButtonCode />
							<MenuButtonCodeBlock />
							{/* <MenuDivider /> */}
							{/* <MenuButtonAddTable /> */}
						</Box>
						{PostButton}
					</Box>
				</MenuControlsContainer>}
				footer={footer}
			>{children}</StyledRichTextField>
			<TableBubbleMenu />
		</RichTextEditorProvider>
	</Box>
);

const StyledRichTextField = styled(RichTextField)(({ theme }) => ({
	'& .MuiTiptap-FieldContainer-notchedOutline': {
		border: '1.5px solid #E5EFE9',
		transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
		borderRadius: 8,
	},
	'&.MuiTiptap-FieldContainer-root:hover .MuiTiptap-FieldContainer-notchedOutline': {
		backgroundColor: 'transparent',
		border: '1.5px solid #22874E',
	},
	'&.MuiTiptap-FieldContainer-focused .MuiTiptap-FieldContainer-notchedOutline': {
		border: '1.5px solid #22874E',
	},
	'.App-rich-text-field': {
		maxHeight: '200px',
		overflowY: 'auto',
	},
	'& .ProseMirror': {
		height: '100%',
		'& h1, & h2, & h3, & h4, & h5, & h6': {},
		'& p': {
			wordBreak: 'break-all',
			fontSize: 'small',
			fontWeight: 500,
		},
	},
}));

import { Box, styled } from '@mui/material';
import {
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
	TableImproved
} from 'mui-tiptap';

import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import StarterKit from '@tiptap/starter-kit';

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



export const RichTextEditorBox = ({ editor, children, footer, onSend }) => (
	<Box
		sx={{
			display: 'flex',
			flexDirection: 'column',

		}}
	>
		<RichTextEditorProvider editor={editor}>
			<StyledRichTextField
				MenuBarProps={{
					className: 'App-menu-bar',
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
	'& .ProseMirror': {
		minHeight: '100px',
		'& h1, & h2, & h3, & h4, & h5, & h6': {},
		'& p': {
			wordBreak: 'break-all',
			fontSize: 'small',
			fontWeight: 500,
		},
	},
}));

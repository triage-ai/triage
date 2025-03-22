import { Box, Link, Stack, Typography } from '@mui/material';
import { Code, FileIcon, FileText, FileVideo, FolderArchive, Image } from 'lucide-react';
import humanFileSize from '../../functions/file-size-formatter';

export const FileCard = ({ file }) => {

	const SIZE = 30;

	const icons = {
		'video/mpeg': <FileVideo size={SIZE} color='#6e7772' strokeWidth={1} />,
		'video/mp4': <FileVideo size={SIZE} color='#6e7772' strokeWidth={1} />,
		'text/html': <Code size={SIZE} color='#6e7772' strokeWidth={1} />,
		'text/css': <Code size={SIZE} color='#6e7772' strokeWidth={1} />,
		'image/gif': <Image size={SIZE} color='#6e7772' strokeWidth={1} />,
		'image/jpeg': <Image size={SIZE} color='#6e7772' strokeWidth={1} />,
		'image/png': <Image size={SIZE} color='#6e7772' strokeWidth={1} />,
		'text/plain': <FileText size={SIZE} color='#6e7772' strokeWidth={1} />,
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileText size={SIZE} color='#6e7772' strokeWidth={1} />,
		'application/x-zip-compressed': <FolderArchive size={SIZE} color='#6e7772' strokeWidth={1} />,
		'application/pdf': <FileText size={SIZE} color='#6e7772' strokeWidth={1} />,

	}

	// <ListItem
	// 	key={idx}
	// 	secondaryAction={
	// 		<IconButton edge='end' aria-label='delete' onClick={() => handleDeleteFile(idx)}>
	// 			<X />
	// 		</IconButton>
	// 	}
	// >
	// 	<ListItemAvatar>
	// 		<Avatar>
	// 			<File />
	// 		</Avatar>
	// 	</ListItemAvatar>
	// 	<ListItemText primary={file.name} secondary={humanFileSize(file.size, true, 1)} />
	// </ListItem>

	return (
	// 	<Box
	// 		sx={{
	// 			'&:hover': {
    //   background: "#f00",
    // }
	// 		}}
	// 	>
		<Link 
			href={file.link} 
			target="_blank"
			fontSize='0.65rem'
			rel="noopener"
			color='#000'
			underline='none'
		>
		<Stack 
			direction={'row'}
			px={3}
			py={1}
			borderRadius={3}
			spacing={2}
			alignItems={'center'}
			sx={{
				border: '1.5px solid #E5EFE9',
				transition: (theme) => theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
				'&:hover': {
					border: '1.5px solid #22874E',
				}
			}}
		>
			{icons[file.type] ? icons[file.type] : <FileIcon size={SIZE} color='#6e7772' strokeWidth={1.5} />}
			<Stack>
				<Typography
					noWrap
					sx={{
						fontSize: '0.85rem',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: 2,
						display: 'block',
					}}
					fontWeight={500}
				>
					{file.name}
				</Typography>
				<Typography
					variant="subtitle2"
					sx={{
						fontSize: '0.75rem',
						lineHeight: 1.2,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: 2,
					}}
					>
					{humanFileSize(file.size, true, 1)}
				</Typography>

			</Stack>
		</Stack>
					</Link>
					// </Box>
	)

	// return (
	// 	<Card sx={{ width: '100px' }}>
	// 		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 1, flexDirection: 'column' }}>
	//             {icons[file.type] ? icons[file.type] : <FileIcon size={SIZE} color='#6e7772' strokeWidth={1} />}
	//             <Typography color='#6e7772' fontWeight={SIZE0}>{`.${file.name.split('.').at(-1).toUpperCase()}`}</Typography>
	// 		</Box>

	// 		<CardActions>
	// 			<Stack justifyContent='space-between' direction='column' width={80}>
	// 				<Link href={file.link} target="_blank" fontSize='0.65rem' rel="noopener">
	// 					<Typography
	// 						fontSize='0.65rem'
	// 						noWrap
	// 						sx={{
	// 							overflow: 'hidden',
	// 							textOverflow: 'ellipsis',
	// 							display: '-webkit-box',
	// 							WebkitBoxOrient: 'vertical',
	// 							WebkitLineClamp: 2,
	// 							display: 'block',
	// 						}}
	// 					>
	// 						{file.name}
	// 					</Typography>
	// 				</Link>
	// 				<Typography fontSize='0.65rem'>{humanFileSize(file.size, true, 1)}</Typography>
	// 			</Stack>
	// 		</CardActions>
	// 	</Card>
	// );
};

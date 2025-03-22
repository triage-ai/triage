import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Stack, styled, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CloudUploadIcon, File, Paperclip, Send, TicketX, X } from 'lucide-react';
import { RichTextReadOnly } from 'mui-tiptap';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestHeader } from '../../components/guest-header';
import { GuestSidebar } from '../../components/guest-sidebar';
import { CircularButton } from '../../components/header';
import { AppBarHeight, DrawerContentContainer, DrawerHeader } from '../../components/layout';
import { extensions, RichTextEditorBox } from '../../components/rich-text-editor';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import formatDate from '../../functions/date-formatter';
import humanFileSize from '../../functions/file-size-formatter';
import { useAttachmentBackend } from '../../hooks/useAttachmentBackend';
import { useThreadsBackend } from '../../hooks/useThreadBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { FileCard } from './FileCard';

let localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
dayjs.extend(utc);

const CustomInput = styled('input')({
	opacity: 0,
	position: 'absolute',
	boxSizing: 'border-box',
	bottom: 0,
	left: 0,
	width: '100%',
	height: '60px',
	cursor: 'pointer',
});

const PostButton = ({ handleSubmit, disabled }) => {
	return (
		<Box border={disabled ? '1.5px solid #E5EFE9' : '1.5px solid #5a9ee5'} borderRadius='8px'>
			<IconButton onClick={handleSubmit} disabled={disabled}>
				<Send size={20} />
			</IconButton>
		</Box>
	);
};

export const GuestTicketView = () => {
	const { getTicketByNumberForGuest } = useTicketBackend();
	const { guestAuthState, guestLogout } = useContext(AuthContext);
	const [ticket, setTicket] = useState(null);
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const headers = [
		{ id: 1, label: 'Thread' },
	];
    

	function preProcessTicket(ticket) {
		if (ticket.thread && ticket.thread.events) {
			ticket.thread.events.forEach((event) => {
				let eventData = JSON.parse(event.data);
	
				event.field = eventData.field;
				event.prev_val = eventData.prev_val;
				event.new_val = eventData.new_val;
	
				if (eventData.hasOwnProperty('new_id')) {
					event.prev_id = eventData.prev_id;
					event.new_id = eventData.new_id;
				}
			});
		}
		if (ticket.thread) {
			let events_and_entries = ticket.thread.entries.concat(ticket.thread.events);
			ticket.thread.events_and_entries = events_and_entries.sort(datetime_sort);
		}
		return ticket;
	}
	
	function datetime_sort(a, b) {
		return new Date(a.created).getTime() - new Date(b.created).getTime();
	}
	
	const updateTicket = (newTicket) => {
		newTicket = preProcessTicket(newTicket);
		setTicket(newTicket);
	};
	
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleTicketClose = () => {
        guestLogout();
        navigate("/")
    }

	useEffect(() => {
		setLoading(true);
		if (guestAuthState.isAuth === true) {
			getTicketByNumberForGuest(guestAuthState.ticket_number)
				.then((response) => response.data)
				.then((ticket) => {
					ticket = preProcessTicket(ticket);
					setTicket(ticket);
				})
				.catch((error) => {
					console.error(error);
				});
		}
		setLoading(false);
	}, []);

	return (
		<WhiteContainer noPadding>
			{loading ? (
				<Box
					sx={{
						width: '100%',
						// height: '60vh', // whitecontainer min height
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: '65%',
					}}
				>
					<Skeleton variant='rounded' width={210} height={60} />
					<Skeleton variant='rounded' width={210} height={60} />
					<Skeleton variant='rounded' width={210} height={60} />
				</Box>
			) : !ticket ? (
				<Box
					sx={{
						width: '100%',
						height: '60vh', // whitecontainer min height
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: '65%',
					}}
				>
					<TicketX size={80} />
					<Typography fontWeight={600} variant='h2'>
						Session expired
					</Typography>
					<Typography variant='subtitle2'>Head back to our home page to check a ticket's status or make a new ticket</Typography>
					<CircularButton
						sx={{ mt: 1, padding: 2 }}
						onClick={handleTicketClose}
					>
						Home
					</CircularButton>
				</Box>
			) : (
				<>
					<GuestSidebar ticket={ticket} setTicket={setTicket} preProcessTicket={preProcessTicket} />
					
					<Box sx={{ display: 'flex', background: '#FFF' }}>
						<GuestHeader
							ticket={ticket}
							buttonInfo={{
								label: 'Close Ticket',
								icon: <X size={20} />,
							}}
						/>
						<DrawerContentContainer>
							<DrawerHeader />
							{/* <main
								className="content"
								style={{ height: '100%' }}
								>
								{children}
								</main> */}
							<Box
								sx={{
									height: `calc(100% - ${AppBarHeight})`,
									px: { xs: 2, md: 5 },
									zIndex: '4',
									position: 'relative'
									// padding: 1,
									// overflow: 'hidden',
								}}
							>
								<WhiteContainer noPadding>
									<ThreadView ticket={ticket} updateTicket={updateTicket} />
								</WhiteContainer>
							</Box>
						</DrawerContentContainer>
					</Box>
				</>
			)}
		</WhiteContainer>
	);
};

const ThreadView = ({ ticket, updateTicket }) => {
	const [formData, setFormData] = useState({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
	const [postDisabled, setPostDisabled] = useState(true);
	const [files, setFiles] = useState([]);
	const { defaultSettings } = useData()
	const { createThreadEntryForGuest } = useThreadsBackend();
	const { getPresignedURL } = useAttachmentBackend();
	const { guestAuthState } = useContext(AuthContext);
	const editor = useEditor({
		extensions: extensions,
		content: '',
		onUpdate({ editor }) {
			setFormData((prevFormData) => ({
				...prevFormData,
				body: editor.getHTML(),
			}));
		},
	});

	const getDirection = (agent_id, option1, option2) => {
		let type = 'user';
		if ((agent_id && type === 'agent') || (!agent_id && type !== 'agent')) {
			return option1;
		} else return option2;
	};

	const handleSubmit = async () => {
		const threadEntryCreate = createThreadEntryForGuest;
		let newThreadEntry = { ...formData, thread_id: ticket.thread.thread_id };
		newThreadEntry.user_id = guestAuthState.user_id;
		

		let updatedTicket = { ...ticket };
		if (files.length !== 0) {
			const file_names = files.map((item) => item.name);
			
			getPresignedURL({ attachment_names: file_names })
			.then((res) => {
				if (res.status !== 200) {
					alert('Error with S3 configuration. Attachment will not be added to thread');
					return {};
				} else {
					let presigned_urls = { ...res.data.url_dict };
					return presigned_urls;
				}
			})
			.then(async (presigned_urls) => {
				if (Object.keys(presigned_urls).length === 0) {
					return [];
				} else {
					let attachments = await awsFileUpload(presigned_urls, files);
					return attachments;
				}
			})
			.then(async (attachments) => {
				newThreadEntry = attachments.length !== 0 ? { ...newThreadEntry, attachments: attachments } : newThreadEntry;
				await threadEntryCreate(newThreadEntry)
				.then((response) => {
					updatedTicket.thread.entries.push(response.data);
					editor.commands.setContent('');
					setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
					setFiles([]);
				})
			})
			.then(() => {
				updateTicket(updatedTicket);
			});
		} else {
			threadEntryCreate(newThreadEntry)
			.then((response) => {
				updatedTicket.thread.entries.push(response.data);
				editor.commands.setContent('');
				setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
			})
			.then(() => {
				updateTicket(updatedTicket);
			});
		}
	};

	const awsFileUpload = async (presigned_urls, files) => {
		let attachments = [];
		await Promise.all(
			Object.entries(presigned_urls).map(([fileName, url]) => {
				const file = files.find((f) => f.name === fileName);
				axios.put(url, file, {
					headers: {
						'Content-Type': file.type,
						'Content-Disposition': `inline; filename="${fileName}"`,
					},
				})
				.catch((error) => {
					alert('There is an error with the S3 confirguration. Attachment upload failed and will not be added to the thread.');
				})
				attachments.push({ name: fileName, link: url.split('?')[0], type: file.type, size: file.size, inline: 1});
			})
		);
		return attachments;
	};

	const handleFileUpload = (event) => {
        const length = event.target.files.length;
        let tempArray = [];
        let sizeExceed = false
        for (let i = 0; i < length; i++) {
            if (event.target.files[i].size > Number(defaultSettings.agent_max_file_size.value)) {
                sizeExceed = true
                continue
            }
            tempArray.push(event.target.files[i]);
        }
        setFiles((p) => [...p, ...tempArray]);
        event.target.value = '';

        if (sizeExceed) {
            alert(`One or more files exceed the max upload limit of ${humanFileSize(defaultSettings.agent_max_file_size.value, true)}!`)
        }
    };

	const handleDeleteFile = (idx) => {
		setFiles((p) => [...p.slice(0, idx), ...p.slice(idx + 1)]);
	};

	function getEventText(item) {
		const capitilize = (str) => {
			return str
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
				.join(' ');
		};

		let newValue = item.new_val;
		let prevValue = item.prev_val;

		if (item.field === 'due_date') {
			newValue = newValue ? formatDate(newValue, 'lll') : null;
			prevValue = prevValue ? formatDate(prevValue, 'lll') : null;
		}

		if(item.field === 'overdue') {
			newValue = newValue ? 'True' : 'False';
			prevValue = prevValue ? 'True' : 'False';
		}

		const field = capitilize(item.field.replace('_id', '').replace('_', ' '));

		if (item.type === 'A') {
			return (
				<Typography variant='subtitle2' fontWeight={600} color='#6c757d'>
					{field} set to&nbsp;
					<Typography variant='subtitle2' component='span' fontWeight={600} color='black'>
						{newValue}
					</Typography>
				</Typography>
			);
		} else if (item.type === 'R') {
			return (
				<Typography variant='subtitle2' fontWeight={600} color='#6c757d'>
					{field} unset from&nbsp;
					<Typography variant='subtitle2' component='span' fontWeight={600} color='black'>
						{prevValue}
					</Typography>
				</Typography>
			);
		} else {
			return (
				<Typography
					variant='subtitle2'
					fontWeight={600}
					color='#6c757d'
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						wordBreak: 'break-word',
					}}
				>
					{field} updated from&nbsp;
					<Typography
						variant='subtitle2'
						fontWeight={600}
						component='span'
						sx={{
							color: 'black',
						}}
					>
						{prevValue}
					</Typography>
					&nbsp;to&nbsp;
					<Typography
						variant='subtitle2'
						fontWeight={600}
						component='span'
						sx={{
							color: 'black',
						}}
					>
						{newValue}
					</Typography>
				</Typography>
			);
		}
	}

	useEffect(() => {
		setPostDisabled(editor.isEmpty && files.length === 0);
	}, [formData, files]);


	return (
		<Box sx={{ height: '100%', width: '100%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', position: 'relative' }}>
			<Box sx={{ height: '100%', px: '28px', position: 'relative', overflowY: 'auto', width: '100%' }}>
				<Timeline       
					sx={{
						[`& .${timelineItemClasses.root}:before`]: {
						flex: 0.3,
						padding: 0,
						},
						width: '85%',
					}}
				>
					{ticket.thread.events_and_entries.map((item) =>
						item.entry_id ? (
							<TimelineItem key={'entry' + item.entry_id} sx={{ marginBottom: '24px' }}>
								<TimelineSeparator>
									<TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1 }} />
									<TimelineConnector sx={{ background: '#ecffef' }} />
								</TimelineSeparator>
								<TimelineContent paddingTop={0}>
									<Box>
										<Typography variant='subtitle2' fontWeight={600} color='#1B1D1F' align={getDirection(item.agent_id, 'right', 'left')} sx={{ alignSelf: getDirection(item.agent_id, 'flex-end', 'flex-start')}}>
											{item.subject}
										</Typography>
										<Box
											sx={{
												marginLeft: getDirection(item.agent_id, 'auto', 0),
												width: 'fit-content',
												'& .MuiPaper-rounded': {
													borderRadius: '8px',
												},
												'& .MuiAccordionSummary-root': {
													px: '12px',
													minHeight: 0,
													borderRadius: '8px',
												},
												'& .MuiAccordionSummary-content': {
													my: '12px',
												},
												'& .ProseMirror p': {
													fontSize: 'small',
													fontWeight: 500,
													wordBreak: 'break-word'
												},
											}}
										>
											{item.attachments.length === 0 ? (
												<Box
													sx={{
														padding: '12px',
														border: '1px solid #E5EFE9',
														borderRadius: '8px',
													}}
												>
													<RichTextReadOnly content={item.body} extensions={extensions} />
												</Box>
											) : (
												<Accordion
													disableGutters={true}
													elevation={0}
													sx={{
														border: '1px solid #E5EFE9',
													}}
												>
													<AccordionSummary>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'space-between',
																alignItems: 'start',
																width: '100%',
															}}
														>
															<RichTextReadOnly content={item.body} extensions={extensions} />
															<Stack direction='row' ml={0.5} spacing={0.5} alignItems='center' color={'grey'}>
																<Typography fontSize='small'>{item.attachments.length}</Typography>
																<Paperclip size={15} />
															</Stack>
														</Box>
													</AccordionSummary>
													<AccordionDetails>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
																gap: 1,
															}}
														>
															{item.attachments.map((attachment, idx) => (
																<FileCard file={attachment} key={idx} />
															))}
														</Box>
													</AccordionDetails>
												</Accordion>
											)}
										</Box>
										<Box textAlign={getDirection(item.agent_id, 'right', 'left')}>
											<Typography variant='caption' fontWeight={500}>
												<span className='text-muted'>By</span> {item.owner}
												<span className='text-muted'> at {dayjs.utc(item.created).local().format('lll')}</span>
											</Typography>
										</Box>
									</Box>
								</TimelineContent>
							</TimelineItem>
						) : (
							<TimelineItem key={'event' + item.event_id} sx={{ marginBottom: '24px' }}>
								<TimelineSeparator>
									<TimelineDot sx={{ background: '#2FC76E', borderRadius: '3px', boxShadow: 'none', zIndex: 1 }}></TimelineDot>
								</TimelineSeparator>
								<TimelineContent paddingTop={0}>
									<Box>
										<Box width={'fit-content'} sx={{ marginLeft: item.agent_id ? 'auto' : 0 }}>
											{getEventText(item)}
										</Box>
										<Box width={'fit-content'} sx={{ marginLeft: item.agent_id ? 'auto' : 0 }}>
											<Typography variant='caption' fontWeight={500}>
												<span className='text-muted'>By</span> {item.owner}&nbsp;
												<span className='text-muted'>at {dayjs.utc(item.created).local().format('lll')}</span>
											</Typography>
										</Box>
									</Box>
								</TimelineContent>
							</TimelineItem>
						)
					)}
					<Box
						sx={{
							position: 'absolute',
							top: '24px',
							left: '5px',
							width: '2px',
							height: '100%',
							background: '#ecffef',
							zIndex: 0,
						}}
					/>
				</Timeline>
			</Box>

			<Box sx={{ px: '28px', py: '20px', width: '65%', alignSelf: 'center' }}>
				<RichTextEditorBox
					PostButton={<PostButton handleSubmit={handleSubmit} disabled={postDisabled} />}
					editor={editor}
					footer={
						<Stack>
							{files.length !== 0 && (
								<Box sx={{ borderTop: '1.5px solid #E5EFE9', maxHeight: '200px', overflowY: 'auto' }}>
									<List dense>
										{files.map((file, idx) => (
											<ListItem
												key={idx}
												secondaryAction={
													<IconButton edge='end' aria-label='delete' onClick={() => handleDeleteFile(idx)}>
														<X />
													</IconButton>
												}
											>
												<ListItemAvatar>
													<Avatar>
														<File />
													</Avatar>
												</ListItemAvatar>
												<ListItemText primary={file.name} secondary={humanFileSize(file.size, true, 1)} />
											</ListItem>
										))}
									</List>
								</Box>
							)}

							<Stack
								justifyContent={'center'}
								direction={'row'}
								py={2}
								sx={{
									borderTop: '1.5px solid #E5EFE9',
								}}
								spacing={1}
								height='60px'
							>
								<CloudUploadIcon color='grey' />
								<Typography color='grey'>
									Drop files to attach, or
									<label>
										<Link underline='none'> browse</Link>
									</label>
								</Typography>
							</Stack>
							<CustomInput type='file' onChange={(event) => handleFileUpload(event)} multiple />
						</Stack>
					}
				></RichTextEditorBox>

				{/* <Box mt={2} width={'100%'} textAlign={'center'}>
					<CircularButton sx={{ py: 2, px: 6, width: 200 }} onClick={handleSubmit} disabled={postDisabled}>
						Post
					</CircularButton>
				</Box> */}
			</Box>
		</Box>
	)
};
import { Alert, Avatar, Box, Button, Chip, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Stack, styled, Typography } from "@mui/material"
import { AlarmClock, CalendarFold, Check, CircleAlert, ClockAlert, File, Headset, MessageCircleQuestion, MessageSquare, Network, Paperclip, Pencil, Send, SquareUserRound, TicketCheck, TicketX, Type, Users, X } from "lucide-react"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Layout } from "../../components/layout"
import { WhiteContainer } from "../../components/white-container"
import { useData } from "../../context/DataContext"

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from "@mui/lab"
import { extensions, RichTextEditorBox } from '../../components/rich-text-editor'
import { useTicketBackend } from "../../hooks/useTicketBackend"



import { useEditor } from "@tiptap/react"
import axios from "axios"
import dayjs from 'dayjs'
import { AuthContext } from "../../context/AuthContext"
import formatDate from '../../functions/date-formatter'
import humanFileSize from '../../functions/file-size-formatter'
import { stringToColor } from "../../functions/string-to-color"
import { useAttachmentBackend } from "../../hooks/useAttachmentBackend"
import { useThreadsBackend } from "../../hooks/useThreadBackend"
import { AddTicket } from "./AddTicket"
import { MessageContainer } from "./MessageContainer"
import { relativeTime } from "../../functions/relative-time"

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

export const TicketView = () => {
    const { number } = useParams()

    const { getTicketByNumber } = useTicketBackend()
    const [ticket, setTicket] = useState({})
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)


    const [formData, setFormData] = useState({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
    const [postDisabled, setPostDisabled] = useState(true);
    const [files, setFiles] = useState([]);
    const { defaultSettings } = useData()
    const { createThreadEntry, createThreadEntryForUser } = useThreadsBackend();
    const { getPresignedURL } = useAttachmentBackend();
    const { agentAuthState, userAuthState, permissions } = useContext(AuthContext);
    const [confirmation, setConfirmation] = useState('')
    const type = useMemo(() => (agentAuthState.isAuth === true ? 'agent' : userAuthState.isAuth === true ? 'user' : 'guest'), [agentAuthState, userAuthState])
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

    const getEventIcon = (field, size) => {
        switch (field) {
            case 'agent_id':
                return <Headset size={size} />
            case 'status_id':
                return <TicketCheck size={size} />
            case 'priority_id':
                return <CircleAlert size={size} />
            case 'sla_id':
                return <AlarmClock size={size} />
            case 'dept_id':
                return <Network size={size} />
            case 'topic_id':
                return <MessageCircleQuestion size={size} />
            case 'group_id':
                return <Users size={size} />
            case 'title':
                return <Type size={size} />
            case 'description':
                return <MessageSquare size={size} />
            case 'overdue':
                return <ClockAlert size={size} />
            case 'closed':
                return <Check size={size} />
            case 'due_date':
                return <CalendarFold size={size} />
            default:
                return <File size={size} />
        }
    }


    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const updateCurrentTicket = newTicket => {
        newTicket = preProcessTicket(newTicket);
        setTicket(newTicket);
    };

    const handleSubmit = async () => {
        // ABSTRACT SO THAT I CAN USE IT FOR EITHER TYPE OF THREAD ENTRY
        const threadEntryCreate = type === 'agent' ? createThreadEntry : createThreadEntryForUser;
        let newThreadEntry = { ...formData, thread_id: ticket.thread.thread_id };
        if (type === 'agent') {
            newThreadEntry.agent_id = agentAuthState.agent_id;
        } else {
            newThreadEntry.user_id = userAuthState.user_id;
        }

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
                    updateCurrentTicket(updatedTicket);
                })
                .catch((err) => {
                    alert(err.response.data.detail)
                })
        } else {
            threadEntryCreate(newThreadEntry)
                .then((response) => {
                    updatedTicket.thread.entries.push(response.data);
                    editor.commands.setContent('');
                    setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
                })
                .then(() => {
                    updateCurrentTicket(updatedTicket);
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
                attachments.push({ name: fileName, link: url.split('?')[0], type: file.type, size: file.size, inline: 1 });
            })
        );
        return attachments;
    };

    const handleFileUpload = (event) => {
        const length = event.target.files.length;
        let tempArray = [];
        let sizeExceed = false
        for (let i = 0; i < length; i++) {
            if (files.some(file => file.name === event.target.files[i].name)) {
                alert('Cannot upload the same file more than once')
                continue
            }
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

        if (item.field === 'due_date' || item.field === 'closed') {
            newValue = newValue ? formatDate(newValue, 'lll') : null;
            prevValue = prevValue ? formatDate(prevValue, 'lll') : null;
        }

        if (item.field === 'overdue') {
            newValue = newValue ? 'True' : 'False';
            prevValue = prevValue ? 'True' : 'False';
        }

        const field = capitilize(item.field.replace('_id', '').replace('_', ' '));

        if (item.type === 'A') {
            return (
                <>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        set the {field} to&nbsp;
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        {newValue}
                    </Typography>
                </>
            );
        } else if (item.type === 'R') {
            return (
                <>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        removed the&nbsp;
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        {prevValue}&nbsp;
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        {field}
                    </Typography>
                </>
            );
        } else {
            return (
                <>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#6e7772',
                        }}
                    >
                        updated {field} from&nbsp;
                    </Typography>
                    <Typography
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            wordBreak: 'break-word',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        {prevValue}
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            color: '#6e7772',
                        }}
                    >
                        &nbsp;to&nbsp;
                    </Typography>
                    <Typography
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            wordBreak: 'break-word',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#6e7772'
                        }}
                    >
                        {newValue}
                    </Typography>
                </>
            );
        }
    }

    const statusStyles = {
        open: {
            backgroundColor: '#b3e5fc', // Light Blue
        },
        deleted: {
            backgroundColor: '#ffcdd2', // Light Red/Pink
        },
        archived: {
            backgroundColor: '#fff9c4', // Light Yellow
        },
        closed: {
            backgroundColor: '#e0e0e0', // Light Grey
        },
        default: {
            // Fallback style for unknown statuses
            backgroundColor: '#f5f5f5', // Very Light Grey
        },
    };

    function datetime_sort(a, b) {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
    }

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

    useEffect(() => {
        setPostDisabled(editor.isEmpty && files.length === 0);
    }, [formData, files]);

    useEffect(() => {
        setLoading(true)
        refreshTicket()
        setLoading(false)
    }, [])

    const refreshTicket = () => {
        getTicketByNumber(number)
            .then(res => {
                const preparedTicket = preProcessTicket(res.data)
                setTicket(preparedTicket)
            })
            .catch(() => {
                console.error('Error while fetching ticket by number')
            })
    }

    return (
        <Layout
            title={'Ticket #' + number}
            subtitle={''}
            buttonInfo={{
                label: 'Edit ticket',
                icon: <Pencil size={20} />,
                hidden: permissions.hasOwnProperty('ticket.edit')
            }}
            AddResource={AddTicket}
            ticket={ticket}
            refreshResource={refreshTicket}
            setConfirmation={setConfirmation}
        >

            {confirmation && (
                <Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{ mb: 2, border: '1px solid rgb(129, 199, 132);' }} >
                    {confirmation}
                </Alert>
            )}
            <WhiteContainer
                noPadding
                sx={{
                    height: '100%',
                }}
            >

                {loading && <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: '65%'
                    }}
                >
                    <Skeleton variant="rounded" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Box>
                }
                {ticket && ticket.created ?
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            px: 2,
                            flexGrow: 1,
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center', // Spaces out ticket info and the "Hi" text
                                alignItems: 'start', // Align items to the top
                                alignContent: 'center',
                                flexGrow: 1,
                                maxWidth: '1280px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                }}
                            >

                                <Box sx={{ minHeight: '100%', width: '100%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                                    <Box sx={{ height: '100%', px: '28px', position: 'relative' }}>
                                        <Timeline
                                            sx={{
                                                px: 0,
                                                mb: 0,
                                                position: 'relative',
                                                [`& .${timelineItemClasses.root}:before`]: {
                                                    flex: 0,
                                                    padding: 0,
                                                },
                                            }}
                                        >
                                            {ticket.thread?.events_and_entries?.map((item, idx) =>
                                                item.entry_id ? (
                                                    <TimelineItem key={'entry' + item.entry_id} sx={{ ml: '10px' }}>
                                                        <TimelineSeparator sx={{}}>
                                                            <TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1, mt: '20px' }} />
                                                            <TimelineConnector sx={{ background: '#ecffef' }} />
                                                        </TimelineSeparator>
                                                        <TimelineContent sx={{ mb: 2 }}>
                                                            <MessageContainer
                                                                item={item}
                                                                type={type}
                                                            />
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                ) : (
                                                    <TimelineItem key={'event' + item.event_id} sx={{}}>
                                                        <TimelineSeparator>
                                                            <TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1, m: 0 }}>
                                                                {getEventIcon(item.field, 20)}
                                                            </TimelineDot>
                                                            <TimelineConnector sx={{ background: '#ecffef' }} />
                                                        </TimelineSeparator>
                                                        <TimelineContent>
                                                            <Box width={'fit-content'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                <Avatar
                                                                    sx={{
                                                                        height: '20px',
                                                                        width: '20px',
                                                                        mr: '5px',
                                                                        backgroundColor: stringToColor(item.owner)
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {item.owner.charAt(0).toUpperCase()}
                                                                    </Typography>
                                                                </Avatar>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                >
                                                                    {item.owner}&nbsp;
                                                                </Typography>
                                                                {getEventText(item)}
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: '0.8rem',
                                                                        color: '#6e7772'
                                                                    }}
                                                                >
                                                                    &nbsp;{relativeTime(dayjs.utc(item.created).local())}
                                                                </Typography>
                                                            </Box>
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                )
                                            )}

                                            {/* <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '24px',
                                                    left: '5px',
                                                    width: '2px',
                                                    height: '100%',
                                                    background: '#ecffef',
                                                    zIndex: 0,
                                                }}
                                            /> */}
                                        </Timeline>
                                    </Box>

                                    {(type === 'user' || permissions.hasOwnProperty('ticket.edit')) && (
                                        <Box sx={{ px: '28px', pb: '20px' }}>
                                            <RichTextEditorBox
                                                editor={editor}
                                                footer={
                                                    <Stack>
                                                        {files.length !== 0 && (
                                                            <Box sx={{ borderTop: '1.5px solid #E5EFE9', maxHeight: '200px', overflowY: 'auto' }}>
                                                                <List dense>
                                                                    {files.map((file, idx) => (
                                                                        <ListItem
                                                                            sx={{
                                                                                height: '40px',
                                                                            }}
                                                                            key={file.name + idx}
                                                                            secondaryAction={
                                                                                <IconButton edge='end' aria-label='delete' onClick={() => handleDeleteFile(idx)}>
                                                                                    <X size={17} />
                                                                                </IconButton>
                                                                            }
                                                                        >
                                                                            <ListItemAvatar>
                                                                                <Avatar
                                                                                    sx={{
                                                                                        height: '30px',
                                                                                        width: '30px'
                                                                                    }}
                                                                                >
                                                                                    <File size={15} />
                                                                                </Avatar>
                                                                            </ListItemAvatar>
                                                                            <ListItemText
                                                                                primaryTypographyProps={{
                                                                                    fontSize: '0.8rem',
                                                                                    fontWeight: 600,
                                                                                    color: 'grey'
                                                                                }}
                                                                                secondaryTypographyProps={{
                                                                                    fontSize: '0.7rem',
                                                                                    color: 'grey'
                                                                                }}
                                                                                primary={file.name} secondary={humanFileSize(file.size, true, 1)}
                                                                            />
                                                                        </ListItem>
                                                                    ))}
                                                                </List>
                                                            </Box>
                                                        )}

                                                    </Stack>
                                                }
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mt: 1,
                                                }}
                                            >
                                                <Button
                                                    disableElevation
                                                    disableRipple
                                                    onClick={triggerFileInput}
                                                    startIcon={<Paperclip size={15} />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        height: '25px',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    Drop or click to add files
                                                </Button>
                                                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} multiple />
                                                <Button
                                                    variant='contained'
                                                    disableElevation
                                                    disableRipple
                                                    size='small'
                                                    onClick={handleSubmit}
                                                    disabled={postDisabled}
                                                    sx={{
                                                        color: 'white',
                                                        backgroundColor: 'primary.main',
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            backgroundColor: '#29b866',
                                                        },
                                                    }}
                                                >
                                                    Send
                                                </Button>
                                            </Box>


                                        </Box>
                                    )}
                                </Box>



                            </Box>

                            <Box
                                sx={{
                                    width: 350,
                                    pt: 4
                                }}
                            >
                                {/* Ticket Details */}
                                <Typography
                                    sx={{
                                        color: '#6e7772',
                                        fontWeight: 700,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Agent
                                </Typography>
                                {ticket.agent ? (
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                        <Avatar
                                            sx={{
                                                height: '30px',
                                                width: '30px',
                                                backgroundColor: stringToColor(ticket.agent.firstname + ' ' + ticket.agent.lastname)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 700
                                                }}
                                            >
                                                {ticket.agent.firstname?.charAt(0).toUpperCase()}
                                            </Typography>
                                        </Avatar>
                                        <Typography
                                            variant='subtitle2'
                                            color={'#1B1D1F'}
                                            fontWeight={600}
                                            sx={{
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {ticket.agent.firstname + ' ' + ticket.agent.lastname}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Typography
                                        variant='subtitle2'
                                        color={'#1B1D1F'}
                                        fontWeight={600}
                                    >
                                        Not assigned
                                    </Typography>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    sx={{
                                        color: '#6e7772',
                                        fontWeight: 700,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    User
                                </Typography>
                                {ticket.user ? (
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                        <Avatar
                                            sx={{
                                                height: '30px',
                                                width: '30px',
                                                backgroundColor: stringToColor(ticket.user.firstname + ' ' + ticket.user.lastname)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 700
                                                }}
                                            >
                                                {ticket.user.firstname?.charAt(0).toUpperCase()}
                                            </Typography>
                                        </Avatar>
                                        <Typography
                                            variant='subtitle2'
                                            color={'#1B1D1F'}
                                            fontWeight={600}
                                            sx={{
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {ticket.user.firstname + ' ' + ticket.user.lastname}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Typography
                                        variant='subtitle2'
                                        color={'#1B1D1F'}
                                        fontWeight={600}
                                    >
                                        Not assigned
                                    </Typography>
                                )}
                                <Divider sx={{ my: 2 }} />

                                {/* Status */}
                                <Typography
                                    sx={{
                                        color: '#6e7772',
                                        fontWeight: 700,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Status
                                </Typography>
                                {ticket.status ? (
                                    <Chip
                                        size="small"
                                        label={ticket.status.name}
                                        sx={{ backgroundColor: statusStyles[ticket.status.state], px: '8px', fontWeight: 600, mt: 1 }}
                                    />
                                ) : (
                                    <Typography
                                        variant="subtitle2"
                                        color={'#6e7772'}
                                        fontWeight={600}
                                    >
                                        No status
                                    </Typography>
                                )}
                                <Divider sx={{ my: 2 }} />
                                {type === 'agent' && (
                                    <>
                                        {/* Priority */}
                                        <Typography
                                            sx={{
                                                color: '#6e7772',
                                                fontWeight: 700,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Priority
                                        </Typography>
                                        {ticket.priority ? (
                                            <Chip
                                                size="small"
                                                label={ticket.priority.priority_desc}
                                                sx={{ backgroundColor: ticket.priority.priority_color, px: '8px', fontWeight: 600, mt: 1 }}
                                            />
                                        ) : (
                                            <Typography
                                                variant='subtitle2'
                                                color={'#6e7772'}
                                                fontWeight={600}
                                            >
                                                No priority
                                            </Typography>
                                        )}
                                        <Divider sx={{ my: 2 }} />

                                        {/* Topic */}
                                        <Typography
                                            sx={{
                                                color: '#6e7772',
                                                fontWeight: 700,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Topic
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                color: ticket.topic?.topic ? 'black' : '#6e7772'
                                            }}
                                        >
                                            {ticket.topic?.topic || 'No topic'}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />

                                        {/* Department */}
                                        <Typography
                                            sx={{
                                                color: '#6e7772',
                                                fontWeight: 700,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Department
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                color: ticket.dept?.name ? 'black' : '#6e7772'
                                            }}
                                        >
                                            {ticket.dept?.name || 'No department'}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        
                                        {/* SLA */}
                                        <Typography
                                            sx={{
                                                color: '#6e7772',
                                                fontWeight: 700,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            SLA
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                color: ticket.sla?.name ? 'black' : '#6e7772'
                                            }}
                                        >
                                            {ticket.sla?.name || 'No sla'}
                                        </Typography>
                                    </>
                                )}

                                {/* Due Dates */}
                                <Divider sx={{ my: 2 }} />
                                <Typography
                                    sx={{
                                        color: '#6e7772',
                                        fontWeight: 700,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Due Date
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                    <Typography variant='subtitle2' color={'#1B1D1F'} fontWeight={600}>
                                        {ticket.due_date
                                            ? new Date(ticket.due_date)
                                                .toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                .replace(',', ' ')
                                            : ticket.est_due_date ? 
                                                new Date(ticket.est_due_date)
                                                .toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                .replace(',', ' ')
                                                : ticket.est_due_date ?
                                                new Date(ticket.est_due_date)
                                                .toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                .replace(',', ' ')
                                                : 
                                                'No due date'
                                        }
                                    </Typography>
                                    {ticket.overdue === 1 && (
                                        <Chip
                                            size="small"
                                            label='Overdue'
                                            sx={{ backgroundColor: '#f77c7c', marginLeft: '8px', fontWeight: 600 }}
                                        />
                                    )}
                                </Stack>

                                
                                {ticket?.form_entry?.form?.fields && (
                                    <Divider sx={{ my: 2 }} />
                                )}

                                {ticket?.form_entry?.form?.fields?.map((field, idx) => (
                                    <>
                                        <Typography
                                            sx={{
                                                color: '#6e7772',
                                                fontWeight: 700,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {field.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                flexWrap: 'wrap',
                                                wordBreak: 'break-word',
                                                fontWeight: 600,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {ticket?.form_entry?.values[idx]?.value || 'No value'}
                                        </Typography>
                                        {ticket?.form_entry?.form?.fields.length !== idx + 1 && <Divider sx={{ my: 2 }} />}
                                    </>
                                ))}


                            </Box>
                        </Box>
                    </Box>
                    :
                    <Box
                        sx={{
                            width: '100%',
                            height: '60vh', // whitecontainer min height
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: '65%'
                        }}
                    >
                        <TicketX size={80} />
                        <Typography fontWeight={600} variant="h2">
                            You can't view this ticket
                        </Typography>
                        <Typography variant="subtitle2">
                            It may have been deleted or you don't have permission to view it.
                        </Typography>
                    </Box>
                }
            </WhiteContainer>
        </Layout>

    )


}

// export const CaseDetails = ({ selectedRow, handleClose }) => {
//     const { number, status, lastUpdated, created, notes, policies, items, attachments, step, case_type, shipment_id, order_id, reimbursement_id, title, amount, amazon_case_id, amazon_status } = selectedRow;
//     const [itemsExpanded, setItemsExpanded] = useState(false)
//     const [attachmentsExpanded, setAttachmentsExpanded] = useState(false)

//     const toggleItemsExpanded = () => (
//         setItemsExpanded(p => !p)
//     )

//     const toggleAttachmentsExpanded = () => (
//         setAttachmentsExpanded(p => !p)
//     )

//     const getNoteColor = (note_type, background) => {
//         if (note_type === 'error') {
//             return background ? "#FDE0DC" : "#F44336"
//         }
//         else if (note_type === 'explanation') {
//             return background ? "#E3F2FD" : "#42A5F5"
//         }
//         else if (note_type === 'thought_process') {
//             return background ? "#FFFDE7" : "#FFCA28"
//         }
//         else {
//             return background ? "#F3E5F5" : "#9C27B0"
//         }
//     }


//     return (

//         <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//             {/* Header */}
//             <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: "background.paper" }}>
//                 <Toolbar>
//                     <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
//                         Case #{number}
//                     </Typography>
//                     <IconButton color="primary" sx={{ mr: 1 }}>
//                         <Edit size={20} />
//                     </IconButton>
//                     <IconButton color="inherit" onClick={handleClose}>
//                         <X size={20} />
//                     </IconButton>
//                 </Toolbar>
//             </AppBar>

//             <Divider />

//             {/* Main content */}
//             <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
//                 {/* Left side - Chat area */}
//                 <Box
//                     sx={{
//                         width: "75%",
//                         display: "flex",
//                         flexDirection: "column",
//                         borderRight: "1px solid",
//                         borderColor: "divider",
//                         overflow: "auto",
//                         p: 2,
//                     }}
//                 >

//                     {/* Comments section */}
//                     <List sx={{ width: "100%", mb: 2, px: 1 }}>
//                         {notes.map((note, index) => (
//                             <ListItem
//                                 key={index}
//                                 alignItems="flex-start"
//                                 sx={{
//                                     px: 2,
//                                     my: 2,
//                                 }}
//                             >
//                                 <ListItemIcon sx={{ minWidth: 48 }}>
//                                     <Avatar
//                                         sx={{
//                                             width: 40,
//                                             height: 40,
//                                             bgcolor: stringToColor(note.author)
//                                         }}
//                                     >
//                                         <Typography fontWeight={600}>
//                                             {`${note.author.split(' ')[0][0]}${note.author.split(' ')[1][0]}`}
//                                         </Typography>
//                                     </Avatar>
//                                 </ListItemIcon>
//                                 <ListItemText
//                                     primary={
//                                         <Box
//                                             sx={{
//                                                 display: "flex",
//                                                 justifyContent: "space-between",
//                                                 borderTopLeftRadius: '6px',
//                                                 borderTopRightRadius: '6px',
//                                                 border: `1px solid ${getNoteColor(note.note_type, false)}`,
//                                                 backgroundColor: getNoteColor(note.note_type, true),
//                                                 px: 2,
//                                                 py: 1
//                                             }}
//                                         >
//                                             <Typography variant="subtitle2" fontWeight={600}>{note.author}</Typography>
//                                             <Typography variant="caption" fontWeight={500} color="text.secondary">
//                                                 {formatDate(note.created, 'lll')}
//                                             </Typography>
//                                         </Box>
//                                     }
//                                     secondary={
//                                         <Box>

//                                             <Box
//                                                 sx={{
//                                                     border: `1px solid ${getNoteColor(note.note_type, false)}`,
//                                                     borderBottomLeftRadius: '6px',
//                                                     borderBottomRightRadius: '6px',
//                                                     borderTop: 'none',
//                                                     px: 2,
//                                                     py: 1
//                                                 }}
//                                             >
//                                                 <Typography variant="body2" color="text.primary" fontWeight={500} whiteSpace='pre-line' >
//                                                     {note.description}
//                                                 </Typography>
//                                             </Box>
//                                             {note.secondary_description && <Box
//                                                 sx={{
//                                                     border: `1px dashed grey`,
//                                                     borderBottomLeftRadius: '6px',
//                                                     borderBottomRightRadius: '6px',
//                                                     borderTop: 'none',
//                                                     px: 2,
//                                                     py: 1
//                                                 }}
//                                             >
//                                                 <Box display='flex' flexDirection='row' mb='3px' alignItems={'center'}>
//                                                     <Brain size={20} color='grey' />
//                                                     <Typography variant="caption" fontWeight={500} color="text.secondary" ml='5px'>
//                                                         Thought process
//                                                     </Typography>
//                                                 </Box>
//                                                 <Typography variant="body2" color="text.primary" fontWeight={500} whiteSpace='pre-line'>
//                                                     {note.secondary_description}
//                                                 </Typography>
//                                             </Box>}
//                                         </Box>
//                                     }
//                                 />

//                             </ListItem>
//                         ))}
//                     </List>

//                 </Box>

//                 {/* Right side - details */}
//                 <Box
//                     sx={{
//                         width: "25%",
//                         p: 2,
//                         overflow: "auto",
//                     }}
//                 >
//                     <Grid container spacing={2} width='100%'>
//                         {/* Assignees */}
//                         {/* <Grid item xs={12}> */}
//                         {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2">Assignees</Typography>
//                                 <IconButton size="small">
//                                     <MoreVertical size={16} />
//                                 </IconButton>
//                             </Box>
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                 <Avatar
//                                     src={ticketData.assignee.avatar}
//                                     alt={ticketData.assignee.name}
//                                     sx={{ width: 24, height: 24 }}
//                                 />
//                                 <Typography variant="body2">{ticketData.assignee.name}</Typography>
//                             </Box> */}
//                         {/* </Grid> */}

//                         {/* Title */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Title</Typography>
//                             </Box>
//                             <Typography variant="body2">{title}</Typography>

//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Status */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
//                             </Box>
//                             {getChip(status)}
//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Step */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Step</Typography>
//                             </Box>
//                             <Chip
//                                 label={humanize(step)}
//                                 size="small"
//                                 sx={{
//                                     fontWeight: 600,
//                                     borderRadius: "16px",
//                                     backgroundColor: stringToColor(step)
//                                 }}
//                             />
//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Case Type */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Case Type</Typography>
//                             </Box>
//                             <Chip
//                                 label={humanize(case_type)}
//                                 size="small"
//                                 sx={{
//                                     fontWeight: 600,
//                                     borderRadius: "16px",
//                                     backgroundColor: stringToColor(case_type)
//                                 }}
//                             />
//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Recovered */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Recovered</Typography>
//                             </Box>
//                             <Typography variant="body2">{amount || '-'}</Typography>

//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Items */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Box>
//                                     <Typography variant="subtitle2" fontWeight={600}>Items</Typography>
//                                     <Typography></Typography>
//                                 </Box>
//                                 <IconButton size="small" onClick={toggleItemsExpanded}>
//                                     {itemsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                                 </IconButton>
//                             </Box>
//                             <Collapse in={itemsExpanded}>
//                                 <List dense disablePadding>
//                                     {items.map((item) => (
//                                         <ListItem key={item.item_id} disablePadding sx={{ py: 0.5 }}>
//                                             <ListItemIcon sx={{ minWidth: 32 }}>
//                                                 <Package size={16} />
//                                             </ListItemIcon>
//                                             <ListItemText
//                                                 primary={item.name}
//                                                 secondary={item.sku}
//                                                 primaryTypographyProps={{ variant: "subtitle2" }}
//                                                 secondaryTypographyProps={{ variant: "caption" }}
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </Collapse>
//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Attachments */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Documents</Typography>
//                                 <IconButton size="small" onClick={toggleAttachmentsExpanded}>
//                                     {attachmentsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                                 </IconButton>
//                             </Box>
//                             <Collapse in={attachmentsExpanded}>
//                                 <List dense disablePadding>
//                                     {attachments.map((attachment) => (
//                                         <ListItem key={attachment.attachment.attachment_id} disablePadding sx={{ py: 0.5 }}>
//                                             <ListItemIcon sx={{ minWidth: 32 }}>
//                                                 <File size={16} />
//                                             </ListItemIcon>
//                                             <ListItemText
//                                                 primary={
//                                                     <Link
//                                                         href={attachment.attachment.link}
//                                                         rel="noopener noreferrer"
//                                                         target="_blank"
//                                                         underline='hover'

//                                                     >
//                                                         {attachment.attachment.name}
//                                                     </Link>
//                                                 }
//                                                 secondary={humanize(attachment.attachment.type)}
//                                                 primaryTypographyProps={{ variant: "subtitle2" }}
//                                                 secondaryTypographyProps={{ variant: "caption" }}
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </Collapse>
//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Shipment ID */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Shipment ID</Typography>
//                             </Box>
//                             <Typography variant="body2">{shipment_id}</Typography>

//                         </Grid>

//                         <Box
//                             sx={{
//                                 height: '1px',
//                                 width: '100%',
//                                 px: 1,
//                                 backgroundColor: 'divider'
//                             }}
//                         />

//                         {/* Shipment ID */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Order ID</Typography>
//                             </Box>
//                             <Typography variant="body2">{order_id || 'No Order ID'}</Typography>

//                         </Grid>

//                         {/* Shipment ID */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Reimbursement ID</Typography>
//                             </Box>
//                             <Typography variant="body2">{reimbursement_id || 'No reimbursement ID'}</Typography>

//                         </Grid>

//                         {/* Shipment ID */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Amazon Case ID</Typography>
//                             </Box>
//                             <Typography variant="body2">{amazon_case_id || 'No Case ID'}</Typography>

//                         </Grid>

//                         {/* Shipment ID */}
//                         <Grid item xs={12} width='100%'>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                                 <Typography variant="subtitle2" fontWeight={600}>Amazon Status</Typography>
//                             </Box>
//                             <Typography variant="body2">{amazon_status || 'No status'}</Typography>

//                         </Grid>

//                     </Grid>
//                 </Box>
//             </Box>
//         </Box>

//     )

//     // return (
//     //     <Box p={2}>
//     //         <Box display='flex' flexDirection='row' justifyContent='space-between'>
//     //             <Typography variant='h6' gutterBottom>
//     //                 <strong>Case</strong> #{number}
//     //             </Typography>
//     //             <IconButton
//     //                 onClick={handleClose}
//     //             >
//     //                 <X color='#6E7772' strokeWidth={1.5} />
//     //             </IconButton>

//     //         </Box>
//     //         <Tabs value={tabValue} onChange={handleChange} aria-label="case details tabs">
//     //             <Tab label="Details" />
//     //             <Tab label="Notes" />
//     //             <Tab label="Context" />
//     //         </Tabs>
//     //         {tabValue === 0 && (
//     //             <Box p={2}>
//     //                 <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
//     //                     <Typography variant='h6' gutterBottom>
//     //                         <strong>Status</strong>
//     //                     </Typography>
//     //                     <Typography variant='body1' gutterBottom>
//     //                         {status}
//     //                     </Typography>
//     //                     <Typography variant='h6' gutterBottom>
//     //                         <strong>Last Updated</strong>
//     //                     </Typography>
//     //                     <Typography variant='body1' gutterBottom>
//     //                         {formatDate(lastUpdated, 'llll')}
//     //                     </Typography>
//     //                     <Typography variant='h6' gutterBottom>
//     //                         <strong>Created</strong>
//     //                     </Typography>
//     //                     <Typography variant='body1' gutterBottom>
//     //                         {formatDate(created, 'llll')}
//     //                     </Typography>
//     //                 </Box>
//     //             </Box>
//     //         )}
//     //         {tabValue === 1 && (
//     //             <Box p={2}>
//     //                 {notes.map((note) => (
//     //                     <Box 
//     //                         key={note.note_id}
//     //                         mb={2}
//     //                         p={2}
//     //                         border={'dashed'}
//     //                         borderColor={note.hidden ? '#ebeefb' : 'grey.300'}
//     //                         sx={{
//     //                             borderRadius: 4,
//     //                             border: note.hidden ? '1.5px dashed' : '1.5px solid'
//     //                         }}
//     //                     >
//     //                         <Typography variant='body1' fontWeight={500} gutterBottom>
//     //                             {note.description}
//     //                         </Typography>
//     //                         <Typography variant='caption' fontWeight={500}>
//     //                             <span className='text-muted'>By </span>
//     //                             {note.author}
//     //                             <span className='text-muted'> at {formatDate(note.created, 'llll')}</span>
//     //                         </Typography>
//     //                     </Box>
//     //                 ))}
//     //             </Box>
//     //         )}
//     //         {tabValue === 2 && (
//     //             <Box p={2}>
//     //                 <Accordion defaultExpanded disableGutters>
//     //                     <AccordionSummary expandIcon={<ChevronDown />}>
//     //                         <Typography variant='h6'>Attachments</Typography>
//     //                     </AccordionSummary>
//     //                     <AccordionDetails>
//     //                         {attachments.map((attachment) => (
//     //                             <Box key={attachment.id} display="flex" alignItems="center" mb={1}>
//     //                                 <Paperclip size={16} style={{ marginRight: 8 }} />
//     //                                 <Typography variant='body1'>{attachment.attachment.name}</Typography>
//     //                             </Box>
//     //                         ))}
//     //                     </AccordionDetails>
//     //                 </Accordion>
//     //                 <Box mb={2} />
//     //                 <Accordion defaultExpanded disableGutters>
//     //                     <AccordionSummary expandIcon={<ChevronDown />}>
//     //                         <Typography variant='h6'>Policies</Typography>
//     //                     </AccordionSummary>
//     //                     <AccordionDetails>
//     //                         {policies.map((policy) => (
//     //                             <Box key={policy.id} display="flex" alignItems="center" mb={1}>
//     //                                 <FileText size={16} style={{ marginRight: 8 }} />
//     //                                 <Typography variant='body1'>{policy.policy.name}</Typography>
//     //                             </Box>
//     //                         ))}
//     //                     </AccordionDetails>
//     //                 </Accordion>
//     //             </Box>
//     //         )}
//     //     </Box>
//     // );
// }


const PostButton = ({ handleSubmit, disabled }) => {
    return (
        <Box border={disabled ? '1.5px solid #E5EFE9' : '1.5px solid #5a9ee5'} borderRadius='8px'>
            <IconButton onClick={handleSubmit} disabled={disabled}>
                <Send size={20} />
            </IconButton>
        </Box>
    );
};


import { Avatar, Box, Collapse, IconButton, Stack, Typography } from "@mui/material"
import { Paperclip } from "lucide-react"

import { extensions } from '../../components/rich-text-editor'



import dayjs from 'dayjs'
import { RichTextReadOnly } from 'mui-tiptap'
import { useState } from "react"
import { stringToColor } from "../../functions/string-to-color"
import { FileCard } from './FileCard'
import { relativeTime } from "../../functions/relative-time"

export const MessageContainer = ({ item, type }) => {

    const [fileCollapse, setFileCollapse] = useState(false)

    const getDirection = (agent_id, option1, option2) => {
        if ((agent_id && type === 'agent') || (!agent_id && type !== 'agent')) {
            return option1;
        } else return option2;
    };

    return (
        <Box>
            <Typography variant='subtitle2' fontWeight={600} color='#1B1D1F' align={getDirection(item.agent_id, 'right', 'left')}>
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Avatar
                        sx={{
                            mt: '2.5px',
                            height: '35px',
                            width: '35px',
                            mr: 1,
                            backgroundColor: stringToColor(item.owner)
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {item.owner.charAt(0)}
                        </Typography>
                    </Avatar>
                    <Box
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                border: `1px solid ${item.agent_id ? '#0056b3' : '#adb5bd'}`,
                                background: item.agent_id ? '#e7f1ff' : '#f8f9fa',
                                borderTopRightRadius: '8px',
                                borderTopLeftRadius: '8px',
                                borderBottom: 'none',
                                minWidth: '400px',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pt: '8px',
                                pb: '7px',
                                px: '16px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {item.owner}
                                </Typography>
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
                            {item.attachments.length > 0 && <Stack direction='row' ml={0.5} spacing={0.5} alignItems='center' color={'grey'}>
                                <IconButton onClick={() => setFileCollapse(p => !p)} disableRipple sx={{ m: 0, p: 0 }}>
                                    <Typography fontSize='small' mr={'2px'}>{item.attachments.length}</Typography>
                                    <Paperclip size={15} />
                                </IconButton>
                            </Stack>}
                        </Box>
                        <Box
                            sx={{
                                py: '8px',
                                px: '16px',
                                border: `1px solid ${item.agent_id ? '#0056b3' : '#adb5bd'}`,
                                borderBottomRightRadius: '8px',
                                borderBottomLeftRadius: '8px',
                            }}
                        >
                            {item.body ? <RichTextReadOnly content={item.body} extensions={extensions} /> :
                                <Typography variant="subtitle2" color="#6e7772">
                                    No description provided.
                                </Typography>
                            }
                            <Collapse in={fileCollapse} timeout="auto" unmountOnExit>
                                {item.attachments.map((attachment) => (
                                    <FileCard file={attachment} key={attachment.attachment_id} />
                                ))}
                            </Collapse>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
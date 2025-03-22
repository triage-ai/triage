import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { CircleHelp } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { HtmlTooltip } from '../../components/tooltip';
import { AuthContext } from '../../context/AuthContext';
import { useQueueBackend } from '../../hooks/useQueueBackend';
import { QueueMenu } from './QueueMenu';

export const AddQueue = ({ handleCreated, handleEdited, editQueue, setConfirmation }) => {

    AddQueue.propTypes = {
        handleCreated: PropTypes.func,
        handleEdited: PropTypes.func,
        editQueue: PropTypes.object,
    }

    const { createQueue, updateQueue } = useQueueBackend();
    const { agentAuthState } = useContext(AuthContext)

    const [isQueueValid, setIsQueueValid] = useState(false);
    const [filters, setFilters] = useState([])
    const [sorts, setSorts] = useState([]);
    const [columns, setColumns] = useState([])

    const [queueData, setQueueData] = useState({
        title: '',
        agent_id: agentAuthState.agent_id,
    });

    const validateQueue = () => {
        return queueData.title !== '';
    };

    useEffect(() => {
        if (editQueue) {
            editQueue.columns.forEach((column, idx) => {
                column.id = idx;
            });
            setQueueData(editQueue);
            setFilters(editQueue.config.filters)
            setSorts(editQueue.config.sorts)
            setColumns(editQueue.columns)
        }
    }, [editQueue]);

    const prepareQueueData = () => {
        const { title, agent_id } = queueData;
        return {
            title: title,
            agent_id: agent_id,
            config: JSON.stringify({filters: filters, sorts: sorts}),
            ...(editQueue && { queue_id: queueData.queue_id }),
        };
    };

    useEffect(() => {
        setIsQueueValid(validateQueue());
    }, [queueData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQueueData((prevQueueData) => ({
            ...prevQueueData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setQueueData((prevQueueData) => ({
            ...prevQueueData,
            [name]: checked ? null : agentAuthState.agent_id,
        }));
    }

    const handleAction = () => {
        if (editQueue) {
            updateQueue(prepareQueueData())
                .then((res) => {
                    handleEdited();
                    setConfirmation('Queue edited successfully!')
                })
                .catch((err) => console.error(err));
        } else {
            createQueue(prepareQueueData())
                .then((res) => {
                    handleCreated();
                    setConfirmation('Queue created successfully!')
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <>
            <Typography variant='h1' sx={{ mb: 1.5 }}>
                {editQueue ? 'Edit queue' : 'Add queue'}
            </Typography>

            <Typography variant='subtitle2'>
                {editQueue
                    ? 'Edit the details for this queue'
                    : 'We will gather essential details about the new queue. Complete the following steps to ensure accurate setup and access.'}
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
                <Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
                    Queue information
                </Typography>

                <CustomFilledInput label='Title' onChange={handleInputChange} value={queueData.title} name='title' mb={2} fullWidth />

                {agentAuthState.isAdmin && <FormControlLabel
                    sx={{
                        mb: 2
                    }}
                    control={
                        <Checkbox
                            onChange={handleCheckboxChange}
                            checked={!queueData.agent_id}
                            name='agent_id'
                            sx={{
                                '&.Mui-checked': {
                                    color: '#22874E',
                                },
                            }}
                        />
                    }
                    label={
                        <Stack direction='row' alignItems={'center'} spacing={1}>
                            <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                                Default queue
                            </Typography>
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        <Typography color='inherit'>Default Queue</Typography>
                                        {'If default queue is set to true, all agents will see this queue as an option.'}
                                    </React.Fragment>
                                }
                                placement='right'
                                arrow
                            >
                                <CircleHelp size={20} />
                            </HtmlTooltip>
                        </Stack>
                    }
                />}

                {editQueue && (
					<>
						<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
							Configuration
						</Typography>

						<QueueMenu
                            sorts={sorts}
                            setSorts={setSorts}
                            filters={filters}
                            setFilters={setFilters}
                            rows={columns}
                            setRows={setColumns}
                            setIsValid={setIsQueueValid}
                            queue_id={queueData.queue_id}
                        />
					</>
				)}

                {/* <CustomFilledInput
					label='Instructions'
					onChange={handleInputChange}
					value={queueData.instructions}
					name='instructions'
					mb={2}
					fullWidth
					rows={3}
				/>

				<CustomFilledInput label='Notes' onChange={handleInputChange} value={queueData.notes} name='notes' mb={2} fullWidth rows={3} />

				{editQueue && (
					<>
						<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
							Fields
						</Typography>

						<QueueFieldDataGrid rows={fields} setRows={setFields} queue_id={editQueue.queue_id} />
					</>
				)} */}
            </Box>

            <Stack direction='row' spacing={1.5} sx={{ justifyContent: 'center' }}>
                <CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isQueueValid}>
                    {editQueue ? 'Edit' : 'Create'} queue
                </CircularButton>
            </Stack>
        </>
    );
};

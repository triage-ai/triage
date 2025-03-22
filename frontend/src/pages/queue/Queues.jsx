import { Alert, Box, Dialog, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { Transition } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import formatDate from '../../functions/date-formatter';
import { AddQueue } from './AddQueue';
import { DeleteQueue } from './DeleteQueue';

export const SearchTextField = styled('input')({
    width: '100%',
    height: '42px',
    border: '1.5px solid #E5EFE9',
    borderRadius: '12px',
    padding: '10px',
    paddingLeft: '36px',
    fontWeight: 500,
    fontSize: '0.9375rem',
    color: '#000',
    position: 'relative',
    zIndex: 1,
    background: 'transparent',
    '&:hover': {
        background: 'transparent',
        borderColor: '#22874E',
    },
    '&::placeholder': {
        fontWeight: 500,
        color: '#575757',
    },
    '&:focus': {
        outline: 'none',
        borderColor: '#22874E',
    },
});

export const Queues = () => {
    const { queues, refreshQueues } = useData()
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalQueues, setTotalQueues] = useState(0);
    const [selectedQueue, setSelectedQueue] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [buttonClicked, setButtonClicked] = useState('');
    const [confirmation, setConfirmation] = useState('')
    const { agentAuthState } = useContext(AuthContext)

    useEffect(() => {
        refreshQueues();
    }, []);
    useEffect(() => {
        setTotalQueues(queues.length)
    }, [queues])


    const handleChangePage = (e, newValue) => {
        setPage(newValue);
    };

    const handleChangeRowsPerPage = (e) => {
        setSize(e.target.value);
        setPage(0);
    };

    const handleDialogOpen = (queue, button) => {
        setSelectedQueue(queue);
        setButtonClicked(button);

        if (button === 'edit') {
            setOpenDialog(true);
        } else if (button === 'delete') {
            setOpenDeleteDialog(true);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        refreshQueues();
    };

    const handleEdited = () => {
        handleDialogClose();
        refreshQueues();
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = () => {
        handleDeleteDialogClose();
        refreshQueues();
    };

    return (
        <Layout
            title={'Queue List'}
            subtitle={'View your queues and add new ones'}
            buttonInfo={{
                label: 'Add queue',
                icon: <Plus size={20} />,
            }}
            AddResource={AddQueue}
            refreshResource={refreshQueues}
            setConfirmation={setConfirmation}
        >
            {confirmation && (
                <Alert severity="success" onClose={() => setConfirmation('')} icon={false} sx={{mb: 2, border: '1px solid rgb(129, 199, 132);'}} >
                    {confirmation}
                </Alert>	
            )}
            <WhiteContainer noPadding>
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
                    <Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
                        <SearchTextField
                            disabled
                            type='text'
                            label='Search'
                            variant='filled'
                            placeholder='Search'
                            sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
                        />
                        <Box
                            sx={{
                                width: '42px',
                                height: '40px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Search size={20} />
                        </Box>
                    </Box>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                background: '#F1F4F2',
                                '& .MuiTypography-overline': {
                                    color: '#545555',
                                },
                            }}
                        >
                            <TableCell>
                                <Typography variant='overline'>Title</Typography>
                            </TableCell>
                            {agentAuthState.isAdmin && <TableCell>
                                <Typography variant='overline'>Default queue</Typography>
                            </TableCell>}
                            <TableCell>
                                <Typography variant='overline'>Updated</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='overline'>Created</Typography>
                            </TableCell>
                            <TableCell align='right'>
                                <Typography variant='overline'></Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queues.slice(page * size, page * size + size).map((queue) => (
                            <TableRow
                                key={queue.queue_id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '& .MuiTableCell-root': {
                                        color: '#1B1D1F',
                                        fontWeight: 500,
                                        letterSpacing: '-0.02em',
                                    },
                                }}
                            >
                                <TableCell>{queue.title}</TableCell>
                                {agentAuthState.isAdmin && <TableCell>
                                    {!queue.agent_id ? 'True' : 'False'}
                                </TableCell>}
                                <TableCell>{formatDate(queue.updated, 'MM-DD-YY hh:mm A')}</TableCell>
                                <TableCell>{formatDate(queue.created, 'MM-DD-YY hh:mm A')}</TableCell>
                                <TableCell component='th' scope='row' align='right'>
                                    <Stack direction='row' spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton
                                            sx={{
                                                '&:hover': {
                                                    background: '#f3f6fa',
                                                    color: '#105293',
                                                },
                                            }}
                                            onClick={() => handleDialogOpen(queue, 'edit')}
                                        >
                                            <Pencil size={18} />
                                        </IconButton>

                                        <IconButton
                                            sx={{
                                                '&:hover': {
                                                    background: '#faf3f3',
                                                    color: '#921010',
                                                },
                                            }}
                                            onClick={() => handleDialogOpen(queue, 'delete')}
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box>
                    <TablePagination
                        component='div'
                        count={totalQueues}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={size}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </WhiteContainer>

            {buttonClicked === 'edit' && (
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    onClose={handleDialogClose}
                    PaperProps={{
                        sx: {
                            width: '100%',
                            maxWidth: 'unset',
                            height: 'calc(100% - 64px)',
                            maxHeight: 'unset',
                            margin: 0,
                            background: '#f1f4f2',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            padding: 2,
                        },
                    }}
                    sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
                >
                    <Box sx={{ width: '700px', margin: '14px auto 0px', textAlign: 'center' }}>
                        <IconButton
                            aria-label='close dialog'
                            onClick={handleDialogClose}
                            sx={{
                                width: '40px',
                                height: '40px',
                                position: 'fixed',
                                right: '26px',
                                top: 'calc(64px + 26px)',
                                color: '#545555',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    color: '#000',
                                },
                            }}
                        >
                            <X size={20} />
                        </IconButton>

                        <AddQueue handleEdited={handleEdited} editQueue={selectedQueue} setConfirmation={setConfirmation} />
                    </Box>
                </Dialog>
            )}

            {buttonClicked === 'delete' && (
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    PaperProps={{
                        sx: {
                            maxWidth: '500px',
                            background: '#f1f4f2',
                            py: 2,
                            px: 3,
                            m: 2,
                            borderRadius: '10px',
                        },
                    }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ width: '100%', textAlign: 'right', pb: 2 }}>
                            <IconButton
                                aria-label='close dialog'
                                onClick={handleDeleteDialogClose}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    color: '#545555',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        color: '#000',
                                    },
                                }}
                            >
                                <X size={20} />
                            </IconButton>
                        </Box>

                        <DeleteQueue editQueue={selectedQueue} handleDelete={handleDelete} handleClose={handleDeleteDialogClose} setConfirmation={setConfirmation} />
                    </Box>
                </Dialog>
            )}
        </Layout>
    );
};

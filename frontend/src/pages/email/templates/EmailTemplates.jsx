import { Box, Dialog, Drawer, IconButton, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { CircleCheck, CircleX, MailPlus, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/layout';
import { Transition } from '../../../components/sidebar';
import { WhiteContainer } from '../../../components/white-container';
import { useData } from '../../../context/DataContext';
import { AddTemplate } from './AddTemplate';
import { DeleteTemplate } from './DeleteTemplate';
import { TemplateDetail } from './TemplateDetail';

export const EmailTemplates = () => {
	const { templates, refreshTemplates } = useData();

	const [openDetail, setOpenDetail] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalTemplates, setTotalTemplates] = useState(0);
	const [buttonClicked, setButtonClicked] = useState('');
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const navigate = useNavigate();
	const { templateId } = useParams();

	const [selectedTemplate, setSelectedTemplate] = useState({});

	useEffect(() => {
		if (templates.length > 0 && templateId) {
			const template = {
				template_id: parseInt(templateId, 10),
			};
			setOpenDetail(true);
			setSelectedTemplate(template);
		}
	}, [templates, templateId]);

	useEffect(() => {
		refreshTemplates();
	}, []);

	useEffect(() => {
		setTotalTemplates(templates.length);
	}, [templates]);

	const toggleDetailDrawer =
		(newOpen, template = null) =>
		() => {
			if (newOpen) {
				navigate('/email/templates/' + template.template_id);
			} else {
				navigate('/email/templates');
			}
			setOpenDetail(newOpen);
			setSelectedTemplate(template);
			refreshTemplates();
		};

	const handleDialogOpen = (event, template, button) => {
		event.stopPropagation();

		setSelectedTemplate(template);
		setButtonClicked(button);

		if (button === 'edit') {
			setOpenDialog(true);
		} else if (button === 'delete') {
			setOpenDeleteDialog(true);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		refreshTemplates();
	};

	const handleTemplateEdited = () => {
		handleDialogClose();
		refreshTemplates();
	};

	const handleTemplateCreated = () => {
		handleDialogClose();
		refreshTemplates();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshTemplates();
	};

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value);
		setPage(0);
	};

	const transformString = (inputString) => {
		const words = inputString.split('_');
		return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ');
	};

	return (
		<Layout
			title={'Templates'}
			subtitle={'View all email templates'}
			buttonInfo={{
				label: 'Add template',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
			AddResource={AddTemplate}
			refreshResource={refreshTemplates}
		>
			<WhiteContainer noPadding>
				{templates.length !== 0 && (
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
									<Typography variant='overline'>Template Name</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Active</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Notes</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Updated</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography variant='overline'></Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{templates.slice(page * size, page * size + size).map((template) => (
								<TableRow
									key={template.template_id}
									onClick={toggleDetailDrawer(true, template)}
									sx={{
										'&:last-child td, &:last-child th': { border: 0 },
										'& .MuiTableCell-root': {
											color: '#1B1D1F',
											fontWeight: 500,
											letterSpacing: '-0.02em',
										},
										'&:hover': {
											background: '#f9fbfa',
											cursor: 'pointer',
										},
									}}
								>
									<TableCell component='th' scope='row' sx={{ maxWidth: '200px' }}>
										{transformString(template.code_name)}
									</TableCell>
									<TableCell>{template.active === 1 ? <CircleCheck color='green' /> : <CircleX color='red' />}</TableCell>
									<TableCell>{template.notes}</TableCell>
									<TableCell>{template.updated.replace('T', ' ')}</TableCell>
									<TableCell component='th' scope='row' align='right'>
										<Stack
											direction='row'
											// spacing={0.5}
											sx={{ justifyContent: 'flex-end' }}
										>
											<IconButton onClick={(event) => handleDialogOpen(event, template, 'edit')}>
												<Pencil size={18} />
											</IconButton>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
				<Box>
					<TablePagination
						component='div'
						count={totalTemplates}
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
					<Box sx={{ maxWidth: '650px', margin: '14px auto 0px', textAlign: 'center' }}>
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

						<AddTemplate handleCreated={handleTemplateCreated} handleEdited={handleTemplateEdited} editTemplate={selectedTemplate} />
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

						<DeleteTemplate editTemplate={selectedTemplate} handleDelete={handleDelete} handleClose={handleDeleteDialogClose} />
					</Box>
				</Dialog>
			)}

			<Drawer
				open={openDetail}
				anchor={'right'}
				onClose={toggleDetailDrawer(false)}
				PaperProps={{
					sx: {
						minWidth: 700,
						maxWidth: 735,
						margin: '12px',
						height: 'calc(100vh - 24px)',
						borderRadius: '24px',
						background: '#F1F4F2',
					},
				}}
			>
				<TemplateDetail templateInfo={selectedTemplate} openEdit={handleDialogOpen} closeDrawer={toggleDetailDrawer(false)} />
			</Drawer>
		</Layout>
	);
};

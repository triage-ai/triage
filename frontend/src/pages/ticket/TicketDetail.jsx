import { Box, Chip, FormControl, IconButton, MenuItem, Select, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CalendarClock, ChevronDown, FileText, Info, Network, Pencil, User, X } from 'lucide-react';
import { RichTextReadOnly } from 'mui-tiptap';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { StyledInput } from '../../components/custom-select';
import { extensions } from '../../components/rich-text-editor';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTicketBackend } from '../../hooks/useTicketBackend';

const IconBox = styled(Box)(() => ({
	height: '35px',
	width: '35px',
	flex: '0 0 35px',
	background: '#ecffef',
	borderRadius: '8px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#6e917d',
	marginRight: '12px',
}));

export const TicketDetail = ({ ticket, closeDrawer, updateCurrentTicket, openEdit, type }) => {

	TicketDetail.propTypes = {
		ticket: PropTypes.object,
		closeDrawer: PropTypes.func,
		updateCurrentTicket: PropTypes.func,
		openEdit: PropTypes.func,
		type: PropTypes.string,
	}

	const { updateTicket } = useTicketBackend();

	const { refreshStatuses, statuses } = useData();

	const { permissions } = useContext(AuthContext);

	const handleStatusChange = (e) => {
		const statusUpdate = {
			status_id: statuses.find((x) => x.name === e.target.value).status_id,
			ticket_id: ticket.ticket_id,
		};
		updateTicket(statusUpdate)
			.then((res) => {
				updateCurrentTicket(res.data);
			})
			.catch((err) => alert('Error while updating ticket status'));
	};

	useEffect(() => {
		if (type === 'agent') {
			refreshStatuses();
		}
		// eslint-disable-next-line
	}, []);

	const openEditModal = (event, ticket) => {
		closeDrawer();
		openEdit(event, ticket);
	};

	return (
		<Box sx={{ height: '100%', width: '100%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
			{ticket && (
				<>
					<Box
						px={'28px'}
						py={'20px'}
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography variant='subtitle2' mr={0.5}>
								Ticket number
							</Typography>
							<Typography variant='h6' fontWeight={600}>
								#{ticket.number}
							</Typography>
							{type === 'agent' && (
								<>
									<Typography variant='h6' mx={1}>
										•
									</Typography>
										<Chip
											label={ticket.priority.priority_desc}
											sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
										/>
										{ticket.overdue === 1 && ( 
											<Chip
												label='Overdue'
												sx={{ backgroundColor: '#f77c7c', marginLeft: '8px'}}
											/>
										)}
								</>
							)}
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							{(type === 'user' || permissions.hasOwnProperty('ticket.edit')) && (
								<>
									<IconButton
										sx={{ border: '1px solid #E5EFE9', borderRadius: '8px' }}
										aria-label='edit'
										onClick={(event) => openEditModal(event, ticket)}
									>
										<Pencil size={20} color='#6E7772' />
									</IconButton>

									<Box sx={{ borderLeft: '1.5px solid #E5EFE9', height: '24px' }} ml={2.25} mr={1} />
								</>
							)}

							<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={closeDrawer}>
								<X color='#6E7772' strokeWidth={1.5} />
							</IconButton>
						</Box>
					</Box>
					<Box
						sx={{
							overflowY: 'auto',
							height: '100%',
							width: '100%',
						}}
					>
						<Box px={'28px'} pb={'20px'}>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
								// alignItems={'center'}
								justifyContent={'space-between'}
								bgcolor={'#fff'}
								position={'relative'}
								zIndex={1}
								sx={{ p: '20px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
							>
								<Box display={'flex'} flexDirection={'column'}>
									<Typography variant='caption' mb={'6px'} className='text-muted'>
										Ticket Title
									</Typography>

									<Typography variant='h6' fontWeight={600} lineHeight={1}>
										{ticket.title}
									</Typography>
								</Box>

								{type === 'agent' ? (
									<Box display={'flex'} alignItems={'center'}>
										<Typography variant='caption' className='text-muted' fontWeight={600}>
											Status
										</Typography>

										<FormControl fullWidth sx={{ m: 1, minWidth: 120 }} size='small'>
											<Select
												displayEmpty
												value={ticket.status?.name || ''}
												onChange={handleStatusChange}
												input={<StyledInput />}
												disabled={!permissions.hasOwnProperty('ticket.edit')}
												renderValue={(item) => (
													<Box display={'flex'} alignItems={'center'}>
														<Box
															width={'6px'}
															height={'6px'}
															borderRadius={'6px'}
															marginRight={1}
															sx={{ backgroundColor: '#D9D9D9' }}
														/>

														<Typography variant='subtitle2' fontWeight={600} sx={{ color: '#1B1D1F' }}>
															{item}
														</Typography>
													</Box>
												)}
												sx={{
													'.MuiOutlinedInput-notchedOutline': {
														borderRadius: '8px',
														borderColor: '#E5EFE9',
													},
												}}
												IconComponent={CustomChevron}
											>
												{statuses
													.filter(status => {
														if (!permissions.hasOwnProperty('ticket.close') && status.state === 'closed') {
															return false;
														}
														return true;
													})
													.map(status => (
														<MenuItem key={status.status_id} value={status.name}>
															<Typography variant='subtitle2'>{status.name}</Typography>
														</MenuItem>
													))
												}
											</Select>
										</FormControl>
									</Box>
								) : (
									<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
										<Typography variant='caption' className='text-muted' fontWeight={600}>
											Status
										</Typography>
										<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
											{ticket.status.name}
										</Typography>
									</Box>
								)}
							</Box>

							<Box
								width={'100%'}
								height={'100%'}
								display={'flex'}
								// alignItems={'flex-end'}
								// justifyContent={'space-between'}
								// position={'absolute'}
								// top={'10px'}
								mt={'-24px'}
								pt={'40px'}
								bgcolor={'#FCFEFD'}
								sx={{ pt: '40px', px: '16px', pb: '16px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
							>
								<Box display={'flex'}>
									<Box>
										<FileText size={20} color='#6E7772' strokeWidth={1.5} />
									</Box>
									<Box
										ml={1}
										mb={'-4px'}
										sx={{
											'& .ProseMirror p': {
												fontSize: 'small',
												fontWeight: 500,
											},
										}}
									>
										<RichTextReadOnly content={ticket.description} extensions={extensions} />
									</Box>
								</Box>

							</Box>
						</Box>

						{type === 'agent' && (
							<Grid container px={'28px'} py={'20px'}>
								<Grid size={{ xs: 4 }}>
									<Box display={'flex'} alignItems={'flex-start'}>
										<IconBox>
											<CalendarClock size={18} />
										</IconBox>

										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												Due date
											</Typography>
											<Typography variant='subtitle2' color={'#1B1D1F'} fontWeight={600}>
												{ticket.due_date
													? new Date(ticket.due_date)
														.toLocaleDateString('en-US', {
															day: '2-digit',
															month: 'short',
															year: 'numeric',
														})
														.replace(',', ' ')
													: new Date(ticket.est_due_date)
														.toLocaleDateString('en-US', {
															day: '2-digit',
															month: 'short',
															year: 'numeric',
														})
														.replace(',', ' ')
												}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid size={{ xs: 4 }}>
									<Box display={'flex'} alignItems={'flex-start'}>
										<IconBox>
											<Network size={18} />
										</IconBox>

										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												Department
											</Typography>
											<Typography
												variant='subtitle2'
												color={'#1B1D1F'}
												fontWeight={600}
												sx={{
													flexWrap: 'wrap',
													wordBreak: 'break-word',
												}}
											>
												{ticket.dept.name}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid size={{ xs: 4 }}>
									<Box display={'flex'} alignItems={'flex-start'}>
										<IconBox>
											<User size={18} />
										</IconBox>

										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												User
											</Typography>
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
										</Box>
									</Box>
								</Grid>
							</Grid>
						)}

						{type === 'agent' ? (
							<Box
								px={'28px'}
								py={'20px'}
								// mb={'28px'}
								borderTop={'1px solid #E5EFE9'}
								borderBottom={'1px solid #E5EFE9'}
								display={'flex'}
								alignItems={'center'}
								justifyContent={'space-between'}
							>
								<Box display={'flex'} alignItems={'flex-start'}>
									<Typography variant='subtitle1' fontWeight={600} className='text-muted' mr={1}>
										Agent
									</Typography>

									<Typography
										variant='subtitle1'
										fontWeight={600}
										fontSize={'1.0625rem'}
										sx={{
											flexWrap: 'wrap',
											wordBreak: 'break-word',
										}}
									>
										{ticket.agent ? ticket.agent.firstname + ' ' + ticket.agent.lastname : 'Not assigned'}
									</Typography>
								</Box>
							</Box>
						) : (
							<Box borderBottom={'1px solid #E5EFE9'} width={'100%'} />
						)}

						<Box px={'28px'} py={'20px'}>
							<Typography variant='subtitle1' fontWeight={700} mb={'21px'}>
								Extra information
							</Typography>

							<Grid container>
								<Grid size={{ xs: 6 }}>
									<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} sx={{ pb: 3 }}>
										<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
											SLA
										</Typography>
										<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
											{ticket.sla.name}
										</Typography>
									</Box>
									{ticket?.form_entry?.form?.fields?.map((field, idx) => (
										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} key={field.label} sx={{ pb: 3 }}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												{field.label}
											</Typography>
											<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
												{ticket?.form_entry?.values[idx]?.value ?? ''}
											</Typography>
										</Box>
									))}
								</Grid>

								<Grid size={{ xs: 6 }}>
									<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
										<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
											Topic
										</Typography>
										<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
											{ticket.topic.topic}
										</Typography>
									</Box>
								</Grid>

								{ticket.group && (
									<Grid size={{ xs: 6 }}>
										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												Group
											</Typography>
											<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
												{ticket.group.name}
											</Typography>
										</Box>
									</Grid>
								)}

								{ticket.category && (
									<Grid size={{ xs: 6 }}>
										<Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
											<Typography variant='overline' className='text-muted' sx={{ opacity: 0.7 }}>
												Category
											</Typography>
											<Typography variant='subtitle1' color={'#1B1D1F'} fontWeight={600}>
												{ticket.category.name}
											</Typography>
										</Box>
									</Grid>
								)}
							</Grid>
						</Box>
					</Box>

					<Typography
						variant='caption'
						className='text-muted'
						// width={'100%'}
						// bgcolor={'#fff'}
						// position={'absolute'}
						// bottom={0}
						// left={0}
						pt={'5px'}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
						gap={0.25}
					// sx={{ transform: 'translateX(-50%)' }}
					>
						<Info size={16} strokeWidth={1.25} /> Created {ticket.created} • Last updated {ticket.updated}
					</Typography>
				</>
			)}
		</Box>
	);
};

export const CustomChevron = (props) => (<ChevronDown {...props} size={17} color='#1B1D1F' />)
import {
	Box,
	Button, IconButton, styled,
	Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import {
	Calendar, FileText,
	Info,
	Network, Pencil, User,
	X
} from 'lucide-react';
import { useTicketBackend } from '../../hooks/useTicketBackend';

const IconBox = styled(Box)(() => ({
	height: '35px',
	width: '35px',
	background: '#ecffef',
	borderRadius: '8px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#6e917d',
	marginRight: '12px',
}));

export const UserTicketDetail = ({ ticket, closeDrawer, updateCurrentTicket, openEdit }) => {
	const { updateTicket } = useTicketBackend();

	const openEditModal = (event, ticket) => {
		// closeDrawer();
		openEdit(event, ticket);
	};

	return (
		<Box sx={{ height: '100%', padding: '28px', position: 'relative' }}>
			{ticket && (
				<>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: '24px',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography
								variant="subtitle2"
								mr={0.5}
							>
								Ticket number
							</Typography>
							<Typography
								variant="h6"
								fontWeight={600}
							>
								#{ticket.number}
							</Typography>
							<Typography
								variant="h6"
								mx={1}
							>
								{/* • */}
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<IconButton
								sx={{ border: '1px solid #E5EFE9', borderRadius: '8px' }}
								aria-label="edit"
								onClick={event => {
									openEditModal(event, ticket);
								}}
							>
								<Pencil
									size={20}
									color="#6E7772"
								/>
							</IconButton>

							<Box
								sx={{ borderLeft: '1.5px solid #E5EFE9', height: '24px' }}
								ml={2.25}
								mr={1}
							/>

							<IconButton
								sx={{ borderRadius: '8px' }}
								aria-label="edit"
								onClick={closeDrawer}
							>
								<X
									color="#6E7772"
									strokeWidth={1.5}
								/>
							</IconButton>
						</Box>
					</Box>

					<Box
						position={'relative'}
						mb={12}
					>
						<Box
							display={'flex'}
							alignItems={'center'}
							justifyContent={'space-between'}
							bgcolor={'#fff'}
							position={'relative'}
							zIndex={1}
							sx={{ p: '20px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
						>
							<Box
								display={'flex'}
								flexDirection={'column'}
							>
								<Typography
									variant="caption"
									mb={'6px'}
									className="text-muted"
								>
									Ticket Title
								</Typography>

								<Typography
									variant="h6"
									fontWeight={600}
									lineHeight={1}
								>
									{ticket.title}
								</Typography>
							</Box>

							<Box
								display={'flex'}
								flexDirection={'column'}
								alignItems={'flex-start'}
							>
								<Typography
									variant="caption"
									className="text-muted"
									fontWeight={600}
								>
									Status
								</Typography>
								<Typography
									variant="subtitle1"
									color={'#1B1D1F'}
									fontWeight={600}
								>
									{ticket.status.name}
								</Typography>
							</Box>
						</Box>

						<Box
							width={'100%'}
							height={'100%'}
							display={'flex'}
							alignItems={'flex-end'}
							justifyContent={'space-between'}
							position={'absolute'}
							top={'60%'}
							bgcolor={'#FCFEFD'}
							sx={{ p: '16px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
						>
							<Box
								display={'flex'}
								alignItems={'center'}
							>
								<FileText
									color="#6E7772"
									strokeWidth={1.5}
								/>
								<Typography
									variant="subtitle2"
									ml={1}
									mb={'-4px'}
								>
									{ticket.description}
								</Typography>
							</Box>

							<Button
								variant="text"
								sx={{ color: '#22874E', marginBottom: '-7px' }}
							>
								<Typography
									variant="subtitle2"
									color={'#22874E'}
									textTransform={'none'}
									fontWeight={600}
								>
									Edit
								</Typography>
							</Button>
						</Box>
					</Box>

					<Grid
						container
						mb={'36px'}
					>
						<Grid size={{ xs: 4 }}>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<Calendar size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Created
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.created
											? new Date(ticket.created)
													.toLocaleDateString('en-US', {
														day: '2-digit',
														month: 'short',
														year: 'numeric',
													})
													.replace(',', ' ')
											: 'Not set'}
									</Typography>
								</Box>
							</Box>
						</Grid>

						<Grid size={{ xs: 4 }}>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<Network size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Department
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.dept.name}
									</Typography>
								</Box>
							</Box>
						</Grid>

						<Grid size={{ xs: 4 }}>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<User size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										User
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.user.firstname + ' ' + ticket.user.lastname}
									</Typography>
								</Box>
							</Box>
						</Grid>
					</Grid>

					<Box>
						<Typography
							variant="subtitle1"
							fontWeight={700}
							mb={'21px'}
						>
							Extra information
						</Typography>

						<Grid container>
							<Grid size={{ xs: 6 }}>
								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
									sx={{ pb: 3 }}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Topic
									</Typography>
									<Typography
										variant="subtitle1"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.topic.topic}
									</Typography>
								</Box>

								{ticket?.form_entry?.form?.fields?.map((field, idx) => (
									<Box
										display={'flex'}
										flexDirection={'column'}
										alignItems={'flex-start'}
										key={idx}
										sx={{ pb: 3 }}
									>
										<Typography
											variant="overline"
											className="text-muted"
											sx={{ opacity: 0.7 }}
										>
											{field.label}
										</Typography>
										<Typography
											variant="subtitle1"
											color={'#1B1D1F'}
											fontWeight={600}
										>
											{ticket?.form_entry?.values[idx]?.value ?? ''}
										</Typography>
									</Box>
								))}
							</Grid>

							{ticket.group && (
								<Grid size={{ xs: 6 }}>
									<Box
										display={'flex'}
										flexDirection={'column'}
										alignItems={'flex-start'}
									>
										<Typography
											variant="overline"
											className="text-muted"
											sx={{ opacity: 0.7 }}
										>
											Group
										</Typography>
										<Typography
											variant="subtitle1"
											color={'#1B1D1F'}
											fontWeight={600}
										>
											{ticket.group.name}
										</Typography>
									</Box>
								</Grid>
							)}

							{ticket.category && (
								<Grid size={{ xs: 6 }}>
									<Box
										display={'flex'}
										flexDirection={'column'}
										alignItems={'flex-start'}
									>
										<Typography
											variant="overline"
											className="text-muted"
											sx={{ opacity: 0.7 }}
										>
											Category
										</Typography>
										<Typography
											variant="subtitle1"
											color={'#1B1D1F'}
											fontWeight={600}
										>
											{ticket.category.name}
										</Typography>
									</Box>
								</Grid>
							)}
						</Grid>
					</Box>

					<Typography
						variant="caption"
						className="text-muted"
						width={'100%'}
						position={'absolute'}
						bottom={12}
						left={0}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
						gap={0.25}
						// sx={{ transform: 'translateX(-50%)' }}
					>
						<Info
							size={16}
							strokeWidth={1.25}
						/>{' '}
						Created {ticket.created} • Last updated {ticket.updated}
					</Typography>
				</>
			)}
		</Box>
	);
};

// import React, { Fragment, useEffect, useState } from 'react';
// import { Sidebar } from '../../components/sidebar';
// import {
// 	Accordion,
// 	AccordionDetails,
// 	AccordionSummary,
// 	Alert,
// 	Badge,
// 	Box,
// 	Button,
// 	Divider,
// 	Grid,
// 	IconButton,
// 	List,
// 	ListItem,
// 	ListItemText,
// 	Snackbar,
// 	TextField,
// 	Tooltip,
// 	Typography,
// 	keyframes,
// 	styled,
// } from '@mui/material';
// import { Footer } from '../../components/footer';
// import { TableColorBox } from '../build/build';
// import {
// 	BookUp2,
// 	ChevronDown,
// 	Download,
// 	Languages,
// 	NotebookPen,
// 	Trash2,
// 	Upload,
// } from 'lucide-react';
// import { VisuallyHiddenInput } from '../fine-tune/fine-tune-row';
// import { useModelBackend } from '../../hooks/useModelBackend';

// export const MenuTab = styled(Box)(({ theme }) => ({
// 	display: 'flex',
// 	flex: '0 0 50%',
// 	padding: '20px 16px',
// 	borderRadius: '12px',
// 	transition: 'all .2s',
// 	cursor: 'pointer',
// 	'&.active': {
// 		background: '#FCFCFC',
// 		boxShadow:
// 			'0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
// 	},
// 	'& .MuiTypography-h4': {
// 		fontSize: '2.5rem',
// 		'@media (max-width: 760px)': {
// 			fontSize: '2rem',
// 		},
// 		'@media (max-width: 690px)': {
// 			fontSize: '1.25rem',
// 		},
// 		lineHeight: 1.2,
// 		fontWeight: 600,
// 		letterSpacing: '-.03em',
// 	},
// }));

// const fadeIn = keyframes`   
// from {
//     opacity: 0.5;
//   }
//   to {
//     opacity: 1;
//   }
// `;

// const ActiveContentContainer = styled(Grid)(() => ({
// 	'&.show-container': {
// 		// animation: `${fadeIn} .3s`,
// 	},
// 	'&.hide-container': {
// 		opacity: 0,
// 		display: 'none',
// 	},
// }));

// const CustomTextField = styled(TextField)(() => ({
// 	m: 0,
// 	width: '100%',
// 	'& fieldset': { border: 'none' },
// 	'& input::placeholder, & textarea::placeholder': {
// 		fontSize: '0.9375rem',
// 		fontWeight: 600,
// 		opacity: 1,
// 		color: '#575757',
// 	},
// 	'& .MuiInputBase-root': {
// 		background: '#F4F4F4',
// 		border: '2px solid transparent',
// 		borderRadius: '12px',
// 		fontWeight: 600,
// 		color: '#000',
// 		transition: 'all .3s',
// 		padding: 0,

// 		'&.Mui-focused': {
// 			background: '#FFF',
// 			borderRadius: '12px',
// 			border: '2px solid #EFEFEF',
// 		},
// 	},
// 	'& .MuiInputBase-input': {
// 		padding: '10.5px 14px',
// 	},
// }));

// const allowedExtensions = ['csv'];
// const initialLabeledTicket = {
// 	title: '',
// 	description: '',
// 	category: '',
// };

// export const Test = ({ handlePublishProgress }) => {
// 	const [activeTab, setActiveTab] = useState('manual');
// 	const [ticketTitle, setTicketTitle] = useState('');
// 	const [ticketDescription, setTicketDescription] = useState('');
// 	const [ticketExtraInfo, setTicketExtraInfo] = useState('');
// 	const [ticketLabel, setTicketLabel] = useState('Performance');
// 	const [categories, setCategories] = useState([]);

// 	const [files, setFiles] = useState([]);
// 	const [snackbarError, setSnackbarError] = useState(false);
// 	const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');

// 	const [labeledTicket, setLabeledTicket] = useState(initialLabeledTicket);
// 	const [labeledTickets, setLabeledTickets] = useState([]);
// 	const [loadingTest, setLoadingTest] = useState(null);

// 	const [metrics, setMetrics] = useState(null);
// 	const [loadingMetrics, setLoadingMetrics] = useState(null);

// 	const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
// 	const [finishedDeploying, setFinishedDeploying] = useState(false);

// 	const [activeModel, setActiveModel] = useState('');

// 	const { testIndividualTicket, testUploadedFiles, publishModelIntoProd } = useModelBackend();

// 	useEffect(() => {
// 		setCategoryList();
// 		// handlePublishProgress('test', /*finished*/ true);

// 		window.addEventListener('storage', () => {
// 			setCategoryList();
// 		});
// 	}, []);

// 	const setCategoryList = () => {
// 		const activeModel = sessionStorage.getItem('activeModel');
// 		setActiveModel(activeModel);

// 		if (sessionStorage.getItem('categories')) {
// 			const parsedCategories = JSON.parse(sessionStorage.getItem('categories')).filter(
// 				category => category.model === activeModel
// 			);
// 			setCategories(parsedCategories);
// 		}
// 	};

// 	const testTicket = () => {
// 		setLoadingTest(true);
// 		setLabeledTicket(initialLabeledTicket);

// 		const ticketInfo = {
// 			title: ticketTitle,
// 			label: ticketLabel,
// 			description: ticketDescription,
// 		};

// 		testIndividualTicket(ticketInfo)
// 			.then(res => {
// 				const responseArray = Object.entries(res.data[ticketTitle]);
// 				const matchedCategory = responseArray.reduce(function (prev, current) {
// 					return prev && prev[1] > current[1] ? prev : current;
// 				})[0];

// 				const ticketResponse = {
// 					title: ticketTitle,
// 					description: ticketDescription,
// 					category: matchedCategory,
// 				};
// 				setLoadingTest(false);
// 				setLabeledTicket(ticketResponse);

// 				const tickets = [...labeledTickets];
// 				tickets.push(ticketResponse);
// 				setLabeledTickets(tickets);

// 				setExpandedAccordionIndex(
// 					categories.findIndex(category => category.name === matchedCategory)
// 				);
// 			})
// 			.catch(err => {
// 				console.error(err);
// 				setLoadingTest(false);
// 			});
// 	};

// 	const testFiles = () => {
// 		setLoadingMetrics(true);

// 		testUploadedFiles(['dev_test.csv'])
// 			// testUploadedFiles(files)
// 			.then(res => {
// 				setLoadingMetrics(false);
// 				setMetrics(res.data);
// 			})
// 			.catch(err => {
// 				console.error(err);
// 				setLoadingMetrics(false);
// 			});
// 	};

// 	const handleSnackbarClose = () => {
// 		setSnackbarError(false);
// 	};

// 	const handleFileUpload = async e => {
// 		if (!e.target.files) {
// 			return;
// 		}

// 		const file = e.target.files[0];

// 		if (!file) {
// 			return;
// 		}

// 		const fileExtension = file.type.split('/')[1];
// 		if (!allowedExtensions.includes(fileExtension)) {
// 			setSnackbarError(true);
// 			setSnackbarErrorMessage('Please upload a .csv file');
// 			return;
// 		}

// 		// 1. create url from the file
// 		const fileUrl = URL.createObjectURL(file);

// 		// 2. use fetch API to read the file
// 		const response = await fetch(fileUrl);

// 		// 3. get the text from the response
// 		const text = await response.text();

// 		// 4. split the text by newline
// 		const lines = text.split('\n');

// 		// 5. map through all the lines and split each line by comma.
// 		const data = lines.map(line => line.replaceAll('"', '').split(','));

// 		const headers = data[0];

// 		if (headers.length === 4) {
// 			if (
// 				!headers[0].includes('ticket_label') ||
// 				!headers[1].includes('title') ||
// 				!headers[2].includes('description') ||
// 				!headers[3].includes('extra_info')
// 			) {
// 				setSnackbarError(true);
// 				setSnackbarErrorMessage('The uploaded file does not follow the header format needed');
// 				return;
// 			}
// 		} else {
// 			setSnackbarError(true);
// 			setSnackbarErrorMessage('The uploaded file does not follow the header format needed');
// 			return;
// 		}

// 		const uploadedFiles = [...files];

// 		const fileObj = {
// 			name: file.name,
// 			size: (file.size / (1024 * 1024)).toFixed(2),
// 			// size: file.size / (1024 * 1024) < 1 ? (1.0).toFixed(2) : (file.size / (1024 * 1024)).toFixed(2),
// 		};
// 		uploadedFiles.push(fileObj);
// 		setFiles(uploadedFiles);
// 	};

// 	const downloadJSON = () => {
// 		const jsonData = JSON.stringify({ metrics }, null, 2);
// 		const blob = new Blob([jsonData], { type: 'application/json' });
// 		const url = URL.createObjectURL(blob);
// 		const link = document.createElement('a');
// 		link.href = url;
// 		link.setAttribute('download', 'metrics.json');
// 		document.body.appendChild(link);
// 		link.click();
// 	};

// 	const deleteLabeledTicketFromCategory = index => {
// 		const arrayToDelete = [...labeledTickets];
// 		arrayToDelete.splice(index, 1);
// 		setLabeledTickets(arrayToDelete);
// 	};

// 	const expandAccordion = (category, index) => (event, newExpanded) => {
// 		setExpandedAccordionIndex(newExpanded ? index : false);
// 	};

// 	const publishModel = () => {
// 		setFinishedDeploying(false);
// 		handlePublishProgress('test', /*finished*/ false);

// 		publishModelIntoProd(categories)
// 			.then(res => {
// 				setFinishedDeploying(true);
// 				sessionStorage.setItem('activeModelEnv', 'prod');
// 				dispatchEvent(new Event('storage'));
// 				handlePublishProgress('test', /*finished*/ true);
// 				console.log(res.data);
// 			})
// 			.catch(err => {
// 				setFinishedDeploying(true);
// 				handlePublishProgress('test', /*finished*/ true);
// 				console.log(err);
// 			});
// 	};

// 	return (
// 		<Box
// 			sx={{
// 				height: 'calc(100% - 80px)',
// 				p: '32px 25px',
// 				pb: 'calc(80px + 32px)',
// 				position: 'relative',
// 			}}
// 		>
// 			<Typography
// 				variant="h4"
// 				sx={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', mb: '24px' }}
// 			>
// 				Model testing
// 			</Typography>

// 			<Grid
// 				container
// 				spacing={2}
// 			>
// 				<Grid
// 					item
// 					xs={12}
// 				>
// 					<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'space-between',
// 								mb: '28px',
// 							}}
// 						>
// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<TableColorBox />
// 								<Typography
// 									variant="h6"
// 									sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
// 								>
// 									Types of testing
// 								</Typography>
// 							</Box>
// 						</Box>

// 						<Box
// 							sx={{
// 								width: '100%',
// 								backgroundColor: '#F4F4F4',
// 								padding: '8px',
// 								borderRadius: '20px',
// 								display: 'flex',
// 							}}
// 						>
// 							<MenuTab
// 								className={activeTab === 'manual' && 'active'}
// 								onClick={() => setActiveTab('manual')}
// 							>
// 								<Box
// 									sx={{
// 										width: '40px',
// 										height: '40px',
// 										borderRadius: '40px',
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'center',
// 										background: '#B1E5FC',
// 										marginRight: '16px',
// 									}}
// 								>
// 									<NotebookPen size={21} />
// 								</Box>
// 								<Box>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#575757' }}
// 									>
// 										Test one ticket at a time
// 									</Typography>

// 									<Typography variant="h4">Micro</Typography>
// 								</Box>
// 							</MenuTab>

// 							<MenuTab
// 								className={activeTab === 'automatic' && 'active'}
// 								onClick={() => setActiveTab('automatic')}
// 							>
// 								<Box
// 									sx={{
// 										width: '40px',
// 										height: '40px',
// 										borderRadius: '40px',
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'center',
// 										background: '#FFBC99',
// 										marginRight: '16px',
// 									}}
// 								>
// 									<BookUp2 size={21} />
// 								</Box>
// 								<Box>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#575757' }}
// 									>
// 										Test your classifier's performance at scale
// 									</Typography>

// 									<Typography variant="h4">Macro</Typography>
// 								</Box>
// 							</MenuTab>
// 						</Box>
// 					</Box>
// 				</Grid>

// 				<ActiveContentContainer
// 					item
// 					xs={12}
// 					md={7}
// 					className={activeTab === 'manual' ? 'show-container' : 'hide-container'}
// 				>
// 					<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'space-between',
// 								mb: '28px',
// 							}}
// 						>
// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<TableColorBox sx={{ background: '#FFBC99' }} />
// 								<Typography
// 									variant="h6"
// 									sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
// 								>
// 									Create fictional ticket for quick testing
// 								</Typography>
// 							</Box>
// 						</Box>

// 						<form>
// 							<CustomTextField
// 								label=""
// 								placeholder="Ticket title"
// 								sx={{ mb: 2 }}
// 								value={ticketTitle}
// 								onChange={event => {
// 									setTicketTitle(event.target.value);
// 								}}
// 							/>

// 							{/* <CustomTextField
// 								label=""
// 								placeholder="Ticket label"
// 								sx={{ mb: 2 }}
// 								value={ticketLabel}
// 								onChange={event => {
// 									setTicketLabel(event.target.value);
// 								}}
// 							/> */}

// 							<CustomTextField
// 								label=""
// 								placeholder="Ticket description"
// 								multiline
// 								minRows={4}
// 								maxRows={4}
// 								sx={{ mb: 2, padding: 0 }}
// 								value={ticketDescription}
// 								onChange={event => {
// 									setTicketDescription(event.target.value);
// 								}}
// 							/>

// 							<CustomTextField
// 								label=""
// 								placeholder="Relevant information (optional)"
// 								multiline
// 								minRows={4}
// 								maxRows={4}
// 								sx={{ mb: 2, padding: 0 }}
// 								value={ticketExtraInfo}
// 								onChange={event => {
// 									setTicketExtraInfo(event.target.value);
// 								}}
// 							/>

// 							<Button
// 								variant="contained"
// 								disableElevation
// 								sx={{
// 									border: 0,
// 									// boxShadow: '0 0 0 2px #22874E inset',
// 									background: '#22874E',
// 									color: '#FFF',
// 									textTransform: 'unset',
// 									fontSize: '0.9375rem',
// 									fontWeight: 700,
// 									borderRadius: '12px',
// 									p: '10px 18px',
// 									transition: 'all 0.3s',
// 									'&:hover': {
// 										background: '#22874E',
// 										color: '#FFF',
// 										border: 0,
// 									},
// 								}}
// 								disabled={loadingTest}
// 								onClick={testTicket}
// 							>
// 								{loadingTest ? 'Testing...' : 'Test ticket'}
// 							</Button>
// 						</form>
// 					</Box>
// 				</ActiveContentContainer>

// 				<ActiveContentContainer
// 					item
// 					xs={12}
// 					md={5}
// 					className={activeTab === 'manual' ? 'show-container' : 'hide-container'}
// 				>
// 					<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'space-between',
// 								mb: '28px',
// 							}}
// 						>
// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<TableColorBox sx={{ background: '#B1E5FC' }} />
// 								<Typography
// 									variant="h6"
// 									sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
// 								>
// 									<span style={{ textTransform: 'capitalize' }}>{activeModel}</span>'s ticket
// 									categories
// 								</Typography>
// 							</Box>
// 						</Box>

// 						{categories.map((category, index) => (
// 							<Accordion
// 								key={category.name}
// 								sx={{
// 									border: 0,
// 									boxShadow: '0 0 0 2px #efefef inset',
// 									background: 'transparent',
// 									py: 0.5,
// 									borderRadius: '12px',
// 									'&:not(:last-child)': {
// 										mb: 2,
// 									},
// 									'&:before': {
// 										content: 'none',
// 									},
// 									'&:last-of-type': {
// 										borderRadius: '12px',
// 									},
// 								}}
// 								className={
// 									labeledTicket && category.name === labeledTicket.category
// 										? 'animated-category'
// 										: ''
// 								}
// 								onChange={
// 									labeledTickets.find(ticket => ticket.category === category.name) &&
// 									expandAccordion(category, index)
// 								}
// 								expanded={
// 									labeledTicket &&
// 									labeledTicket.category === category.name &&
// 									expandedAccordionIndex === index
// 								}
// 							>
// 								<AccordionSummary
// 									expandIcon={
// 										labeledTickets.find(ticket => ticket.category === category.name) && (
// 											<ChevronDown />
// 										)
// 									}
// 									aria-controls="panel1-content"
// 									id="panel1-header"
// 								>
// 									<Typography
// 										variant="body1"
// 										className="category-title"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										{category.name}
// 									</Typography>

// 									{labeledTickets.filter(ticket => ticket.category === category.name).length >
// 										0 && (
// 										<Box
// 											sx={{
// 												background: '#2A85FF',
// 												color: '#FFF',
// 												width: '20px',
// 												height: '20px',
// 												borderRadius: '20px',
// 												marginLeft: 1,
// 												display: 'flex',
// 												alignItems: 'center',
// 												justifyContent: 'center',
// 											}}
// 										>
// 											<Typography
// 												variant="caption"
// 												sx={{ fontWeight: 600 }}
// 											>
// 												{labeledTickets.filter(ticket => ticket.category === category.name).length}
// 											</Typography>
// 										</Box>
// 									)}
// 								</AccordionSummary>
// 								<AccordionDetails>
// 									<>
// 										<Typography
// 											variant="caption"
// 											className="category-title"
// 											sx={{ fontWeight: 600, color: '#575757' }}
// 										>
// 											LABELED TICKETS
// 										</Typography>

// 										<List sx={{ py: 0.5 }}>
// 											{labeledTickets.map(
// 												(ticket, index) =>
// 													ticket.category === category.name && (
// 														<Fragment key={ticket.title + index}>
// 															<ListItem
// 																sx={{ p: 0, py: 0.8 }}
// 																secondaryAction={
// 																	<IconButton
// 																		edge="end"
// 																		aria-label="delete"
// 																		sx={{
// 																			// background: '#EFEFEF',
// 																			color: '#575757',
// 																			padding: '10px',
// 																			transition: 'all 0.3s',
// 																			'&:hover': {
// 																				color: '#ff7474',
// 																			},
// 																		}}
// 																		onClick={() => deleteLabeledTicketFromCategory(index)}
// 																	>
// 																		<Trash2 size={20} />
// 																	</IconButton>
// 																}
// 															>
// 																<ListItemText
// 																	sx={{
// 																		display: 'flex',
// 																		flexDirection: 'column',
// 																		alignItems: 'flex-start',
// 																	}}
// 																	primary={
// 																		<Typography
// 																			variant="subtitle2"
// 																			className="category-title"
// 																			sx={{ fontWeight: 600, color: '#1B1D1F', mb: 0 }}
// 																		>
// 																			{ticket.title}
// 																		</Typography>
// 																	}
// 																	secondary={
// 																		<Typography
// 																			variant="caption"
// 																			className="category-title"
// 																			sx={{
// 																				display: 'inline-block',
// 																				fontWeight: 500,
// 																				color: '#575757',
// 																				width: '80%',
// 																				lineHeight: 1.2,
// 																			}}
// 																		>
// 																			{ticket.description}
// 																		</Typography>
// 																	}
// 																/>
// 															</ListItem>
// 															{index !== labeledTickets.length - 1 && (
// 																<Divider
// 																	variant="inset"
// 																	component="li"
// 																	sx={{ ml: 0, mr: 1, borderColor: '#EFEFEF' }}
// 																/>
// 															)}
// 														</Fragment>
// 													)
// 											)}
// 										</List>
// 									</>
// 								</AccordionDetails>
// 							</Accordion>
// 							/* <Box
// 								sx={{
// 									boxShadow: '0 0 0 2px #efefef inset',
// 									p: 2,
// 									borderRadius: '12px',
// 									display: 'flex',
// 									alignItems: 'center',
// 									'&:not(:last-child)': {
// 										mb: 2,
// 									},
// 								}}
// 								className={row.name === 'Cupcake' ? 'animated-category' : ''}
// 								key={row.name}
// 							>
// 								<Typography
// 									variant="body1"
// 									className="category-title"
// 									sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 								>
// 									{row.name}
// 								</Typography>
// 							</Box> */
// 						))}
// 					</Box>
// 				</ActiveContentContainer>

// 				<ActiveContentContainer
// 					item
// 					xs={12}
// 					md={7}
// 					className={activeTab === 'automatic' ? 'show-container' : 'hide-container'}
// 				>
// 					<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'space-between',
// 								mb: '28px',
// 							}}
// 						>
// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<TableColorBox sx={{ background: '#FFBC99' }} />
// 								<Typography
// 									variant="h6"
// 									sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
// 								>
// 									Upload testing dataset
// 								</Typography>
// 							</Box>
// 						</Box>

// 						<Box
// 							sx={{
// 								width: '100%',
// 								height: '200px',
// 								borderRadius: '12px',
// 								background: '#F4F4F4',
// 								display: 'flex',
// 								flexDirection: 'column',
// 								alignItems: 'center',
// 								justifyContent: 'center',
// 								'&:hover .upload-files-button': {
// 									background: '#FCFCFC',
// 									borderColor: '#9A9FA5',
// 								},
// 							}}
// 						>
// 							<Button
// 								variant="contained"
// 								component="label"
// 								className="upload-files-button"
// 								disableElevation
// 								sx={{
// 									border: '2px solid #EFEFEF',
// 									// boxShadow: '0 0 0 2px #22874E inset',
// 									background: '#FCFCFC',
// 									color: '#1B1D1F',
// 									boxShadow: '0px 12px 13px -6px rgba(0, 0, 0, 0.04)',
// 									textTransform: 'unset',
// 									fontSize: '0.9375rem',
// 									fontWeight: 700,
// 									borderRadius: '12px',
// 									p: '10px 20px',
// 									transition: 'all 0.3s',
// 								}}
// 							>
// 								<Upload style={{ marginRight: '8px' }} />
// 								Click to upload files
// 								<VisuallyHiddenInput
// 									type="file"
// 									accept=".csv"
// 									onChange={handleFileUpload}
// 								/>
// 							</Button>

// 							<Typography
// 								variant="caption"
// 								sx={{ mt: 0.5 }}
// 							>
// 								Only .csv files accepted
// 							</Typography>
// 						</Box>

// 						{files.length > 0 && (
// 							<Box sx={{ backgroundColor: '#FCFCFC', borderRadius: '6px', p: 2, width: '100%' }}>
// 								<Box
// 									sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
// 								>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#575757' }}
// 									>
// 										Files uploaded
// 									</Typography>

// 									<Button
// 										variant="contained"
// 										disableElevation
// 										sx={{
// 											border: 0,
// 											// boxShadow: '0 0 0 2px #22874E inset',
// 											background: '#22874E',
// 											color: '#FFF',
// 											textTransform: 'unset',
// 											fontSize: '0.9375rem',
// 											fontWeight: 700,
// 											borderRadius: '12px',
// 											p: '10px 18px',
// 											transition: 'all 0.3s',
// 											'&:hover': {
// 												background: '#22874E',
// 												color: '#FFF',
// 												border: 0,
// 											},
// 										}}
// 										onClick={testFiles}
// 										disabled={loadingMetrics}
// 									>
// 										Run testing against
// 										<span style={{ textTransform: 'capitalize', marginLeft: 4 }}>
// 											{activeModel}
// 										</span>
// 									</Button>
// 								</Box>

// 								<List sx={{ px: 0, pt: 0.8, pb: 0 }}>
// 									{files.map((file, index) => (
// 										<ListItem
// 											key={index}
// 											sx={{ p: 0, borderTop: index !== 0 ? '1px solid #EFEFEF' : 0 }}
// 											secondaryAction={
// 												<IconButton
// 													edge="end"
// 													aria-label="delete"
// 													sx={{
// 														// background: '#EFEFEF',
// 														color: '#575757',
// 														padding: '10px',
// 														transition: 'all 0.3s',
// 														'&:hover': {
// 															color: '#ff7474',
// 														},
// 													}}
// 												>
// 													<Trash2 size={20} />
// 												</IconButton>
// 											}
// 										>
// 											<ListItemText
// 												primary={
// 													<Typography
// 														variant="subtitle1"
// 														sx={{ fontWeight: 600, mb: -0.8 }}
// 													>
// 														{file.name}
// 													</Typography>
// 												}
// 												secondary={
// 													<Typography
// 														variant="caption"
// 														sx={{ fontWeight: 400, color: '#9A9FA5' }}
// 													>
// 														{file.size}mb
// 													</Typography>
// 												}
// 											/>
// 										</ListItem>
// 									))}
// 								</List>
// 							</Box>
// 						)}
// 					</Box>
// 				</ActiveContentContainer>

// 				<ActiveContentContainer
// 					item
// 					xs={12}
// 					md={5}
// 					className={activeTab === 'automatic' ? 'show-container' : 'hide-container'}
// 				>
// 					<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'space-between',
// 								mb: '28px',
// 							}}
// 						>
// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<TableColorBox sx={{ background: '#B1E5FC' }} />
// 								<Typography
// 									variant="h6"
// 									sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
// 								>
// 									Metrics
// 								</Typography>
// 							</Box>

// 							<Box sx={{ display: 'flex', alignItems: 'center' }}>
// 								<Tooltip title="Translate metrics for easy ingestion">
// 									<IconButton
// 										edge="end"
// 										aria-label="translate metrics"
// 										sx={{
// 											color: '#575757',
// 											padding: '10px',
// 											transition: 'all 0.3s',
// 											mr: '2px',
// 											'&:hover': {
// 												color: '#22874E',
// 											},
// 										}}
// 										onClick={downloadJSON}
// 									>
// 										<Languages size={20} />
// 									</IconButton>
// 								</Tooltip>

// 								<Tooltip title="Download metrics">
// 									<IconButton
// 										edge="end"
// 										aria-label="download metrics"
// 										sx={{
// 											// background: '#EFEFEF',
// 											color: '#575757',
// 											padding: '10px',
// 											transition: 'all 0.3s',
// 											mr: '-8px',
// 											'&:hover': {
// 												color: '#22874E',
// 											},
// 										}}
// 										onClick={downloadJSON}
// 									>
// 										<Download size={20} />
// 									</IconButton>
// 								</Tooltip>
// 							</Box>
// 						</Box>

// 						{metrics && (
// 							<Fragment>
// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'space-between',
// 										'&:not(:last-child)': {
// 											mb: 2,
// 										},
// 									}}
// 								>
// 									<Typography
// 										variant="body1"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										Accuracy rate
// 									</Typography>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
// 									>
// 										{metrics.accuracy}
// 									</Typography>
// 								</Box>

// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'space-between',
// 										'&:not(:last-child)': {
// 											mb: 2,
// 										},
// 									}}
// 								>
// 									<Typography
// 										variant="body1"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										Precision
// 									</Typography>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
// 									>
// 										{metrics.average_precision}
// 									</Typography>
// 								</Box>

// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'space-between',
// 										'&:not(:last-child)': {
// 											mb: 2,
// 										},
// 									}}
// 								>
// 									<Typography
// 										variant="body1"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										Recall
// 									</Typography>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
// 									>
// 										{metrics.recall}
// 									</Typography>
// 								</Box>

// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'space-between',
// 										'&:not(:last-child)': {
// 											mb: 2,
// 										},
// 									}}
// 								>
// 									<Typography
// 										variant="body1"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										F1 Score
// 									</Typography>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
// 									>
// 										{metrics.f1}
// 									</Typography>
// 								</Box>

// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'space-between',
// 										'&:not(:last-child)': {
// 											mb: 2,
// 										},
// 									}}
// 								>
// 									<Typography
// 										variant="body1"
// 										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 									>
// 										ROC-AUC Curves
// 									</Typography>
// 									<Typography
// 										variant="caption"
// 										sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
// 									>
// 										{metrics.roc_auc}
// 									</Typography>
// 								</Box>
// 							</Fragment>
// 						)}

// 						{!metrics && !loadingMetrics && (
// 							<Typography
// 								variant="body1"
// 								sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 							>
// 								No datasets have been sent to test
// 							</Typography>
// 						)}

// 						{!metrics && loadingMetrics && (
// 							<Typography
// 								variant="body1"
// 								sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
// 							>
// 								Fetching all metrics...
// 							</Typography>
// 						)}
// 					</Box>
// 				</ActiveContentContainer>
// 			</Grid>

// 			<Footer
// 				text={
// 					<span>
// 						Happy with your model? Send it to <b>production</b>
// 					</span>
// 				}
// 				buttonText={'Deploy ' + activeModel.charAt(0).toUpperCase() + activeModel.slice(1)}
// 				buttonDisabled={finishedDeploying}
// 				handleClick={publishModel}
// 			/>

// 			<Snackbar
// 				open={snackbarError}
// 				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// 				onClose={handleSnackbarClose}
// 				autoHideDuration={7000}
// 			>
// 				<Alert
// 					onClose={handleSnackbarClose}
// 					severity="error"
// 					variant="filled"
// 					sx={{ width: '100%', borderRadius: '12px !important', '& .MuiAlert-icon': { py: '8px' } }}
// 				>
// 					<Typography
// 						variant="body1"
// 						sx={{ fontSize: '0.9375rem', fontWeight: 600 }}
// 					>
// 						{snackbarErrorMessage}
// 					</Typography>
// 				</Alert>
// 			</Snackbar>
// 		</Box>
// 	);
// };

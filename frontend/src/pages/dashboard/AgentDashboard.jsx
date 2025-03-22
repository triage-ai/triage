import { Box, Stack, styled, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { Settings2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { CustomSelect } from '../../components/custom-select';
import { CustomDatePicker } from '../../components/date-picker';
import { Layout } from '../../components/layout';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useAgentBackend } from '../../hooks/useAgentBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';

const StyledTabs = styled((props) => <Tabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />)({
	'& .Mui-selected': {
		color: '#22874E',
	},
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '2px',
	},
	'& .MuiTabs-indicatorSpan': {
		width: '100%',
		height: '2px',
		backgroundColor: '#22874E',
	},
});

const Header = ({ headers, components }) => {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};


	return (
		<Box>
			{/* Tab Bar */}
			<Box
				sx={{
					display: 'flex',
					mb: 4,
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant='scrollable'
					scrollButtons='auto'
					sx={{
						position: 'relative',
						width: '100%',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: '100%',
							height: '2px',
							background: '#E5EFE9',
							zIndex: -1,
						},
					}}
				>
					{headers.map((header, idx) => (
						<Tab key={idx} label={header.label} sx={{ textTransform: 'none', p: 0, mr: 5 }} />
					))}
				</StyledTabs>
			</Box>

			{/* Tab Content */}
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</WhiteContainer>
		</Box>
	);
};

const calculateNewDate = (date, period) => {
	date = dayjs(date);
	switch (period) {
		case 'Up to today':
			return dayjs().format('MM-DD-YYYY');
		case 'One Week':
			return date.add(1, 'week').format('MM-DD-YYYY');
		case 'Two Weeks':
			return date.add(2, 'week').format('MM-DD-YYYY');
		case 'One Month':
			return date.add(1, 'month').format('MM-DD-YYYY');
		case 'One Quarter':
			return date.add(3, 'month').format('MM-DD-YYYY');
		default:
			return date;
	}
};

export const AgentDashboard = () => {
	return (
		<Layout
			title={'Dashboard'}
			subtitle={'Agent Dashboard'}
			buttonInfo={{
				label: 'Edit Dashboard',
				icon: <Settings2 size={20} />,
				hidden: false,
			}}
		>
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}><Dashboard /></Box>
			</WhiteContainer>
		</Layout>
	);
};

const Dashboard = () => {
	const { getTicketBetweenDates } = useTicketBackend();
	const [selectedDate, setSelectedDate] = useState(dayjs().subtract(1, 'month'));
	const [selectedPeriod, setSelectedPeriod] = useState('Up to today');
	const [timeData, setTimeData] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const [ypoints, setypoints] = useState({ y1: [], y2: [], y3: [] });

	const periodOptions = [
		{ label: "Up to today", value: "Up to today" },
		{ label: "One Week", value: "One Week" },
		{ label: "Two Weeks", value: "Two Weeks" },
		{ label: "One Month", value: "One Month" },
		{ label: "One Quarter", value: "One Quarter" }
	];

	const { refreshDepartments, departments, refreshTopics, topics } = useData();
	useEffect(() => {
		refreshDepartments();
		refreshTopics();
	}, []);

	const components = [
		<Department selectedDate={selectedDate} selectedPeriod={selectedPeriod} category={departments} timedata={timeData} />,
		<Topics selectedDate={selectedDate} selectedPeriod={selectedPeriod} category={topics} timedata={timeData} />,
		<Agent selectedDate={selectedDate} selectedPeriod={selectedPeriod} timedata={timeData} />,
	];

	const handleDateChange = (newDate) => {
		setSelectedDate(newDate);
	};

	const handleSelectChange = (event) => {
		setSelectedPeriod(event.target.value);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleRefresh = async () => {
		try {
			let start_date = selectedDate;
			let end_date = calculateNewDate(start_date, selectedPeriod);
			let points = [];
			let y1 = [];
			let y2 = [];
			let y3 = [];
			start_date = dayjs(start_date).format('MM-DD-YYYY');
			let graph_data = await getTicketBetweenDates(start_date, end_date);

			graph_data.data.forEach((data_point) => {
				points.push(new Date(data_point.date));
				y1.push(data_point.created);
				y2.push(data_point.updated);
				y3.push(data_point.overdue);
			});
			setTimeData([...points]);
			setypoints({ y1: y1, y2: y2, y3: y3 });
		} catch (err) {
			console.error('Error with retrieving the information', err);
		}
	};

	useEffect(() => {
		handleRefresh();
	}, []);

	const valueFormatter = (date) =>
		date.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});

	const xAxisCommon = {
		data: timeData,
		scaleType: 'time',
		valueFormatter,
	};

	return (
		<Box>
			<Stack spacing={2} direction='row' alignItems='center' pb={3}>
				{/* <LocalizationProvider dateAdapter={AdapterDayjs}>
					<DemoContainer components={['DatePicker']}>
						<DatePicker label='Report Timeframe' value={selectedDate} onChange={handleDateChange} />
					</DemoContainer>
				</LocalizationProvider> */}
				<CustomDatePicker
					size='small'
					width='200px'
					onChange={handleDateChange}
					value={selectedDate}
					label='Date'
				/>


				<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
					Period:
				</Typography>

				<CustomSelect
					value={selectedPeriod}
					label='Direction'
					onChange={handleSelectChange}
					sx={{ width: 200 }}
					name='default_ticket_number_sequence'
					fullWidth
					hideEmptyOption
					options={periodOptions}
					size={'small'}
				/>

				{/* <StyledSelect name='default_ticket_number_sequence' value={selectedPeriod} onChange={handleSelectChange} sx={{ width: 200 }}>
					<MenuItem value='Up to today'>Up to today</MenuItem>
					<MenuItem value='One Week'>One Week</MenuItem>
					<MenuItem value='Two Weeks'>Two Weeks</MenuItem>
					<MenuItem value='One Month'>One Month</MenuItem>
					<MenuItem value='One Quarter'>One Quarter</MenuItem>
				</StyledSelect> */}

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleRefresh()}
				>
					Refresh
				</CircularButton>
			</Stack>
			<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
				Ticket Activity
			</Typography>

			<Box sx={{ maxWidth: 800 }}>
				{timeData.length ? (
					<LineChart
						xAxis={[
							{
								...xAxisCommon,
								id: 'bottomAxis',
								scaleType: 'time',
								// tickInterval: (time) => time.getHours() === 0,
							},
						]}
						yAxis={[
							{
								id: 'linearAxis',
								scaleType: 'linear',
							},
						]}
						height={300}
						bottomAxis='bottomAxis'
						leftAxis='linearAxis'
						series={[
							{ curve: 'linear', yAxisId: 'linearAxis', label: 'Created', data: ypoints.y1 },
							{ curve: 'linear', yAxisId: 'linearAxis', label: 'Updated', data: ypoints.y2 },
							{ curve: 'linear', yAxisId: 'linearAxis', label: 'Overdue', data: ypoints.y3 },
						]}
					/>
				) : (
					<p>No Results Found</p>
				)}
			</Box>

			<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
				Statistics
			</Typography>

			<Box>
				<StyledTabs value={tabValue} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
					<Tab label='Department' />
					<Tab label='Topics' />
					<Tab label='Agent' />
				</StyledTabs>

				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</Box>
		</Box>
	);
};

const Department = ({ selectedPeriod, selectedDate, category, timedata }) => {
	const { getDashboardStats } = useTicketBackend();
	const [dashboardData, setDashboardData] = useState([]);

	useEffect(() => {
		const start_date = dayjs(selectedDate).format('MM-DD-YYYY');
		getDashboardStats(start_date, calculateNewDate(selectedDate, selectedPeriod), 'department').then((res) => {
			res.data.forEach((department) => {
				if (category.length) {
					let new_cat = category.find((cat) => cat.dept_id === department.category_id);
					if (new_cat && new_cat.name) {
						department.category_name = new_cat.name;
					}
				}
			});
			setDashboardData(res.data);
		});
	}, [timedata]);


	return (
		<Box>
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
							<Typography variant='overline'>Department</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Created</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Updated</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Overdue</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dashboardData.map((departmentInfo, idx) => (
						<TableRow
							key={idx}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
								'& .MuiTableCell-root': {
									color: '#1B1D1F',
									fontWeight: 500,
									letterSpacing: '-0.02em',
								},
							}}
						>
							<TableCell>{departmentInfo.category_name}</TableCell>
							<TableCell>{departmentInfo.created}</TableCell>
							<TableCell>{departmentInfo.updated}</TableCell>
							<TableCell>{departmentInfo.overdue}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
};

const Topics = ({ selectedPeriod, selectedDate, category, timedata }) => {
	const { getDashboardStats } = useTicketBackend();
	const [dashboardData, setDashboardData] = useState([]);

	useEffect(() => {
		const start_date = dayjs(selectedDate).format('MM-DD-YYYY');
		getDashboardStats(start_date, calculateNewDate(selectedDate, selectedPeriod), 'topics').then((res) => {
			res.data.forEach((department) => {
				if (category.length) {
					let new_cat = category.find((cat) => cat.topic_id === department.category_id);
					department.category_name = new_cat.topic;
				}
			});
			setDashboardData(res.data);
		});
	}, [timedata]);

	return (
		<Box>
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
							<Typography variant='overline'>Topic</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Created</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Updated</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Overdue</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dashboardData.map((categoryInfo, idx) => (
						<TableRow
							key={idx}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
								'& .MuiTableCell-root': {
									color: '#1B1D1F',
									fontWeight: 500,
									letterSpacing: '-0.02em',
								},
							}}
						>
							<TableCell>{categoryInfo.category_name}</TableCell>
							<TableCell>{categoryInfo.created}</TableCell>
							<TableCell>{categoryInfo.updated}</TableCell>
							<TableCell>{categoryInfo.overdue}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
};

const Agent = ({ selectedPeriod, selectedDate, timedata }) => {
	const { getDashboardStats } = useTicketBackend();
	const [dashboardData, setDashboardData] = useState([]);
	const { agentAuthState } = useContext(AuthContext);
	const { getAgentById } = useAgentBackend();
	const [agent, setAgent] = useState([]);

	useEffect(() => {
		const start_date = dayjs(selectedDate).format('MM-DD-YYYY');
		getDashboardStats(start_date, calculateNewDate(selectedDate, selectedPeriod), 'agent').then(res => {
			setDashboardData(res.data);
			getAgentById(agentAuthState.agent_id).then(agentData => {
				setAgent(agentData.data);
			});
		});
	}, [timedata])

	return (
		<Box>
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
							<Typography variant='overline'>Agent Name</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Created</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Updated</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='overline'>Overdue</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dashboardData.map((agentInfo, idx) => (
						<TableRow
							key={idx}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
								'& .MuiTableCell-root': {
									color: '#1B1D1F',
									fontWeight: 500,
									letterSpacing: '-0.02em',
								},
							}}
						>
							<TableCell>{agent.firstname + " " + agent.lastname}</TableCell>
							<TableCell>{agentInfo.created}</TableCell>
							<TableCell>{agentInfo.updated}</TableCell>
							<TableCell>{agentInfo.overdue}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
};

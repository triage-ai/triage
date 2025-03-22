import { Box, styled, Tab, Tabs } from '@mui/material';
import { MessageSquareText, NotepadText } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { TicketDetail } from './TicketDetail';
import { TicketThread } from './TicketThread';

const CircularTab = styled(Tab)(() => ({
	width: '44px',
	height: '44px',
	minWidth: '44px',
	minHeight: '44px',
	borderRadius: '50px',
	background: '#FFF',
	border: '1px solid #E5EFE9',
	padding: 0,
	color: '#6E7772',
	transition: 'border-color 0.3s',
	'&.Mui-selected': {
		border: '1.25px solid #22874E',
		color: '#22874E',
	},
	'&:hover': {
		border: '1.25px solid #22874E',
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			sx={{
				width: 'calc(100% - 80px)',
				background: '#fff',
				borderTopLeftRadius: '24px',
				borderBottomLeftRadius: '24px',
			}}
			{...other}
		>
			{value === index && children}
		</Box>
	);
}

export const TicketDetailContainer = ({ ticketInfo, openEdit, closeDrawer, type }) => {
	const { getTicketById, getTicketByIdForUser } = useTicketBackend();

	const [ticket, setTicket] = useState(null);
	const [value, setValue] = useState(0);
	const { permissions } = useContext(AuthContext)

	function datetime_sort(a, b) {
		return new Date(a.created).getTime() - new Date(b.created).getTime();
	}

	function preProcessTicket(ticket) {
		if (ticket.thread && ticket.thread.events) {
			ticket.thread.events.forEach(event => {
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
		if (ticketInfo) {
			if (type === 'agent') {
				getTicketById(ticketInfo.ticket_id)
					.then(response => response.data)
					.then(ticket => {
						ticket = preProcessTicket(ticket);
						setTicket(ticket);
					});
			}
			else {
				getTicketByIdForUser(ticketInfo.ticket_id)
					.then(response => response.data)
					.then(ticket => {
						ticket = preProcessTicket(ticket);
						setTicket(ticket);
					});
			}
		}
	}, [ticketInfo]);

	const updateTicket = newTicket => {
		newTicket = preProcessTicket(newTicket);
		setTicket(newTicket);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ height: '100%' }}>
			<Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
				<Tabs
					orientation="vertical"
					variant="scrollable"
					value={value}
					onChange={handleChange}
					aria-label="Vertical tabs example"
					sx={{ padding: '24px 18px' }}
					TabIndicatorProps={{
						style: { display: 'none' },
					}}
				>
					<CircularTab
						icon={
							<NotepadText
								size={22}
								strokeWidth={1.5}
							/>
						}
						aria-label="Details"
						sx={{ marginBottom: '12px' }}
					/>

					{(type !== 'agent' || (type === 'agent' && permissions.hasOwnProperty('ticket.reply'))) && <CircularTab
						icon={
							<MessageSquareText
								size={22}
								strokeWidth={1.5}
							/>
						}
						aria-label="Details"
					/> }
				</Tabs>
				<TabPanel
					value={value}
					index={0}
				>
					<TicketDetail
						ticket={ticket}
						closeDrawer={closeDrawer}
						updateCurrentTicket={updateTicket}
						openEdit={openEdit}
						type={type}
					/>
				</TabPanel>
				<TabPanel
					value={value}
					index={1}
				>
					<TicketThread
						ticket={ticket}
						closeDrawer={closeDrawer}
						updateCurrentTicket={updateTicket}
						type={type}
					/>
				</TabPanel>
			</Box>
		</Box>
	);
};

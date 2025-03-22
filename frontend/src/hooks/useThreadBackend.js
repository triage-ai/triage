import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useThreadsBackend = () => {
	const { agentAuthState, userAuthState, guestAuthState } = useContext(AuthContext);

	const createThreadEntry = async (threadInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'thread_entry/create', threadInfo, config);
	};

	const createThreadEntryForUser = async (threadInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};
		threadInfo.user_id = userAuthState.user_id;
		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'thread_entry/create/user', threadInfo, config);
	};

	const createThreadEntryForGuest = async (threadInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${guestAuthState.token}` },
		};
		threadInfo.user_id = guestAuthState.user_id;
		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'thread_entry/create/guest', threadInfo, config);
	};

	const threadEntryAgentEmailReply = async (threadInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'thread_entry/create/agent_attachment_reply', threadInfo, config);
	};

	const send_attachment_email = async (emailInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return axios.post(process.env.REACT_APP_BACKEND_URL + 'thread_entry/create/send_attachment_reply', emailInfo, config);
	};

	return { createThreadEntry, createThreadEntryForUser, threadEntryAgentEmailReply, send_attachment_email, createThreadEntryForGuest };

	// const getAllOpenTickets = async () => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(
	// 		process.env.REACT_APP_BACKEND_URL + 'ticket/search?status_id=1&order_by=created',
	// 		config
	// 	);
	// };

	// const getTicketById = async id => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(process.env.REACT_APP_BACKEND_URL + `ticket/id/${id}`, config);
	// };

	// const createTicket = async ticketInfo => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.post(
	// 		process.env.REACT_APP_BACKEND_URL + 'ticket/create',
	// 		ticketInfo,
	// 		config
	// 	);
	// };

	// const updateTicket = async (ticketId, ticketInfo) => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.put(
	// 		process.env.REACT_APP_BACKEND_URL + 'ticket/put/' + ticketId,
	// 		ticketInfo,
	// 		config
	// 	);
	// };

	// return { getAllOpenTickets, getTicketById, createTicket, updateTicket };
};

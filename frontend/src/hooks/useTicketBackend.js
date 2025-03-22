import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useTicketBackend = () => {
	const { agentAuthState, userAuthState, guestAuthState } = useContext(AuthContext);

	const getTicketsbyAdvancedSearch = async (payload, search, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL +
				`ticket/adv_search?page=${page}${size ? '&size=' + size : ''}${search ? '&search=' + search : ''}`,
			payload,
			config
		);
	};

	const getTicketByQueue = async (queue_id, search, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `ticket/queue/${queue_id ?? 0}?page=${page}${size ? '&size=' + size : ''}${search ? '&search=' + search : ''}`,
			config
		);
	};


	const getTicketsbyAdvancedSearchForUser = async (adv_search) => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};
		const page = adv_search.page;
		const size = adv_search.size;
		const payload = {
			filters: adv_search.filters,
			sorts: adv_search.sorts,
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL +
				`ticket/adv_search/user?size=${size}&page=${page}`,
			payload,
			config
		);
	};

	const getTicketById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `ticket/id/${id}`,
			config
		);
	};

	const getTicketByNumber = async (number) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `ticket/number/${number}`,
			config
		);
	};

	const getTicketByNumberForGuest = async (number) => {
		const config = {
			headers: { Authorization: `Bearer ${guestAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `ticket/guest/number/${number}`,
			config
		);
	};

	const getTicketByIdForUser = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `ticket/user/id/${id}`,
			config
		);
	};

	const getTicketForms = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + "ticket/form/",
			config
		);
	};

	const createTicket = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "ticket/create",
			ticketInfo,
			config
		);
	};

	const createTicketForUser = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "ticket/create/user",
			ticketInfo,
			config
		);
	};

	const createTicketForGuest = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${guestAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "ticket/create/guest",
			ticketInfo,
			config
		);
	};

	const updateTicket = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL +
				"ticket/update/" +
				ticketInfo.ticket_id,
			ticketInfo,
			config
		);
	};

	const updateTicketForUser = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL +
				"ticket/user/update/" +
				ticketInfo.ticket_id,
			ticketInfo,
			config
		);
	};

	const updateTicketForGuest = async (ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${guestAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL +
				"ticket/guest/update/" +
				ticketInfo.ticket_id,
			ticketInfo,
			config
		);
	};
	
	const getTicketBetweenDates = async (start_date, end_date) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `ticket/dates?start=${start_date}&end=${end_date}`, config);
	};

	const getDashboardStats = async (start_date, end_date, category) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `ticket/${category}/dates?start=${start_date}&end=${end_date}`, config);
	};


	return {
		getTicketsbyAdvancedSearch,
		getTicketsbyAdvancedSearchForUser,
		getTicketById,
		getTicketByQueue,
		getTicketByIdForUser,
		getTicketByNumber,
		getTicketByNumberForGuest,
		getTicketForms,
		createTicket,
		createTicketForUser,
		createTicketForGuest,
		updateTicket,
		updateTicketForUser,
		updateTicketForGuest,
		getTicketBetweenDates,
		getDashboardStats
	};
};

import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useQueueBackend = () => {
	const createQueue = async queueInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'queue/create',
			queueInfo,
			config
		);
	};
	const { agentAuthState, userAuthState } = useContext(AuthContext);

	// This will also return the default queues
	const getQueuesForAgent = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` }
		};
		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `queue/get`,
			config
		);
	}

	const getQueuesForUser = async () => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` }
		};
		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `queue/get/user`,
			config
		);
	}

	const getAllDefaultColumns = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` }
		};
		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `default_column/get`,
			config
		);
	}

	// const getTicketsbyAdvancedSearch = async (adv_search) => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` }
	// 	};
	// 	const page = adv_search.page
	// 	const size = adv_search.size
	// 	const payload = {'filters': adv_search.filters, 'sorts': adv_search.sorts}

	// 	return await axios.post(
	// 		process.env.REACT_APP_BACKEND_URL + `ticket/adv_search?size=${size}&page=${page}`,
	// 		payload,
	// 		config
	// 	);
	// }

	// const getTicketById = async id => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(process.env.REACT_APP_BACKEND_URL + `ticket/id/${id}`, config);
	// };


	const updateQueue = async (queueInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'queue/put/' + queueInfo.queue_id,
			queueInfo,
			config
		);
	};

	const removeQueue = async queueInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'queue/delete/' + queueInfo.queue_id,
			config
		);
	};

	return { createQueue, getQueuesForAgent, getQueuesForUser, getAllDefaultColumns, updateQueue, removeQueue };
};

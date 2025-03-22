import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useStatusBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllStatuses = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'ticket_status/get', config);
	};

	const getTaskStatus = async taskId => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + taskId, config);
	};

	return { getAllStatuses, getTaskStatus };
};

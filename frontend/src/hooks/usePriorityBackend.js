import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const usePriorityBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllPriorities = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'ticket_priority/get', config);
	};

	const getPriorityColor = priority => {
		switch (priority) {
			case 'low':
				return '#2278C3';

			case 'normal':
				return '#22C368';

			case 'hight':
				return '#FFA726';

			case 'emergency':
				return '#C32222';

			default:
				return '#2278C3';
		}
	};

	return { getAllPriorities, getPriorityColor };
};

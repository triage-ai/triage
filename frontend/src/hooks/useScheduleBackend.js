import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useScheduleBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllSchedules = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'schedule/get', config);
	};

	return { getAllSchedules };
};

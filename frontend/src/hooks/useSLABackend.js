import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSLABackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllSLAs = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'sla/get', config);
	};

	const createSLA = async slaInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'sla/create',
			slaInfo,
			config
		);
	};

	const updateSLA = async slaInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'sla/put/' + slaInfo.sla_id,
			slaInfo,
			config
		);
	};

	const removeSLA = async slaInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'sla/delete/' + slaInfo.sla_id,
			config
		);
	};

	return { getAllSLAs, createSLA, updateSLA, removeSLA };
};

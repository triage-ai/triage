import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useGroupBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllGroups = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'group/get', config);
	};

	const getAllGroupsJoined = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'group/', config);
	};

	const updateGroup = async groupInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'group/put/' + groupInfo.group_id,
			groupInfo,
			config
		);
	};

	const removeGroup = async groupInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'group/delete/' + groupInfo.group_id,
			config
		);
	};

	return { getAllGroups, getAllGroupsJoined, updateGroup, removeGroup };
};

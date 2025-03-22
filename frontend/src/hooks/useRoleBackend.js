import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useRoleBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllRoles = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'role/get', config);
	};

	const getRoleById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `role/id/${id}`, config);
	}

	const createRole = async roleInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'role/create', roleInfo, config);
	};

	const updateRole = async roleInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'role/put/' + roleInfo.role_id,
			roleInfo,
			config
		);
	};

	const removeRole = async roleInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'role/delete/' + roleInfo.role_id,
			config
		);
	};

	const getRolePermissions = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + 'role/permissions/',
			config
		);
	};

	return { getAllRoles, createRole, updateRole, removeRole, getRolePermissions };
};

import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAgentBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const sendResetPasswordEmail = async (email) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `agent/reset`, {'email': email});
	}

	const resendResetPasswordEmail = async (agent_id) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `agent/reset/resend/${agent_id}`);
	}

	const confirmResetPasswordToken = async (token, password) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `agent/reset/confirm/${token}`, {'password': password});
	}
	
	const getAllAgents = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'agent/get', config);
	};

	const getAllAgentsByDeptAndGroup = async (dept_id, group_id, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		let url = `agent/get/?page=${page}&size=${size}&`
		if (dept_id) {
			url += `dept_id=${dept_id}&`
		}
		if (group_id) {
			url += `group_id=${group_id}`
		}

		return await axios.get(process.env.REACT_APP_BACKEND_URL + url, config);
	};

	const getAgentBySearch = async (input) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `agent/search/${input}`, config);
	}

	const getAgentById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `agent/id/${id}`, config);
	}

	const createAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'agent/create', agentInfo, config);
	};

	const updateAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'agent/put/' + agentInfo.agent_id,
			agentInfo,
			config
		);
	};

	const registerAgent = async agentInfo => {
		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'agent/register',
			agentInfo,
		);
	};

	const confirmToken = async token => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `agent/confirm/${token}`);
	};

	const resendConfirmationEmail = async (agent_id) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `agent/resend/${agent_id}`);
	}

	const removeAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'agent/delete/' + agentInfo.agent_id,
			config
		);
	};

	const getPermissions = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + 'agent/permissions/',
			config
		);
	};

	return { getAllAgents, getAllAgentsByDeptAndGroup, getPermissions, getAgentBySearch, createAgent, updateAgent, removeAgent, getAgentById, confirmToken, registerAgent, resendConfirmationEmail, sendResetPasswordEmail, resendResetPasswordEmail, confirmResetPasswordToken };
};

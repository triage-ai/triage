import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useUserBackend = () => {
	const { agentAuthState, userAuthState } = useContext(AuthContext);

	// const getAllAgents = async () => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(process.env.REACT_APP_BACKEND_URL + 'agent/get', config);
	// };

	const resendConfirmationEmail = async (user_id) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `user/resend/${user_id}`);
	}

	const confirmToken = async (token) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `user/confirm/${token}`);
	}

	const sendResetPasswordEmail = async (email) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `user/reset`, {'email': email});
	}

	const resendResetPasswordEmail = async (user_id) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `user/reset/resend/${user_id}`);
	}

	const confirmResetPasswordToken = async (token, password) => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + `user/reset/confirm/${token}`, {'password': password});
	}

	const getAllUsersBySearch = async (input, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `user?name=${input}&page=${page}&size=${size}`, config);
	}

	const getUserBySearch = async (input) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `user/search/${input}`, config);
	}

	const createUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'user/create', userInfo, config);
	};

	const registerUser = async userInfo => {
		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'user/register', userInfo);
	};

	const updateUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'user/put/' + userInfo.user_id,
			userInfo,
			config
		);
	};

	const removeUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'user/delete/' + userInfo.user_id,
			config
		);
	};

	const getUserById = async () => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `user/get/user`, config);
	}

	const updateUserProfile = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${userAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'user/put',
			userInfo,
			config
		);
	};

	return { createUser, registerUser, confirmToken, confirmResetPasswordToken, resendResetPasswordEmail, resendConfirmationEmail, sendResetPasswordEmail, updateUser, getAllUsersBySearch, getUserBySearch, removeUser, getUserById, updateUserProfile };
};

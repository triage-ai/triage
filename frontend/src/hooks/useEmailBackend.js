import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useEmailBackend = () => {
    const { agentAuthState, userAuthState } = useContext(AuthContext);

    const getAllEmails = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'email/get', config);
	};
    
    
    const getEmailById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `email/id/${id}`,
			config
		);
	};

    const createEmail = async (emailInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "email/create",
			emailInfo,
			config
		);
	};

    const updateEmail = async (emailInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return await axios.put(
			process.env.REACT_APP_BACKEND_URL +
				"email/put/" +
				emailInfo.email_id,
				emailInfo,
			config
		);
	};

    const removeEmail = async (emailInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL +
				"email/delete/" +
				emailInfo.email_id,
			config
		);
	};

	const sendTestEmail = async (emailInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "email/test_email",
			emailInfo,
			config,
		);
	};

    return {getAllEmails, getEmailById, createEmail, updateEmail, removeEmail, sendTestEmail}

}
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useTemplateBackend = () => {
    const { agentAuthState, userAuthState } = useContext(AuthContext);

    const getAllTemplates = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'template/get', config);
	};
    
    
    const getTemplateById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `template/id/${id}`,
			config
		);
	};

    const createTemplate = async (templateInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "template/create",
			templateInfo,
			config
		);
	};

    const updateTemplate = async (templateInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return await axios.put(
			process.env.REACT_APP_BACKEND_URL +
				"template/put/" +
				templateInfo.template_id,
				templateInfo,
			config
		);
	};

	const bulkUpdateTemplate = async (templateInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};
		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + "template/put/",
			templateInfo,
			config
		);
	};

    const removeTemplate = async (templateInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL +
				"template/delete/" +
				templateInfo.template_id,
			config
		);
	};

    return {getAllTemplates, getTemplateById, createTemplate, updateTemplate, removeTemplate, bulkUpdateTemplate}

}
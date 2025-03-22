import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useFormBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllForms = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'form/get', config);
	};

	const getFormById = async (input) => {

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `form/id/${input}`);
	}

	const createForm = async formInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'form/create', formInfo, config);
	};

	const updateForm = async formInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'form/put/' + formInfo.form_id,
			formInfo,
			config
		);
	};

	const removeForm = async formInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'form/delete/' + formInfo.form_id,
			config
		);
	};

	const createFormField = async formFieldInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'form_field/create', formFieldInfo, config);
	};

	const updateFormField = async formFieldInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'form_field/put/' + formFieldInfo.field_id,
			formFieldInfo,
			config
		);
	};

	const removeFormField = async formFieldInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'form_field/delete/' + formFieldInfo.field_id,
			config
		);
	};

	return { getAllForms, getFormById, createForm, removeForm, updateForm, createFormField, updateFormField, removeFormField };
};

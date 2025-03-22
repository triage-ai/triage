import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useCategoryBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllCategories = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'category/get', config);
	};

	return { getAllCategories };
};

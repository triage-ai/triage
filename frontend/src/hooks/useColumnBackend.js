import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export const useColumnBackend = () => {

    const { agentAuthState } = useContext(AuthContext);

    const createColumn = async columnInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'column/create', columnInfo, config);
	};

	const updateColumn = async columnInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'column/put/' + columnInfo.column_id,
			columnInfo,
			config
		);
	};

	const removeColumn = async columnInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'column/delete/' + columnInfo.column_id,
			config
		);
	};

    return { createColumn, updateColumn, removeColumn }
}
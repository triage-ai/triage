import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useDepartmentBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllDepartments = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'department/get', config);
	};

	const getAllDepartmentsJoined = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'department/', config);
	};

	const createDepartment = async departmentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'department/create',
			departmentInfo,
			config
		);
	};

	const updateDepartment = async deptInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'department/put/' + deptInfo.dept_id,
			deptInfo,
			config
		);
	};

	const removeDepartment = async deptInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'department/delete/' + deptInfo.dept_id,
			config
		);
	};

	return { getAllDepartments, getAllDepartmentsJoined, createDepartment, updateDepartment, removeDepartment };
};

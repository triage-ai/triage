import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useTopicBackend = () => {
	const { agentAuthState, userAuthState } = useContext(AuthContext);

	const getAllTopics = async () => {
		const config = {
			// headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'topic/get', config);
	};

	const getAllTopicsJoined = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'topic/', config);
	};

	const createTopic = async topicInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'topic/create',
			topicInfo,
			config
		);
	}

	const updateTopic = async topicInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'topic/put/' + topicInfo.topic_id,
			topicInfo,
			config
		);
	};

	const removeTopic = async topicInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'topic/delete/' + topicInfo.topic_id,
			config
		);
	};

	return { createTopic, getAllTopics, getAllTopicsJoined, updateTopic, removeTopic };
};

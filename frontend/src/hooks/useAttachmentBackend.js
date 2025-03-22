import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAttachmentBackend = () => {
    const { agentAuthState, userAuthState } = useContext(AuthContext);

    // const getAllAttachments = async () => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(process.env.REACT_APP_BACKEND_URL + 'attachment/get', config);
	// };
    
    
    const getAttachmentById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + `attachment/id/${id}`,
			config
		);
	};

    const createAttachment = async (attachmentInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + "attachment/create",
			attachmentInfo,
			config
		);
	};

    // const updateAttachment = async (attachmentInfo) => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};
	// 	console.log(attachmentInfo)
	// 	return await axios.put(
	// 		process.env.REACT_APP_BACKEND_URL +
	// 			"attachment/put/" +
	// 			attachmentInfo.attachment_id,
	// 			attachmentInfo,
	// 		config
	// 	);
	// };

    const removeAttachment = async (attachmentInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL +
				"attachment/delete/" +
				attachmentInfo.attachment_id,
			config
		);
	};

	const getPresignedURL = async (attachmentInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL +
				"attachment/generate-url",
			attachmentInfo,
			config
		);
	}

    return {getAttachmentById, createAttachment, removeAttachment, getPresignedURL}

}
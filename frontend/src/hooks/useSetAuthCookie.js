import axios from 'axios';

export const useSetAuthCookie = () => {
	const guestSignInEmailAndTicketNumber = async (email, ticket_number) => {
		return signInEmailAndTicketNumber('auth/login-guest', email, ticket_number);
	}

	const userSignInEmailAndPassword = async (email, password) => {
		return signInEmailAndPassword('auth/login-user', email, password);
	}

	const agentSignInEmailAndPassword = async (email, password) => {
		return signInEmailAndPassword('auth/login', email, password);
	}

	const signInEmailAndPassword = async (route, email, password) => {
		const config = {
			auth: {
				username: email,
				password: password,
			},
		};
		return await axios.post(process.env.REACT_APP_BACKEND_URL + route, {}, config);
	};

	const signInEmailAndTicketNumber = async (route, email, ticket_number) => {
		const config = {
			auth: {
				username: email,
				password: ticket_number,
			},
		};
		return await axios.post(process.env.REACT_APP_BACKEND_URL + route, {}, config);
	};

	return { agentSignInEmailAndPassword, userSignInEmailAndPassword, guestSignInEmailAndTicketNumber };
};

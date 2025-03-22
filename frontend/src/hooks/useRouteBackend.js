import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';

export const useRouteBackend = () => {
	const { getAuthCookie } = useSetAuthCookie();

	const getEmailRoutes = async () => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.get(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/route/email/' + activeModel,
			config
		);
	};

	const getSlackRoutes = async () => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.get(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/route/slack/' + activeModel,
			config
		);
	};

	const modifyRoutesByType = async (routeType, previousRouteInfo, routeInfo) => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		const dataObj = Object.fromEntries(previousRouteInfo);

		if (routeType === 'email') {
			if (dataObj[routeInfo.expertise]) {
				dataObj[routeInfo.expertise].push(routeInfo.email);
			} else {
				dataObj[routeInfo.expertise] = [routeInfo.email];
			}
		} else {
			if (dataObj[routeInfo.expertise]) {
				dataObj[routeInfo.expertise].push(routeInfo.slackChannelId);
				dataObj._token = routeInfo.slackToken;
			} else {
				dataObj[routeInfo.expertise] = [routeInfo.slackChannelId];
				dataObj._token = routeInfo.slackToken;
			}
		}

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/route/modify/' + routeType + '/' + activeModel,
			dataObj,
			config
		);
	};

	return { getEmailRoutes, getSlackRoutes, modifyRoutesByType };
};

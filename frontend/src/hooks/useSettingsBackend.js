import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSettingsBackend = () => {
    const { agentAuthState } = useContext(AuthContext);

    const getAllSettings = async () => {
        const config = {
            headers: { Authorization: `Bearer ${agentAuthState.token}` }
        };

        return await axios.get(process.env.REACT_APP_BACKEND_URL + 'settings/get', config);
    };

    const getDefaultSettings = async () => {
        const config = {
            headers: { Authorization: `Bearer ${agentAuthState.token}` }
        };

        return await axios.get(process.env.REACT_APP_BACKEND_URL + 'settings/default', config);
    }

    const getSettingsByKey = async (key) => {
        const config = {
            headers: { Authorization: `Bearer ${agentAuthState.token}` }
        };

        return await axios.get(process.env.REACT_APP_BACKEND_URL + 'settings/key/' + key, config);
    };

    const getCompanyLogo = async () => {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + 'settings/logo');
    }

    const updateSettings = async (settingsInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'settings/put',
			settingsInfo,
			config
		);
	};

    return { getAllSettings, getDefaultSettings, getCompanyLogo, updateSettings, getSettingsByKey };
 
};
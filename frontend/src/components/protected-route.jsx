import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin, requirePermission }) => {
	const { agentAuthState, permissions } = useContext(AuthContext);

	if (!agentAuthState.isAuth) {
		return <Navigate to="/" />;
	}


	if (requireAdmin && !agentAuthState.isAdmin) {
		return <Navigate to="/" />;
	}


	if (requirePermission !== undefined && !permissions.hasOwnProperty(requirePermission)) {
		return <Navigate to="/" />;
	}

	return children;
	
};

export default ProtectedRoute;

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserProtectedRoute = ({ children }) => {
	const { userAuthState } = useContext(AuthContext);

	if (!userAuthState.isAuth) {
		return <Navigate to="/" />;
	}

	return children;
};

export default UserProtectedRoute;

import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import './styles/index.css';
import './styles/toast.css';

import { auth } from './libs/firebase';
import { useUserStore } from './stores/userStore';
import routes from './routes';
import './libs/i18n';

const AppRouter = () => {
	const { user, isLoading, fetchUserInfo } = useUserStore();

	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});

		return unSub;
	}, [fetchUserInfo]);

	console.log(user);

	return (
		<>
			<Router>
				<Routes>
					{routes.map((route, index) => {
						return <Route key={index} path={route.path} element={route.auth && !user ? <Navigate to="/" /> : <route.page />} />;
					})}
				</Routes>
			</Router>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				className="!bg-transparent"
				toastClassName="toast-modern toast-luxury toast-glass"
			/>
		</>
	);
};

const App = () => {
	return (
		<>
			<AppRouter />
		</>
	);
};

export default App;

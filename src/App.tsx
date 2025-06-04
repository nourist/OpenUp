import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, Suspense, startTransition } from 'react';
import { ToastContainer } from 'react-toastify';

import './styles/index.css';
import './styles/toast.css';
import './styles/loading.css';

import { auth } from './libs/firebase';
import { useUserStore } from './stores/userStore';
import routes from './routes';
import './libs/i18n';
import Loading from './components/Loading';

const AppRouter = () => {
	const { user, isLoading, fetchUserInfo } = useUserStore();

	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			startTransition(() => {
				fetchUserInfo(user?.uid);
			});
		});

		return unSub;
	}, [fetchUserInfo]);

	if (isLoading)
		return (
			<div className="bg-base-100 h-[100vh]">
				<Loading />
			</div>
		);

	return (
		<Router>
			<Routes>
				{routes.map((route, index) => {
					return <Route key={index} path={route.path} element={route.auth && !user ? <Navigate to="/" /> : <route.page />} />;
				})}
				<Route path="*" element={user ? <Navigate to="/app" /> : <Navigate to="/" />} />
			</Routes>
		</Router>
	);
};

const App = () => {
	return (
		<Suspense
			fallback={
				<div className="bg-base-100 h-[100vh]">
					<Loading />
				</div>
			}
		>
			<AppRouter />
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
		</Suspense>
	);
};

export default App;

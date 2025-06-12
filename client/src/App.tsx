import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import './styles/toast.css';
import './styles/loading.css';

import useThemeListener from './hooks/useThemeListener';
import useThemeChanger from './hooks/useThemeChanger';
import AppLayout from '~/layouts/AppLayout';
import useAuthStore from './stores/authStore';
import routes from './routes';
import './libs/i18n';
import Loading from './components/Loading';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchInterval: 180000 } } });

const AppRouter = () => {
	const { user, isLoading } = useAuthStore();

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
					const Layout = route.layout === null ? Fragment : route.layout || AppLayout;
					return (
						<Route
							key={index}
							path={route.path}
							element={
								route.type === 'private' && !user ? (
									<Navigate to="/" />
								) : route.type === 'guest' && user ? (
									<Navigate to="/app" />
								) : (
									<Layout>
										<route.page />
									</Layout>
								)
							}
						/>
					);
				})}
				<Route path="*" element={user ? <Navigate to="/app" /> : <Navigate to="/" />} />
			</Routes>
		</Router>
	);
};

const App = () => {
	useThemeListener();
	useThemeChanger();

	return (
		<Suspense>
			<QueryClientProvider client={queryClient}>
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
			</QueryClientProvider>
		</Suspense>
	);
};

export default App;

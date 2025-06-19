import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, Fragment, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './styles/index.css';
import './styles/toast.css';
import './styles/loading.css';

import useThemeListener from './hooks/useThemeListener';
import useThemeChanger from './hooks/useThemeChanger';
import useLanguageSync from './hooks/useLanguageSync';
import AppLayout from '~/layouts/AppLayout';
import useAuthStore from './stores/authStore';
import routes from './routes';
import './libs/i18n';
import Loading from './components/Loading';
import { fetchInfo } from './services/auth';
import useSocketConnect from './hooks/useSocketConnect';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchInterval: 180000 } } });

const AppRouter = () => {
	const { user } = useAuthStore();

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
	const { isLoading, setUser, setLoading } = useAuthStore();

	useThemeListener();
	useThemeChanger();
	useLanguageSync();
	useSocketConnect();

	useEffect(() => {
		fetchInfo()
			.then(setUser ?? null)
			.finally(() => setLoading(false));
	}, []);

	if (isLoading) {
		return (
			<div className="bg-base-100 h-[100vh]">
				<Loading />
			</div>
		);
	}

	return (
		<Suspense>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
			</GoogleOAuthProvider>
		</Suspense>
	);
};

export default App;

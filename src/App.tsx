import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';

import DefaultLayout from './layouts/DefaultLayout';
import routes from './routes';
import './libs/i18n';

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				{routes.map((route, index) => {
					const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
					return (
						<Route
							key={index}
							path={route.path}
							element={
								<Layout>
									<route.page />
								</Layout>
							}
						/>
					);
				})}
			</Routes>
		</Router>
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

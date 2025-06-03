import { Route } from '~/types/route';
import Home from '~/pages/Home';

const privateRoutes: Route[] = [
	{
		path: '/',
		page: Home,
		layout: null,
	},
];

export default privateRoutes;

import { Route } from '~/types/route.type';
import Home from '~/pages/Home';

const publicRoutes: Route[] = [
	{
		path: '/',
		page: Home,
		layout: null,
	},
];

export default publicRoutes;

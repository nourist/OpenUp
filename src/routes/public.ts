import { Route } from '~/types/route';
import Home from '~/pages/Home';
import Signin from '~/pages/Signin';
import Signup from '~/pages/Signup';

const publicRoutes: Route[] = [
	{
		path: '/',
		page: Home,
	},
	{
		path: '/signin',
		page: Signin,
	},
	{
		path: '/signup',
		page: Signup,
	},
];

export default publicRoutes;

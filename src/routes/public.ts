import { Route } from '~/types/route.type';
import Home from '~/pages/Home';
import Signin from '~/pages/Signin';
import Signup from '~/pages/Signup';
import ForgotPassword from '~/pages/ForgotPassword';

const publicRoutes: Route[] = [
	{
		path: '/',
		page: Home,
		layout: null,
	},
	{
		path: '/signin',
		page: Signin,
		layout: null,
	},
	{
		path: '/signup',
		page: Signup,
		layout: null,
	},
	{
		path: '/forgot-password',
		page: ForgotPassword,
		layout: null,
	},
];

export default publicRoutes;

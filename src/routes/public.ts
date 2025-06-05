import { Route } from '~/types/route.type';
import Home from '~/pages/Home';
import Signin from '~/pages/Signin';
import Signup from '~/pages/Signup';
import ForgotPassword from '~/pages/ForgotPassword';

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
	{
		path: '/forgot-password',
		page: ForgotPassword,
	},
];

export default publicRoutes;

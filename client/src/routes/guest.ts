import { Route } from '~/types/route.type';
import Signin from '~/pages/Signin';
import Signup from '~/pages/Signup';

const guestRoutes: Route[] = [
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
];

export default guestRoutes;

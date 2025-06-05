import { Route } from '~/types/route.type';
import Chat from '~/pages/Chat';

const privateRoutes: Route[] = [
	{
		path: '/app',
		page: Chat,
	},
];

export default privateRoutes;

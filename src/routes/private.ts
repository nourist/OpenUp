import { Route } from '~/types/route.type';
import Chat from '~/pages/Chat';
import Contacts from '~/pages/Contacts';
import Settings from '~/pages/Settings';

const privateRoutes: Route[] = [
	{
		path: '/app',
		page: Chat,
	},
	{
		path: '/contacts',
		page: Contacts,
	},
	{
		path: '/settings',
		page: Settings,
	},
];

export default privateRoutes;

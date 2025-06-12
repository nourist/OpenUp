import { Route } from '~/types/route.type';

import privateRoutes from './private';
import publicRoutes from './public';
import guestRoutes from './guest';

const routes: Route[] = [
	...publicRoutes.map((item) => ({ ...item, type: 'public' as const })),
	...privateRoutes.map((item) => ({ ...item, type: 'private' as const })),
	...guestRoutes.map((item) => ({ ...item, type: 'guest' as const })),
];

export default routes;

import privateRoutes from './private';
import publicRoutes from './public';

const routes = [...privateRoutes.map((route) => ({ ...route, auth: true })), ...publicRoutes.map((route) => ({ ...route, auth: false }))];

export default routes;

import { ElementType } from 'react';

export interface Route {
	path: string;
	page: ElementType;
	auth?: boolean;
}

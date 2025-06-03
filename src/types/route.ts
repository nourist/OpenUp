import { ElementType } from 'react';

export interface Route {
	path: string;
	layout?: null | ElementType;
	page: ElementType;
	auth?: boolean;
}

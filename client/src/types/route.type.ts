import { ElementType } from 'react';

export interface Route {
	path: string;
	page: ElementType;
	type?: 'private' | 'public' | 'guest';
	layout?: ElementType | null;
}

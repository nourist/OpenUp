export interface User {
	id: number;
	email: string;
	password?: string;
	name: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
	res.cookie('access_token', token, {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const clearAuthCookie = (res: Response) => {
	res.clearCookie('access_token');
};

import axios from 'axios';

export const getUser = (accessToken) =>
	axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

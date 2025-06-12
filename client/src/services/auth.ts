import http from '~/libs/axios';

export const fetchInfo = () =>
	http
		.get('/auth')
		.then((res) => res.data.user)
		.catch((err) => {
			throw err.response.data.message;
		});

export const signup = (email: string, password: string, name: string) =>
	http
		.post('/auth/signup', { email, password, name })
		.catch((err) => {
			throw err.response.data;
		})
		.then((res) => res.data);

export const signin = (email: string, password: string) =>
	http
		.post('/auth/signin', { email, password })
		.catch((err) => {
			throw err.response.data.message;
		})
		.then((res) => res.data);

export const googleSignin = (idToken: string) =>
	http
		.post('/auth/google-signin', { idToken })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.message;
		});

export const signout = () => http.post('/auth/signout');

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
	getUser(accessToken: string) {
		return axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}
}

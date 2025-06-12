import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import googleLogo from '~/assets/google-logo.png';
import { googleSignin } from '~/services/auth';
import useAuthStore from '~/stores/authStore';

const GoogleSigninButton = () => {
	const { t } = useTranslation('auth');
	const { setUser } = useAuthStore();
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			googleSignin(tokenResponse.access_token)
				.then((res) => {
					console.log(res);
					toast.success(res.message);
					setUser(res.user);
					navigate('/app');
				})
				.catch(toast.error);
		},
		onError: () => {
			toast.error('Login Failed');
		},
	});

	return (
		<button
			onClick={() => login()}
			className="border-base-content/20 flex h-10 w-full items-center justify-center gap-2 rounded-full border p-2 text-sm font-medium capitalize hover:shadow-sm"
		>
			<img src={googleLogo} className="size-5" alt="" />
			{t('sign-in-with-google')}
		</button>
	);
};

export default GoogleSigninButton;

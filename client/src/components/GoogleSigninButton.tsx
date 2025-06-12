import { useTranslation } from 'react-i18next';

import googleLogo from '~/assets/google-logo.png';

const GoogleSigninButton = () => {
	const { t } = useTranslation('auth');

	return (
		<button
			onClick={
				() => {}
				// googleSignin()
				// 	.then(() => navigate('/app'))
				// 	.catch((err) => toast.error(err.message))
			}
			className="border-base-content/20 flex h-10 w-full items-center justify-center gap-2 rounded-full border p-2 text-sm font-semibold capitalize hover:shadow-sm"
		>
			<img src={googleLogo} className="size-6" alt="" />
			{t('sign-in-with-google')}
		</button>
	);
};

export default GoogleSigninButton;

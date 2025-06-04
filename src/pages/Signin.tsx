import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { useUserStore } from '~/stores/userStore';
import googleLogo from '~/assets/google-logo.png';
import { googleSignin, signin } from '~/services/auth';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import AlreadySignedAlert from '~/components/AlreadySignedAlert';

const Signin = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();
	const { user } = useUserStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [signingIn, setSigningIn] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			{user ? (
				<AlreadySignedAlert/>
			) : (
				<div className="bg-base-100 flex aspect-video h-[calc(100%-140px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg">
					<AbstractGradientShape className="hidden w-1/2 rounded-tl-4xl md:block" />
					<div className="w-full p-10 md:w-1/2">
						<h1 className="font mb-10 text-3xl">{t('sign-in').capitalize()}</h1>

						<label htmlFor="email" className="text-sm font-semibold capitalize">
							{t('email')}
						</label>
						<input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 mb-5 placeholder:capitalize" placeholder={t('email')} />

						<label htmlFor="password" className="text-sm font-semibold capitalize">
							{t('password')}
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 placeholder:capitalize"
							placeholder={t('password')}
						/>

						<button
							disabled={signingIn}
							onClick={() => {
								if (!email || !password) return toast.error(t('please-fill-in-all-fields').capitalize());
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
								const isValidEmail = (email: string) => emailRegex.test(email);
								if (!isValidEmail(email)) return toast.error(t('invalid-email').capitalize());
								setSigningIn(true);
								signin(email, password)
									.then(() => navigate('/app'))
									.catch((err) => toast.error(err.message))
									.finally(() => setSigningIn(false));
							}}
							className="from-primary to-secondary mt-8 h-10 w-full rounded-full bg-gradient-to-r font-bold text-white capitalize hover:shadow-lg"
						>
							{t('sign-in')}
						</button>
						<div className="my-4 flex justify-between text-sm capitalize">
							<Link to="/signup" className="text-primary font-medium hover:underline">
								{t('sign-up')}
							</Link>
							<Link to="/forgot-password" className="text-base-content/80 hover:text-base-content hover:underline">
								{t('forgot-password')}?
							</Link>
						</div>
						<button
							onClick={() =>
								googleSignin()
									.then(() => navigate('/app'))
									.catch((err) => toast.error(err.message))
							}
							className="border-base-content/20 flex h-10 w-full items-center justify-center gap-2 rounded-full border p-2 text-sm font-semibold capitalize hover:shadow-sm"
						>
							<img src={googleLogo} className="size-6" alt="" />
							{t('sign-in-with-google')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Signin;

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import GoogleSigninButton from '~/components/GoogleSigninButton';
import AbstractGradientShape from '~/components/AbstractGradientShape';

const Signin = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [signingIn, setSigningIn] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<div className="bg-base-100 flex aspect-video h-[calc(100%-140px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg">
				<AbstractGradientShape className="hidden w-1/2 rounded-tl-4xl md:block" />
				<div className="w-full p-10 md:w-1/2">
					<h1 className="font mb-10 text-3xl">{t('sign-in').capitalize()}</h1>

					<label htmlFor="email" className="text-sm font-semibold capitalize">
						{t('email')}
					</label>
					<input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1 mb-5 placeholder:capitalize" placeholder={t('email')} />

					<label htmlFor="password" className="text-sm font-semibold capitalize">
						{t('password')}
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input mt-1 placeholder:capitalize"
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
							// signin(email, password)
							// 	.then(() => navigate('/app'))
							// 	.catch((err) => toast.error(err.message))
							// 	.finally(() => setSigningIn(false));
						}}
						className="from-primary to-secondary mt-8 h-10 w-full rounded-full bg-gradient-to-r font-bold text-neutral-content capitalize hover:shadow-lg"
					>
						{t('sign-in')}
					</button>
					<div className="text-base-content/80 my-4 flex justify-center gap-1 text-sm">
						<p>{t('dont-have-a-account').capitalize()}?</p>
						<Link to="/signup" className="text-primary font-medium capitalize hover:underline">
							{t('sign-up')}
						</Link>
					</div>
					<GoogleSigninButton />
				</div>
			</div>
		</div>
	);
};

export default Signin;

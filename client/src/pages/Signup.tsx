import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import AbstractGradientShape from '~/components/AbstractGradientShape';

const Signup = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [signingUp, setSigningUp] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<div className="bg-base-100 flex aspect-video h-[calc(100%-140px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg">
				<div className="w-full p-10 md:w-1/2">
					<h1 className="font mb-6 text-3xl">{t('sign-up').capitalize()}</h1>

					<label htmlFor="email" className="text-sm font-semibold capitalize">
						{t('email')}
					</label>
					<input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1 mb-4 placeholder:capitalize" placeholder={t('email')} />

					<label htmlFor="password" className="text-sm font-semibold capitalize">
						{t('password')}
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input mt-1 mb-4 placeholder:capitalize"
						placeholder={t('password')}
					/>

					<label htmlFor="name" className="text-sm font-semibold capitalize">
						{t('display-name')}
					</label>
					<input
						id="name"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						className="input mt-1 placeholder:capitalize"
						placeholder={t('display-name')}
					/>

					<button
						disabled={signingUp}
						onClick={() => {
							if (!email || !password || !displayName) return toast.error(t('please-fill-in-all-fields').capitalize());
							const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							const isValidEmail = (email: string) => emailRegex.test(email);
							if (!isValidEmail(email)) return toast.error(t('invalid-email').capitalize());
							setSigningUp(true);
							// signup(email, password, displayName)
							// 	.then(() => navigate('/app'))
							// 	.catch((err) => toast.error(err.message))
							// 	.finally(() => setSigningUp(false));
						}}
						className="from-primary to-secondary mt-8 h-10 w-full rounded-full bg-gradient-to-r font-bold text-neutral-content capitalize hover:shadow-lg"
					>
						{t('sign-up')}
					</button>
					<div className="text-base-content/80 my-4 flex justify-center gap-1 text-sm">
						<p>{t('already-have-a-account').capitalize()}?</p>
						<Link to="/signin" className="text-primary font-medium capitalize hover:underline">
							{t('sign-in')}
						</Link>
					</div>
				</div>
				<AbstractGradientShape className="hidden w-1/2 rotate-180 rounded-tl-4xl md:block" />
			</div>
		</div>
	);
};

export default Signup;

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';

import googleLogo from '~/assets/google-logo.png';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import { googleSignin } from '~/services/auth';
import { auth } from '~/libs/firebase';

const ForgotPassword = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [sending, setSending] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<div className="bg-base-100 flex w-[calc((100vh-204px)/9*16)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg">
				<div className="w-full p-10 md:w-1/2">
					<h1 className="font mb-10 text-3xl">{t('forgot-password').capitalize()}</h1>

					<label htmlFor="email" className="text-sm font-semibold capitalize">
						{t('email')}
					</label>
					<input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 placeholder:capitalize" placeholder={t('email')} />

					<button
						disabled={sending}
						onClick={() => {
							if (!email) return toast.error(t('please-fill-in-all-fields').capitalize());
							const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							const isValidEmail = (email: string) => emailRegex.test(email);
							if (!isValidEmail(email)) return toast.error(t('invalid-email').capitalize());
							setSending(true);
							sendPasswordResetEmail(auth, email)
								.then(() => toast.success(t('send-password-reset-email-success').capitalize()))
								.catch((err) => toast.error(err.message))
								.finally(() => setSending(false));
						}}
						className="from-primary to-secondary mt-8 h-10 w-full rounded-full bg-gradient-to-r font-bold text-white capitalize hover:shadow-lg"
					>
						{t('get-password')}
					</button>
					<div className="text-base-content/80 my-4 flex justify-center gap-1 text-sm">
						<p>{t('already-have-password').capitalize()}?</p>
						<Link to="/signin" className="text-primary font-medium capitalize hover:underline">
							{t('sign-in')}
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
				<AbstractGradientShape className="hidden w-1/2 rotate-180 rounded-tl-4xl md:block" />
			</div>
		</div>
	);
};

export default ForgotPassword;

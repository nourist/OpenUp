import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';

import GoogleSigninButton from '~/components/GoogleSigninButton';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import { signin } from '~/services/auth';
import useAuthStore from '~/stores/authStore';

const Signin = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();
	const { setUser } = useAuthStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [fieldErrors, setFieldErrors] = useState<Partial<Record<'password' | 'email', string | null | undefined>>>({});

	const [signingIn, setSigningIn] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-base-100 flex aspect-video h-[calc(100%-130px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg"
			>
				<AbstractGradientShape className="hidden w-1/2 rounded-tl-4xl md:block" />
				<div className="w-full p-10 md:w-1/2">
					<h1 className="font mb-10 text-3xl">{t('sign-in').capitalize()}</h1>

					<label htmlFor="email" className="text-sm font-semibold capitalize">
						{t('email')}
					</label>
					<input
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onFocus={() => setFieldErrors((prev) => ({ ...prev, email: null }))}
						className={`input mt-1 placeholder:capitalize ${fieldErrors.email && 'text-error'}`}
						placeholder={t('email')}
					/>
					<div data-hide={!fieldErrors.email} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						<CircleAlert size={12} strokeWidth={2.5} />
						{fieldErrors.email?.capitalize()}
					</div>

					<label htmlFor="password" className="text-sm font-semibold capitalize">
						{t('password')}
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onFocus={() => setFieldErrors((prev) => ({ ...prev, password: null }))}
						className={`input mt-1 placeholder:capitalize ${fieldErrors.password && 'text-error'}`}
						placeholder={t('password')}
					/>
					<div data-hide={!fieldErrors.password} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						<CircleAlert size={12} strokeWidth={2.5} />
						{fieldErrors.password?.capitalize()}
					</div>

					<button
						disabled={signingIn}
						onClick={() => {
							let ok = true;
							if (!email) {
								setFieldErrors((prev) => ({
									...prev,
									email: 'email should not be empty',
								}));
								ok = false;
							}
							if (!password) {
								setFieldErrors((prev) => ({
									...prev,
									password: 'password should not be empty',
								}));
								ok = false;
							}
							const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							const isValidEmail = (email: string) => emailRegex.test(email);
							if (!isValidEmail(email)) {
								setFieldErrors((prev) => ({
									...prev,
									email: 'email is not valid',
								}));
								ok = false;
							}
							if (!ok) return;
							setSigningIn(true);
							signin(email, password)
								.then((res) => {
									toast.success(res.message);
									setUser(res.user);
									navigate('/app');
								})
								.catch(toast.error)
								.finally(() => setSigningIn(false));
						}}
						className="from-primary to-secondary mt-8 h-10 w-full rounded-full bg-gradient-to-r font-bold text-neutral-content capitalize hover:shadow-lg"
					>
						{t('sign-in')}
					</button>
					<div className="text-base-content/80 my-5 flex justify-center gap-1 text-sm">
						<p>{t('dont-have-an-account').capitalize()}?</p>
						<Link to="/signup" className="text-primary font-medium capitalize hover:underline">
							{t('sign-up')}
						</Link>
					</div>
					<GoogleSigninButton />
				</div>
			</motion.div>
		</div>
	);
};

export default Signin;

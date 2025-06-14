import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';

import useAuthStore from '~/stores/authStore';
import { signup } from '~/services/auth';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import Tooltip from '~/components/Tooltip';

const Signup = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();
	const { setUser } = useAuthStore();

	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'password', string | null | undefined>>>({});

	const [signingUp, setSigningUp] = useState(false);

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-base-100 flex aspect-video h-[calc(100%-130px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg"
			>
				<div className="w-full p-10 md:w-1/2">
					<h1 className="font mb-6 text-3xl">{t('sign-up').capitalize()}</h1>

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
						{fieldErrors.password === 'password is not strong enough' ? (
							<Tooltip className="gap-1" component="span" content={t('strong-password-message').capitalize()}>
								<CircleAlert size={12} strokeWidth={2.5} />
								{fieldErrors.password?.capitalize()}
							</Tooltip>
						) : (
							<>
								<CircleAlert size={12} strokeWidth={2.5} />
								{fieldErrors.password?.capitalize()}
							</>
						)}
					</div>

					<label htmlFor="name" className="text-sm font-semibold capitalize">
						{t('display-name')}
					</label>
					<input
						id="name"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						onFocus={() => setFieldErrors((prev) => ({ ...prev, name: null }))}
						className={`input mt-1 placeholder:capitalize ${fieldErrors.name && 'text-error'}`}
						placeholder={t('display-name')}
					/>
					<div data-hide={!fieldErrors.name} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						<CircleAlert size={12} strokeWidth={2.5} />
						{fieldErrors.name?.capitalize()}
					</div>

					<button
						disabled={signingUp}
						onClick={() => {
							setSigningUp(true);
							signup(email, password, displayName)
								.then((res) => {
									toast.success(res.message);
									setUser(res.user);
									navigate('/app');
								})
								.catch((err) => {
									if (err.statusCode === 422) {
										setFieldErrors(err.fieldErrors);
									} else {
										toast.error(err.message);
									}
								})
								.finally(() => setSigningUp(false));
						}}
						className="from-primary to-secondary mt-6 h-10 w-full rounded-full bg-gradient-to-r font-bold text-neutral-content capitalize hover:shadow-lg"
					>
						{t('sign-up')}
					</button>
					<div className="text-base-content/80 mt-4 flex justify-center gap-1 text-sm">
						<p>{t('already-have-an-account').capitalize()}?</p>
						<Link to="/signin" className="text-primary font-medium capitalize hover:underline">
							{t('sign-in')}
						</Link>
					</div>
				</div>
				<AbstractGradientShape className="hidden w-1/2 rotate-180 rounded-tl-4xl md:block" />
			</motion.div>
		</div>
	);
};

export default Signup;

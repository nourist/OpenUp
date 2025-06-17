import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';

import useAuthStore from '~/stores/authStore';
import { signup } from '~/services/auth';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import Tooltip from '~/components/Tooltip';
import Logo from '~/assets/logo.svg';

const Signup = () => {
	const { t } = useTranslation('auth');
	const navigate = useNavigate();
	const { setUser } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = (data: any) =>
		signup(data.email, data.password, data.name)
			.then((res) => {
				toast.success(res.message);
				setUser(res.user);
				navigate('/app');
			})
			.catch((err) => toast.error(err.message));

	return (
		<div className="bg-base-200 flex h-[100vh] items-center justify-center p-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-base-100 flex aspect-video h-[calc(100%-130px)] max-w-[calc(100%-64px)] rounded-4xl shadow-lg"
			>
				<form onSubmit={handleSubmit(onSubmit)} className="w-full p-10 md:w-1/2">
					<h1 className="font mb-6 text-3xl flex items-center gap-2">
						<Link to="/">
							<Logo />
						</Link>
						{t('sign-up').capitalize()}
					</h1>

					<label htmlFor="email" className="text-sm font-semibold capitalize">
						{t('email')}
					</label>
					<input
						id="email"
						{...register('email', {
							required: { value: true, message: 'email-required-msg' },
							pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'invalid-email-msg' },
						})}
						className={`input mt-1 placeholder:capitalize ${errors.email && 'text-error'}`}
						placeholder={t('email')}
					/>
					<div data-hide={!errors.email} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						<CircleAlert size={12} strokeWidth={2.5} />
						{errors.email?.message && t(errors.email?.message).capitalize()}
					</div>

					<label htmlFor="password" className="text-sm font-semibold capitalize">
						{t('password')}
					</label>
					<input
						id="password"
						type="password"
						{...register('password', {
							required: { value: true, message: 'password-required-msg' },
							pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'not-strong-password-msg' },
						})}
						className={`input mt-1 placeholder:capitalize ${errors.password && 'text-error'}`}
						placeholder={t('password')}
					/>
					<div data-hide={!errors.password} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						{errors.password?.message === 'not-strong-password-msg' ? (
							<Tooltip className="gap-1" component="span" content={t('strong-password-message').capitalize()}>
								<CircleAlert size={12} strokeWidth={2.5} />
								{errors.password?.message && t(errors.password?.message).capitalize()}
							</Tooltip>
						) : (
							<>
								<CircleAlert size={12} strokeWidth={2.5} />
								{errors.password?.message && t(errors.password?.message).capitalize()}
							</>
						)}
					</div>

					<label htmlFor="name" className="text-sm font-semibold capitalize">
						{t('display-name')}
					</label>
					<input
						id="name"
						{...register('name', { required: { value: true, message: 'name-required-msg' } })}
						className={`input mt-1 placeholder:capitalize ${errors.name && 'text-error'}`}
						placeholder={t('display-name')}
					/>
					<div data-hide={!errors.name} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
						<CircleAlert size={12} strokeWidth={2.5} />
						{errors.name?.message && t(errors.name?.message).capitalize()}
					</div>

					<button
						disabled={isSubmitting}
						type="submit"
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
				</form>
				<AbstractGradientShape className="hidden w-1/2 rotate-180 rounded-tl-4xl md:block" />
			</motion.div>
		</div>
	);
};

export default Signup;

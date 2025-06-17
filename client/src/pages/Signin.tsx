import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';

import GoogleSigninButton from '~/components/GoogleSigninButton';
import AbstractGradientShape from '~/components/AbstractGradientShape';
import { signin } from '~/services/auth';
import useAuthStore from '~/stores/authStore';
import Logo from '~/assets/logo.svg';

const Signin = () => {
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
		},
	});

	const onSubmit = (data: any) =>
		signin(data.email, data.password)
			.then((res) => {
				toast.success(res.message);
				setUser(res.user);
				navigate('/app');
			})
			.catch(toast.error);

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
					<form onSubmit={handleSubmit(onSubmit)}>
						<h1 className="font mb-10 text-3xl flex items-center gap-2">
							<Link to="/">
								<Logo />
							</Link>
							{t('sign-in').capitalize()}
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
							{...register('password', { required: { value: true, message: 'password-required-msg' } })}
							className={`input mt-1 placeholder:capitalize ${errors.password && 'text-error'}`}
							placeholder={t('password')}
						/>
						<div data-hide={!errors.password} className="text-xs text-error mb-1 mt-0.5 flex items-center gap-1 font-medium h-4 data-[hide=true]:opacity-0">
							<CircleAlert size={12} strokeWidth={2.5} />
							{errors.password?.message && t(errors.password?.message).capitalize()}
						</div>

						<button
							disabled={isSubmitting}
							type="submit"
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
					</form>
					<GoogleSigninButton />
				</div>
			</motion.div>
		</div>
	);
};

export default Signin;

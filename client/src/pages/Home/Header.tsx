import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import useAuthStore from '~/stores/authStore';
import Logo from '~/assets/logo.svg';
import Navbar from './Navbar';

const Header = () => {
	const { t } = useTranslation('home');
	const { user } = useAuthStore();

	return (
		<header className="fixed backdrop-blur-lg bg-base-100/70 z-50 flex-center top-0 left-0 right-0 h-16 border-b border-base-300">
			<div className="flex items-center justify-between flex-1 gap-1 max-w-7xl text-sm px-8 lg:px-14">
				<Logo />
				<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-1 text-2xl font-bold">OpenUp</h1>
				<div className="text-base-content/80 mx-auto hidden lg:space-x-12 space-x-10 font-medium md:block">
					<Navbar />
				</div>
				{user ? (
					<Link
						className="bg-primary hover:bg-primary-600 ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-neutral-content capitalize hover:shadow-md md:ml-0"
						to="/app"
					>
						{t('open-app')}
						<MessageCircle size="18" />
					</Link>
				) : (
					<>
						<Link className="text-primary hover:text-primary-600 mr-5 ml-auto capitalize hover:underline md:ml-0" to="/signin">
							{t('sign-in')}
						</Link>
						<Link className="bg-primary hover:bg-primary-600 rounded-full px-4 py-2 text-neutral-content capitalize hover:shadow-md" to="/signup">
							{t('sign-up')}
						</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;

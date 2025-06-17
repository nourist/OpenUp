import { useTranslation } from 'react-i18next';
import { Github } from 'lucide-react';

import Logo from '../../assets/logo.svg';
import Navbar from './Navbar';

const Footer = () => {
	const { t } = useTranslation('home');

	return (
		<footer id="footer-point">
			<div className="w-full max-w-7xl mx-auto px-8 lg:px-14 py-4 flex-center gap-6 text-base-content/80">
				<div className="mr-auto space-y-2">
					<div className="flex-center !justify-start gap-2">
						<Logo className="size-10" />
						<h2 className="text-2xl text-base-content font-bold">OpenUp</h2>
					</div>
					<p className="text-[15px] flex items-center gap-1">
						{t('built-with').capitalize()}
						<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
								fill="#f5222d"
							></path>
						</svg>
						{t('by')}{' '}
						<a href="https://github.com/nourist" className="text-primary hover:underline font-semibold">
							Nourist
						</a>
					</p>
				</div>
				<Navbar />
				<a href="https://github.com/nourist/OpenUp" className="hover:text-base-content capitalize">
					<Github className="size-5" />
				</a>
			</div>
			<div className="w-full py-6 text-base-content/80 border-t border-base-content/20 border text-center text-[15px]">
				©2025 Nourist. {t('all-rights-reserved').capitalize()}.
			</div>
		</footer>
	);
};

export default Footer;

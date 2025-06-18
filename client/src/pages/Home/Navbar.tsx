import { useTranslation } from 'react-i18next';

interface NavbarProps {
	className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
	const { t } = useTranslation('home');

	return (
		<>
			<button
				className={`hover:text-base-content capitalize ${className}`}
				onClick={() =>
					window.scrollTo({
						left: 0,
						top: 0,
						behavior: 'smooth',
					})
				}
			>
				{t('home')}
			</button>
			<button
				className={`hover:text-base-content capitalize ${className}`}
				onClick={() =>
					window.scrollTo({
						top: (document.getElementById('features-point')?.getBoundingClientRect().top || 0) + window.pageYOffset - 64,
						behavior: 'smooth',
					})
				}
			>
				{t('features')}
			</button>
			<button
				className={`hover:text-base-content capitalize ${className}`}
				onClick={() =>
					window.scrollTo({
						top: (document.getElementById('pricing-point')?.getBoundingClientRect().top || 0) + window.pageYOffset - 100,
						behavior: 'smooth',
					})
				}
			>
				{t('pricing')}
			</button>
			<button
				className={`hover:text-base-content capitalize ${className}`}
				onClick={() =>
					window.scrollTo({
						top: (document.getElementById('reviews-point')?.getBoundingClientRect().top || 0) + window.pageYOffset - 64,
						behavior: 'smooth',
					})
				}
			>
				{t('reviews')}
			</button>
			<button
				className={`hover:text-base-content capitalize ${className}`}
				onClick={() =>
					document.getElementById('footer-point')?.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				}
			>
				{t('about')}
			</button>
		</>
	);
};

export default Navbar;

import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useAuthStore from '~/stores/authStore';

const CTA = () => {
	const { t } = useTranslation('home');
	const { user } = useAuthStore();

	return (
		<section className="bg-gradient-to-r from-primary/90 py-16 to-secondary/90 text-center flex-center flex-col gap-6">
			<h2 className="text-2xl md:text-4xl font-bold text-neutral-content">{t('cta').capitalize()}</h2>
			<p className="text-neutral-content/85 text-sm md:text-base lg:max-w-2/3 px-16">{t('description').capitalize()}</p>
			<Link
				to={user ? '/app' : '/signup'}
				className="h-10 group hover:ring-2 ring-neutral-content mt-6 transition-all text-sm font-medium bg-neutral-content text-neutral hover:shadow-lg px-6 rounded-lg flex-center gap-2 capitalize"
			>
				{t('start-chatting')}
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
			</Link>
		</section>
	);
};

export default CTA;

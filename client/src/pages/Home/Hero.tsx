import { Users, MessageSquare, Shield, ArrowRight, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ChatPreview } from './ChatPreview';
import useAuthStore from '~/stores/authStore';

const Hero = () => {
	const { t } = useTranslation('home');
	const { user } = useAuthStore();

	return (
		<section className="flex flex-col items-center pt-24 pb-16 justify-center bg-gradient-to-br from-base-100 via-primary-50 to-accent-50">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Column - Content */}
					<div className="space-y-8 animate-fade-in text-center">
						<div className="space-y-4">
							<div className="inline-flex items-center space-x-2 bg-base-200 rounded-full px-4 py-2 border border-base-300">
								<div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
								<span className="text-sm text-base-content font-medium capitalize">{t('now-in-beta')}</span>
							</div>

							<h1 className="text-4xl leading-none md:text-5xl lg:text-6xl font-bold text-base-content capitalize">
								{t('connect')}
								<span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">{t('authentically')}</span>
							</h1>

							<p className="text-base-content/70 my-8 max-w-xl leading-relaxed">{t('description').capitalize()}</p>
						</div>

						{/* Stats */}
						<div className="flex flex-wrap gap-6">
							<div className="flex items-center space-x-2">
								<Users className="w-5 h-5 text-primary" />
								<span className="text-base-content font-semibold capitalize">10K+ {t('users')}</span>
							</div>
							<div className="flex items-center space-x-2">
								<MessageSquare className="w-5 h-5 text-secondary" />
								<span className="text-base-content font-semibold capitalize">1M+ {t('messages')}</span>
							</div>
							<div className="flex items-center space-x-2">
								<Shield className="w-5 h-5 text-accent" />
								<span className="text-base-content font-semibold capitalize">100% {t('secure')}</span>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to={user ? '/app' : '/signup'}
								className="h-10 group hover:ring-2 ring-primary/80 transition-all text-sm font-medium bg-primary text-neutral-content hover:shadow-lg px-6 rounded-lg flex-center gap-2 capitalize"
							>
								{t('start-chatting')}
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
							</Link>
							<a
								href="https://github.com/nourist/OpenUp"
								className="h-10 border border-neutral/10 ring-neutral-content/80 hover:ring-2 hover:border-neutral-content transition-all text-sm font-medium bg-neutral-content text-neutral hover:shadow-lg px-6 rounded-lg flex-center gap-2 capitalize"
							>
								{t('view-repository')}
								<Github className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Right Column - Chat Preview */}
					<div className="animate-slide-in">
						<ChatPreview />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;

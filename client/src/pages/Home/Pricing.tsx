import { Github, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
	const { t } = useTranslation('home');

	return (
		<section id="pricing" className="py-20 bg-gradient-to-br from-secondary-50/75 via-accent-50 to-primary-50/75">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 id="pricing-point" className="text-3xl md:text-4xl font-bold text-base-content mb-4">
						{t('simple-transparent').capitalize()}
						<span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">{t('pricing-title')}</span>
					</h2>
					<p className="text-lg text-base-content/70">{t('pricing-description')}</p>
				</div>

				<div className="max-w-4xl mx-auto">
					{/* Free Plan - Highlighted */}
					<div className="relative">
						{/* Popular Badge */}
						<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
							<div className="bg-gradient-to-r capitalize from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
								✨ {t('always-free')}
							</div>
						</div>

						<div className="bg-base-100/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/20 relative overflow-hidden">
							{/* Background Gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>

							<div className="relative z-10">
								<div className="text-center mb-8">
									<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary capitalize rounded-2xl flex items-center justify-center mx-auto mb-4">
										<Heart className="w-8 h-8 text-white" />
									</div>

									<h3 className="text-2xl md:text-3xl font-bold text-base-content mb-2 capitalize">{t('open-up-free-open-source')}</h3>

									<div className="flex-center gap-4">
										<div className="mb-4 flex-1 flex items-end justify-end">
											<span className="text-5xl md:text-6xl font-bold text-primary">$0</span>
											<span className="text-base-content/60 ml-2">{t('forever')}</span>
										</div>
										<div className="w-[1px] border border-base-content/40 h-10 rounded-full"></div>
										<div className="mb-4 flex-1 flex items-end">
											<span className="text-5xl md:text-6xl font-bold text-secondary">
												<Github size="64" />
											</span>
											<span className="text-base-content/60">{t('open-source')}</span>
										</div>
									</div>
								</div>

								<p className="text-sm text-base-content/60 mt-4 text-center">
									{t('no-credit-card').capitalize()} • {t('no-hidden-fees').capitalize()} • {t('cancel-anytime').capitalize()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Pricing;

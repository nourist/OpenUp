import { Zap, Shield, Database, Heart, Palette, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
	{
		icon: Zap,
		color: 'from-primary to-primary-600',
	},
	{
		icon: Shield,
		color: 'from-accent to-accent-600',
	},
	{
		icon: Heart,
		color: 'from-secondary to-secondary-600',
	},
	{
		icon: Database,
		color: 'from-success to-success-600',
	},
	{
		icon: Palette,
		color: 'from-error to-error-600',
	},
	{
		icon: Globe,
		color: 'from-info to-info-600',
	},
];

const Features = () => {
	const { t } = useTranslation('home');

	return (
		<section id="features" className="py-26">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 id="features-point" className="text-3xl md:text-4xl font-bold text-base-content mb-4">
						{t('everything-you-need-for').capitalize()}
						<span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">{t('meaningful-connections')}</span>
					</h2>
					<p className="text-lg text-base-content/70">{t('features-description')}</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group p-6 bg-base-200/50 backdrop-blur-sm rounded-2xl border border-base-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div
								className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
							>
								<feature.icon className="w-6 h-6 text-white" />
							</div>

							<h3 className="text-xl font-semibold text-base-content mb-2">{t(`feature-${index + 1}`)}</h3>

							<p className="text-base-content/70 leading-relaxed">{t(`feature-${index + 1}-description`)}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;

import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Avatar2 from '../../assets/avatar-2.svg';
import Avatar3 from '../../assets/avatar-3.svg';
import Avatar4 from '../../assets/avatar-4.svg';
import Avatar5 from '../../assets/avatar-5.svg';
import Avatar6 from '../../assets/avatar-6.svg';
import Avatar7 from '../../assets/avatar-7.svg';

const testimonials = [
	{
		name: 'Sarah Chen',
		role: 'product-designer',
		avatar: Avatar2,
	},
	{
		name: 'Mike Rodriguez',
		role: 'software-engineer',
		avatar: Avatar3,
	},
	{
		name: 'Emma Thompson',
		role: 'marketing-manager',
		avatar: Avatar4,
	},
	{
		name: 'James Park',
		role: 'entrepreneur',
		avatar: Avatar5,
	},
	{
		name: 'Lisa Wang',
		role: 'teacher',
		avatar: Avatar6,
	},
	{
		name: 'David Kim',
		role: 'photographer',
		avatar: Avatar7,
	},
];

const Reviews = () => {
	const { t } = useTranslation('home');

	return (
		<section id="testimonials" className="py-20 bg-gradient-to-br from-base-200 to-base-100">
			<div className="container mx-auto px-4 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 id="reviews-point" className="text-3xl md:text-4xl font-bold text-base-content mb-4">
						Loved by thousands of
						<span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">happy users</span>
					</h2>
					<p className="text-lg text-base-content/70">See what our community says about their experience with OpenUp</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<div
							key={testimonial.name}
							className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 hover:shadow-lg transition-all duration-300"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									<testimonial.avatar className="size-10" />
									<div>
										<h4 className="font-semibold text-base-content">{testimonial.name}</h4>
										<p className="text-sm text-base-content/60 capitalize">{t(testimonial.role)}</p>
									</div>
								</div>
								<Quote className="size-5 text-secondary" />
							</div>

							<div className="flex items-center mb-3">
								<Star className="w-4 h-4 text-warning fill-current" />
								<Star className="w-4 h-4 text-warning fill-current" />
								<Star className="w-4 h-4 text-warning fill-current" />
								<Star className="w-4 h-4 text-warning fill-current" />
								<Star className="w-4 h-4 text-warning fill-current" />
							</div>

							<p className="text-base-content/80 leading-relaxed">"{t(`review-${index + 1}`)}"</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Reviews;

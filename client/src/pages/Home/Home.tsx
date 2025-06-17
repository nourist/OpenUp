import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Pricing from './Pricing';
import Reviews from './Reviews';
import CTA from './CTA';
import Footer from './Footer';

const Home = () => {
	return (
		<div className="bg-base-100">
			<Header />
			<main className="max-w-7xl mx-auto py-8 px-8 lg:px-14">
				<Hero />
				<Features />
				<Pricing />
				<Reviews />
			</main>
			<CTA />
			<Footer />
		</div>
	);
};

export default Home;

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowRight, Smile, Clock, Lock, MessageCircle } from 'lucide-react';

import GroupChat from '~/assets/group-chat.svg';
import GroupChat2 from '~/assets/group-chat-2.svg';
import ChatMention from '~/assets/chat-mention.svg';
import ConnectedWorld from '~/assets/connected-world.svg';
import Logo from '~/assets/logo.svg';
import useAuthStore from '~/stores/authStore';

const Home = () => {
	const { t } = useTranslation('home');
	const { user } = useAuthStore();

	return (
		<div className="bg-base-100 px-8 md:px-28">
			<header className="fixed top-4 right-8 left-8 flex h-16 items-center gap-1 rounded-xl bg-white/3 p-3 text-sm backdrop-blur-xl md:right-28 md:left-28">
				<Logo />
				<h1 className="text-primary ml-1 text-2xl font-bold">OpenUp</h1>
				<div className="text-base-content/80 mx-auto hidden space-x-12 font-medium md:block">
					<button
						onClick={() =>
							window.scrollTo({
								left: 0,
								top: 0,
								behavior: 'smooth',
							})
						}
						className="hover:text-base-content capitalize"
					>
						{t('home')}
					</button>
					<button
						onClick={() =>
							window.scrollTo({
								top: (document.getElementById('feature-point')?.getBoundingClientRect().top || 0) + window.pageYOffset - 100,
								behavior: 'smooth',
							})
						}
						className="hover:text-base-content capitalize"
					>
						{t('features')}
					</button>
					<button
						onClick={() =>
							document.getElementById('footer-point')?.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							})
						}
						className="hover:text-base-content capitalize"
					>
						{t('about')}
					</button>
				</div>
				{user ? (
					<Link className="bg-primary ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-neutral-content capitalize hover:shadow-md md:ml-0" to="/app">
						{t('open-app')}
						<MessageCircle size="18" />
					</Link>
				) : (
					<>
						<Link className="text-primary mr-5 ml-auto capitalize hover:underline md:ml-0" to="/signin">
							{t('sign-in')}
						</Link>
						<Link className="bg-primary rounded-full px-4 py-2 text-neutral-content capitalize hover:shadow-md" to="/signup">
							{t('sign-up')}
						</Link>
					</>
				)}
			</header>
			<div className="flex min-h-[100vh] flex-col gap-24 pt-24 md:flex-row">
				<div className="py-20 md:max-w-[min(384px,36%)]">
					<div className="mb-14 text-4xl font-bold">
						{t('send-messages').capitalize()}
						<div>
							<span className="text-primary">{t('easily')}</span> {t('using')} OpenUp
						</div>
					</div>
					<div className="text-base-content/70 mb-18">{t('description').capitalize()}</div>
					<Link to="/signup" className="bg-primary text-neutral-content inline-flex gap-2 rounded-full px-8 py-2 font-medium uppercase hover:shadow-md">
						{t('get-started')}
						<ArrowRight />
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<GroupChat />
				</div>
			</div>
			<div className="mt-12 mb-20 flex flex-col items-center">
				<div className="bg-primary/10 text-primary mx-auto inline rounded-full px-5 py-2 text-sm font-bold capitalize" id="feature-point">
					{t('features')}
				</div>
				<h1 className="mt-3 text-center text-3xl font-light">
					{t('reason-title').capitalize()} <span className="text-primary font-bold">OpenUp</span>
				</h1>
				<p className="text-base-content/50 my-10 max-w-sm text-center text-sm">OpenUp {t('reason-msg')} OpenUp</p>
				<div className="*:bg-base-content/4 *:hover:bg-primary/80 dark:*:hover:bg-primary *:hover:*:text-neutral-content grid w-full grid-cols-3 grid-rows-3 gap-3 *:col-span-3 *:space-y-4 *:rounded-xl *:px-[20%] *:py-10 **:transition-all **:duration-200 sm:*:col-span-1 sm:*:row-span-3">
					<div>
						<div className="bg-base-100 mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
							<Smile fill="var(--color-primary)" color="var(--color-base-100)" size="40" strokeWidth={1} />
						</div>
						<h3 className="text-center text-lg font-semibold">{t('easy-to-use').capitalize()}</h3>
						<p className="text-base-content/60 text-center text-sm">{t('easy-to-use-msg').capitalize()}</p>
					</div>
					<div>
						<div className="bg-base-100 mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
							<Clock fill="var(--color-primary)" color="var(--color-base-100)" size="40" strokeWidth={1} />
						</div>
						<h3 className="text-center text-lg font-semibold">{t('realtime').capitalize()}</h3>
						<p className="text-base-content/60 text-center text-sm">{t('realtime-msg').capitalize()}</p>
					</div>
					<div>
						<div className="bg-base-100 mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
							<Lock fill="var(--color-primary)" color="var(--color-base-100)" size="40" strokeWidth={2} />
						</div>
						<h3 className="text-center text-lg font-semibold capitalize">
							{t('safety')} & {t('private')}
						</h3>
						<p className="text-base-content/60 text-center text-sm">{t('safety-n-private-msg').capitalize()}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col-reverse items-center gap-x-12 md:flex-row">
				<div className="flex-1 pt-6 md:h-auto">
					<ChatMention />
				</div>
				<div className="flex-1">
					<div className="mb-8 text-4xl font-bold">
						{t('send-messages').capitalize()}
						<div>
							<span className="text-primary">{t('easily')}</span> {t('using')} OpenUp
						</div>
					</div>
					<p className="text-base-content/80 mb-20">OpenUp {t('send-easy-msg')}</p>
				</div>
			</div>
			<div className="flex flex-col-reverse items-center gap-x-12 md:flex-row">
				<div className="flex-1">
					<div className="mb-8 text-4xl font-bold">
						{t('receive-messages').capitalize()}
						<div>
							<span className="text-primary">{t('instantly')}</span> {t('using')} OpenUp
						</div>
					</div>
					<p className="text-base-content/80 mb-20">OpenUp {t('receive-easy-msg')}</p>
				</div>
				<div className="flex-1 md:h-auto">
					<GroupChat2 />
				</div>
			</div>
			<div className="bg-primary/80 dark:bg-primary my-18 grid aspect-[5/2] grid-cols-2 gap-20 rounded-4xl px-12 pb-4 *:col-span-2 *:md:col-span-1 lg:px-24">
				<div className="hidden items-center md:flex">
					<ConnectedWorld />
				</div>
				<div className="flex flex-col justify-center gap-8">
					<h1 className="text-2xl font-bold text-neutral-content lg:text-5xl xl:text-[4rem]">{t('stay-connected').capitalize()}</h1>
					<div>
						<Link to="/signup" className="text-primary inline-flex gap-2 rounded-md bg-neutral-content px-4 py-2 font-semibold hover:shadow-md">
							{t('try-it-now').capitalize()} <ArrowRight />
						</Link>
					</div>
				</div>
			</div>
			<footer className="border-base-content/20 flex h-20 flex-wrap items-center gap-1 border-t" id="footer-point">
				© 2025, {t('made-with')}
				<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
						fill="#f5222d"
					></path>
				</svg>
				{t('by')}
				<a
					className="from-primary to-secondary bg-gradient-to-r bg-clip-text font-semibold transition-all duration-100 hover:text-transparent"
					href="https://github.com/nourist"
				>
					Nourist
				</a>
				<button
					className="hover:text-base-content text-base-content/80 mr-8 ml-auto hidden capitalize sm:block"
					onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })}
				>
					{t('home')}
				</button>
				<a href="https://github.com/nourist/OpenUp/blob/main/LICENSE" className="hover:text-base-content text-base-content/80 mr-8 capitalize">
					{t('license')}
				</a>
				<a href="https://github.com/nourist/OpenUp" className="hover:text-base-content text-base-content/80 capitalize">
					{t('github')}
				</a>
			</footer>
		</div>
	);
};

export default Home;

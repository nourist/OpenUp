import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { UserRound, UserPlus, UsersRound, HeartHandshake, UserRoundSearch } from 'lucide-react';
import { useSearchParams } from 'react-router';

import UsersPlus from '~/assets/users-plus.svg';

const ContactSidebar = () => {
	const { t } = useTranslation('contact');
	const [searchParams] = useSearchParams();
	const tab = Number(searchParams.get('tab')) || 1;

	return (
		<div className="bg-base-100 border px-5 py-4 border-base-content/15 border-l-0 sm:max-w-80 flex-1">
			<h2 className="text-2xl tracking-tighter capitalize mb-4 py-2 font-medium">{t('contacts')}</h2>
			<Link to="/contacts" className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 1 && '!bg-primary/15 text-primary'}`}>
				<UserRound size="20" className="mx-0.5" />
				{t('friend-list')}
			</Link>
			<Link
				to="/contacts?tab=2"
				className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 2 && '!bg-primary/15 text-primary'}`}
			>
				<UsersRound size="20" className="mx-0.5" />
				{t('group-list')}
			</Link>
			<Link
				to="/contacts?tab=3"
				className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 3 && '!bg-primary/15 text-primary'}`}
			>
				<UserPlus size="20" className="mx-0.5" />
				{t('friend-request')}
			</Link>
			<Link
				to="/contacts?tab=4"
				className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 4 && '!bg-primary/15 text-primary'}`}
			>
				<UsersPlus />
				{t('group-invitation')}
			</Link>
			<Link
				to="/contacts?tab=5"
				className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 5 && '!bg-primary/15 text-primary'}`}
			>
				<HeartHandshake size={20} />
				{t('my-request')}
			</Link>
			<Link
				to="/contacts?tab=6"
				className={`w-full h-12 rounded-lg hover:bg-base-200 mb-1 px-6 gap-2 capitalize items-center flex ${tab === 6 && '!bg-primary/15 text-primary'}`}
			>
				<UserRoundSearch size={20} />
				{t('discover-friends')}
			</Link>
		</div>
	);
};

export default ContactSidebar;

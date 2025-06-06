import { NavLink } from 'react-router';
import { MessageSquareMore, Users, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';

import { useUserStore } from '~/stores/userStore';
import UserAvatar from './UserAvatar';
import { auth } from '~/libs/firebase';
import Logo from '~/assets/logo.svg';
import useUserViewStore from '~/stores/userViewStore';

const AppSidebar = () => {
	const { t } = useTranslation();
	const { user } = useUserStore();
	const { setUser: setViewUser } = useUserViewStore();

	return (
		<div className="w-18 bg-base-100 py-3 flex flex-col items-center border border-base-content/15 space-y-3">
			<NavLink to="/">
				<div className='p-1'>
					<Logo height="40" width="40" />
				</div>
			</NavLink>
			<div className="h-[1px] w-8 bg-base-content/20"></div>
			<NavLink
				to="/app"
				title={t('chat').capitalize()}
				className="size-12 aria-[current=page]:bg-primary hover:-translate-y-0.5 aria-[current=page]:text-white flex-center bg-base-300 rounded-lg hover:bg-base-content/15 transition duration-200"
			>
				<MessageSquareMore />
			</NavLink>
			<NavLink
				to="/contacts"
				title={t('contacts').capitalize()}
				className="size-12 aria-[current=page]:bg-primary hover:-translate-y-0.5 aria-[current=page]:text-white flex-center bg-base-300 rounded-lg hover:bg-base-content/15 transition duration-200"
			>
				<Users />
			</NavLink>
			<button
				onClick={() => setViewUser(user)}
				title={t('view-profile').capitalize()}
				className="size-12 mt-auto aria-[current=page]:bg-primary hover:-translate-y-0.5 aria-[current=page]:text-white flex-center bg-base-300 rounded-lg hover:bg-base-content/15 transition duration-200"
			>
				<UserAvatar user={user} className="!size-7" />
			</button>
			<NavLink
				to="/settings"
				title={t('settings').capitalize()}
				className="size-12 aria-[current=page]:bg-primary hover:-translate-y-0.5 aria-[current=page]:text-white flex-center bg-base-300 rounded-lg hover:bg-base-content/15 transition duration-200"
			>
				<Settings />
			</NavLink>
			<div className="h-[1px] w-8 bg-base-content/20"></div>
			<button
				onClick={() => signOut(auth)}
				title={t('sign-out').capitalize()}
				className="size-12 aria-[current=page]:bg-primary hover:-translate-y-0.5 aria-[current=page]:text-white flex-center bg-base-300 hover:bg-error/15 hover:text-error rounded-lg transition duration-200"
			>
				<LogOut />
			</button>
		</div>
	);
};

export default AppSidebar;

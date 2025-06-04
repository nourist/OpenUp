import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { signOut } from 'firebase/auth';

import { auth } from '~/libs/firebase';
import AbstractGradientShape from './AbstractGradientShape';
import UserAvatar from './UserAvatar';
import { useUserStore } from '~/stores/userStore';

const AlreadySignedAlert = () => {
	const { user } = useUserStore();
	const { t } = useTranslation('auth');

	return (
		<div className="bg-base-100 relative flex h-40 w-96 max-w-full overflow-hidden rounded-xl shadow-lg">
			<AbstractGradientShape className="w-full" />
			<div className="absolute flex h-full items-center gap-8 p-6">
				<UserAvatar className="!size-24" user={user} />
				<div className="space-y-5">
					<h3 className="text-lg font-semibold">{t('you-are-already-signed').capitalize()}</h3>
					<div className="flex gap-2">
						<Link to="/app" className="bg-accent ml-auto inline-flex h-8 items-center rounded-lg px-2 text-sm font-semibold text-white capitalize">
							{t('open-app')}
						</Link>
						<button onClick={() => signOut(auth)} className="bg-error/30 text-error h-8 rounded-lg px-2 text-sm font-semibold capitalize">
							{t('sign-out')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlreadySignedAlert;

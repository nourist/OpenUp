import { Dialog, DialogPanel } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Pencil, X } from 'lucide-react';
import { Link } from 'react-router';

import { useUserStore } from '~/stores/userStore';
import UserAvatar from './UserAvatar';
import defaultUserBg from '~/assets/default-user-bg.jpg';
import useUserViewStore from '~/stores/userViewStore';

const UserProfileDialog = () => {
	const { t } = useTranslation('user');
	const { user, setUser } = useUserViewStore();
	const { user: me } = useUserStore();

	console.log(user);

	return (
		<Dialog open={Boolean(user)} onClose={() => setUser(null)}>
			<div className="fixed inset-0 flex w-screen items-center backdrop-blur-xs bg-base-content/10 justify-center p-4">
				<DialogPanel className="w-md overflow-hidden bg-base-100 rounded-2xl shadow-lg">
					<div className="flex pl-5 pr-3 justify-between items-center">
						<h2 className="py-3 font-semibold text-xl">{t('profile-info').capitalize()}</h2>
						<button className="hover:bg-error/10 hover:text-error flex-center rounded-full size-9" onClick={() => setUser(null)}>
							<X />
						</button>
					</div>
					<div className="aspect-[5/2] w-full" style={{ background: `url(${user?.bgAvatar || defaultUserBg})` }}></div>
					<div className="p-8 z-50">
						<div className="bg-base-100 py-6 px-8 rounded-xl -mt-20">
							<div className="flex-center gap-4">
								<UserAvatar user={user} className="!size-20" />
								<div className="flex justify-center flex-col">
									<h2 className="text-xl font-medium">{user?.displayName}</h2>
									<div className="flex gap-2">
										{user?.id === me?.id && (
											<Link
												onClick={() => setUser(null)}
												to="/settings"
												className="size-8 hover:bg-accent/20 flex-center rounded-full text-base-content/80 transition-all duration-150 hover:text-accent"
											>
												<Pencil size="16" />
											</Link>
										)}
									</div>
								</div>
							</div>
							<h2 className="mb-3 mt-8 font-medium capitalize">{t('personal-infomation')}</h2>
							<div className="flex gap-10 text-sm">
								<div className="space-y-1 text-base-content/80">
									{user?.bio && <div>{t('bio').capitalize()}</div>}
									<div>{t('gender').capitalize()}</div>
									<div>{t('date-of-birth').capitalize()}</div>
								</div>
								<div className="capitalize text-base-content/90 font-medium space-y-1">
									{user?.bio && <div>{user?.bio}</div>}
									<div>{user?.gender || t('not-provided')}</div>
									<div>{user?.dateOfBirth?.toDate()?.toLocaleDateString() || t('not-provided')}</div>
								</div>
							</div>
						</div>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

export default UserProfileDialog;

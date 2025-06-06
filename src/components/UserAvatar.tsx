import { Fragment } from 'react';

import { getShortName } from '~/utils/avatar';
import { stringToBrightColor } from '~/utils/color';
import { User } from '~/types/user.type';

interface Props {
	user?: User | null;
	className?: string;
}

const UserAvatar = ({ user, className }: Props) => {
	if (!user) return <Fragment />;

	return (
		<>
			{user.avatar ? (
				<img className={`size-[38px] rounded-full ${className}`} src={user.avatar} alt="" />
			) : (
				<div
					style={{
						backgroundColor: stringToBrightColor(user.displayName),
					}}
					className={`flex size-[38px] items-center justify-center rounded-full ${className}`}
				>
					{getShortName(user.displayName)}
				</div>
			)}
		</>
	);
};

export default UserAvatar;

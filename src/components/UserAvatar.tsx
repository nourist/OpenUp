import { FC, Fragment } from 'react';

import { getShortName } from '~/utils/avatar';
import { stringToBrightColor } from '~/utils/color';

interface Props {
	user?: any;
	className?: string;
}

const UserAvatar: FC = ({ user, className }) => {
	if (!user) return <Fragment />;

	return (
		<>
			{user.avatar ? (
				<img className={`size-[38px] rounded-full ${className}`} src={user.avatar} alt="" />
			) : (
				<div style={{ backgroundColor: stringToBrightColor(user.displayName) }} className={`flex size-[38px] items-center justify-center rounded-full ${className}`}>
					{getShortName(user.displayName)}
				</div>
			)}
		</>
	);
};

export default UserAvatar;

import AppSidebar from '~/components/AppSidebar';
import UserProfileDialog from '~/components/UserProfileDialog';

interface Props {
	children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
	return (
		<>
			<div className="h-[100vh] flex">
				<AppSidebar />
				{children}
			</div>
			<UserProfileDialog />
		</>
	);
};

export default DefaultLayout;

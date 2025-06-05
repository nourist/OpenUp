import AppSidebar from '~/components/AppSidebar';

interface Props {
	children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
	return (
		<div className="h-[100vh]">
			<AppSidebar />
			{children}
		</div>
	);
};

export default DefaultLayout;

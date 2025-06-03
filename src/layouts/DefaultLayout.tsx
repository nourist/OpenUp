import { ReactNode, FC } from 'react';

interface Props {
	children: ReactNode;
}

const DefaultLayout: FC = ({ children }) => {
	return <>{children}</>;
};

export default DefaultLayout;

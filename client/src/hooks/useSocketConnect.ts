import { useEffect } from 'react';

import { useSocketStore } from '~/stores/socketStore';
import useAuthStore from '~/stores/authStore';

const useSocketConnect = () => {
	const { user } = useAuthStore();
	const { socket, initSocket } = useSocketStore();

	useEffect(() => {
		console.log('User auth changed, reconnecting socket');
		socket?.disconnect();
		initSocket();
	}, [user]);
};

export default useSocketConnect;

import { useEffect } from 'react';
import { getDatabase, ref, onValue, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { useUserStore } from '~/stores/userStore';

const useOnlineStatus = () => {
	const { user } = useUserStore();

	useEffect(() => {
		if (!user?.id) return;

		const db = getDatabase();
		const userStatusRef = ref(db, 'status/' + user.id);
		const connectedRef = ref(db, '.info/connected');

		const unsubscribe = onValue(connectedRef, (snap) => {
			if (snap.val() === false) return;

			set(userStatusRef, {
				state: 'online',
				last_changed: serverTimestamp(),
			});

			onDisconnect(userStatusRef).set({
				state: 'offline',
				last_changed: serverTimestamp(),
			});
		});

		return unsubscribe;
	}, [user?.id]);
};

export default useOnlineStatus;

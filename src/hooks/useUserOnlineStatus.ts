import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

const useUserOnlineStatus = (userId: string) => {
	const [status, setStatus] = useState({ state: 'offline', last_changed: null });

	useEffect(() => {
		if (!userId) return;

		const db = getDatabase();
		const statusRef = ref(db, 'status/' + userId);

		const unsubscribe = onValue(statusRef, (snap) => {
			if (snap.exists()) {
				setStatus(snap.val());
			} else {
				setStatus({ state: 'offline', last_changed: null });
			}
		});

		return () => unsubscribe();
	}, [userId]);

	return status;
};

export default useUserOnlineStatus;

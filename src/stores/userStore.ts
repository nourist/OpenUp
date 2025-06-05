import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';

import { User } from '~/types/user.type';
import { db } from '~/libs/firebase';

interface UserState {
	user: User | null;
	isLoading: boolean;
	fetchUserInfo: (uid?: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	isLoading: true,
	fetchUserInfo: async (uid) => {
		if (!uid) return set({ user: null, isLoading: false });

		try {
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				set({ user: docSnap.data() as User, isLoading: false });
			} else {
				set({ user: null, isLoading: false });
			}
		} catch (err) {
			console.error(err);

			return set({ user: null, isLoading: false });
		}
	},
}));

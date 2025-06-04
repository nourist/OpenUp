import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '~/libs/firebase';

interface UserState {
	user: any;
	isLoading: boolean;
	fetchUserInfo: (uid?: string) => Promise;
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
				set({ user: docSnap.data(), isLoading: false });
			} else {
				set({ user: null, isLoading: false });
			}
		} catch (err) {
			console.error(err);

			return set({ user: null, isLoading: false });
		}
	},
}));

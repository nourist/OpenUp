import { create } from 'zustand';

import { User } from '~/types/user.type';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	setUser: (user: User | null) => void;
	setLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: true,
	setUser: (user: User | null) => set({ user }),
	setLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useAuthStore;

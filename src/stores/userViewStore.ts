import { create } from 'zustand';
import { User } from '~/types/user.type';

interface UserViewState {
	user: User | null;
	setUser: (user: User | null) => void;
}

const useUserViewStore = create<UserViewState>((set) => ({
	user: null,
	setUser: (user: User | null) => set({ user }),
}));

export default useUserViewStore;

import { create } from 'zustand';
import { User } from '~/types/user.type';

interface AuthState {
	user: User | null;
	isLoading: boolean;
}

const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: false, //true
}));

export default useAuthStore;

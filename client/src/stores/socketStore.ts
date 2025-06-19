import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

type SocketStore = {
	socket: Socket | null;
	initSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
	socket: null,
	initSocket: () => {
		const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
			withCredentials: true,
		});

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		set({ socket });
	},
}));

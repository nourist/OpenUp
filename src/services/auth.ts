import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

import { auth, db } from '~/libs/firebase';

const provider = new GoogleAuthProvider();

export const signup = (email: string, password: string, displayName: string) =>
	createUserWithEmailAndPassword(auth, email, password).then(async (res) => {
		const user = res.user;

		await setDoc(doc(db, 'users', user.uid), {
			email,
			id: user.uid,
			displayName,

			createdAt: new Date(),

			settings: {
				notification: {
					notificationEnabled: true,
					soundEnabled: true,

					messageNotification: false,
					mentionNotification: false,
					groupInviteNotification: true,
					friendRequestNotification: true,

					messageSound: true,
					mentionSound: true,
					groupInviteSound: true,
					friendRequestSound: true,
				},
				language: 'en',
			},

			notifications: [],

			blockedUsers: [],
			friendList: [],
			invitedList: [],
		});
	});

export const signin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const googleSignin = () =>
	signInWithPopup(auth, provider).then(async (res) => {
		const user = res.user;

		const docRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			await setDoc(doc(db, 'users', user.uid), {
				displayName: user.displayName,
				email: user.email,
				id: user.uid,
				avatar: user.photoURL,

				createdAt: new Date(),

				settings: {
					notification: {
						notificationEnabled: true,
						soundEnabled: true,

						messageNotification: false,
						mentionNotification: false,
						groupInviteNotification: true,
						friendRequestNotification: true,

						messageSound: true,
						mentionSound: true,
						groupInviteSound: true,
						friendRequestSound: true,
					},
					language: 'en',
				},

				notifications: [],

				blockedUsers: [],
				friendList: [],
				invitedList: [],
			});
		}
	});

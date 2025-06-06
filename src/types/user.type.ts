import { Timestamp } from 'firebase/firestore';

export type LanguageType =
	| 'en' // Toàn cầu
	| 'vi' // Đông Nam Á
	| 'es' // Tây Ban Nha / Mỹ Latin
	| 'fr' // Châu Âu / Châu Phi
	| 'de' // Trung Âu
	| 'ru' // Đông Âu / Nga
	| 'ar' // Trung Đông / Bắc Phi
	| 'zh' // Trung Quốc
	| 'hi' // Ấn Độ
	| 'ja' // Nhật Bản
	| 'pt' // Brazil / Bồ Đào Nha
	| 'ko' // Hàn Quốc
	| 'tr'; // Thổ Nhĩ Kỳ

export interface NotificationSettings {
	notificationEnabled: boolean;
	soundEnabled: boolean;

	messageNotification: boolean;
	mentionNotification: boolean;
	groupInviteNotification: boolean;
	friendRequestNotification: boolean;

	messageSound: boolean;
	mentionSound: boolean;
	groupInviteSound: boolean;
	friendRequestSound: boolean;
}

export interface UserSettings {
	notification: NotificationSettings;
	language: LanguageType;
}

export interface User {
	id: string;
	email: string;

	displayName: string;
	bio?: string;
	avatar?: string;
	bgAvatar?: string;
	dateOfBirth?: Timestamp;
	gender?: 'male' | 'female' | 'other';

	status?: 'free' | 'busy' | 'away';
	createdAt: Timestamp;

	settings: UserSettings;

	blockedUsers: string[];
	friendList: string[];
}

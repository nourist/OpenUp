import { Send, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Avatar1 from '~/assets/avatar-1.svg';

export function ChatPreview() {
	const { t } = useTranslation('home');

	return (
		<div className="max-w-sm mx-auto">
			{/* Phone Frame */}
			<div className="bg-base-100 rounded-3xl p-4 shadow-2xl border border-base-300 animate-float">
				{/* Phone Header */}
				<div className="flex items-center justify-between mb-4 pb-3 border-b border-base-300">
					<div className="flex items-center space-x-3">
						<Avatar1 className="size-10" />
						<div>
							<h3 className="font-semibold text-base-content">Alex Hatary</h3>
							<p className="text-xs text-base-content/60 capitalize">{t('online')}</p>
						</div>
					</div>
					<div className="w-2 h-2 bg-success mr-4 rounded-full"></div>
				</div>

				{/* Messages */}
				<div className="space-y-3 h-64 overflow-hidden">
					{/* Hardcoded message 1 (other) */}
					<div className="flex justify-start" style={{ animationDelay: `0s` }}>
						<div className="max-w-xs px-4 py-2 rounded-2xl bg-base-200 text-base-content rounded-bl-md">
							<p className="text-sm">{t('msg-preview-1')}</p>
							<p className="text-xs mt-1 text-base-content/50">2:34 PM</p>
						</div>
					</div>
					{/* Hardcoded message 2 (user) */}
					<div className="flex justify-end" style={{ animationDelay: `0.3s` }}>
						<div className="max-w-xs px-4 py-2 rounded-2xl bg-primary text-white rounded-br-md">
							<p className="text-sm">{t('msg-preview-2')}</p>
							<p className="text-xs mt-1 text-white/70">2:35 PM</p>
						</div>
					</div>

					{/* Typing Indicator */}
					<div className="flex justify-start">
						<div className="bg-base-200 px-4 py-2 rounded-2xl rounded-bl-md">
							<div className="flex space-x-1">
								<div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"></div>
								<div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
								<div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
							</div>
						</div>
					</div>
				</div>

				{/* Input Area */}
				<div className="flex items-center space-x-2 mt-4 pt-3 border-t border-base-300">
					<div className="flex-1 bg-base-200 rounded-full px-4 py-2 flex items-center space-x-2">
						<input
							type="text"
							placeholder={t('type-a-message').capitalize()}
							className="flex-1 bg-transparent text-sm text-base-content placeholder-base-content/50 outline-none"
							readOnly
						/>
						<Smile className="w-4 h-4 text-base-content/50" />
					</div>
					<button className="bg-primary hover:bg-primary-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
						<Send strokeWidth={1.75} className="w-4 h-4 text-white" />
					</button>
				</div>
			</div>
		</div>
	);
}

interface Props {
	children: React.ReactNode;
	content: React.ReactNode;
	component?: React.ElementType;
	className?: string;
}

const Tooltip = ({ children, content, component, className = '' }: Props) => {
	const Component = component || 'div';
	return (
		<Component className={`group flex relative ${className}`}>
			{children}
			<span className="text-xs absolute duration-150 left-0 translate-y-1/2 group-hover:translate-y-0 opacity-60 group-hover:opacity-100 text-base-content/90 bottom-full mb-2 transition-all scale-0 group-hover:scale-100 bg-base-100 rounded-lg p-2 shadow-md">
				{content}
				<div className="absolute left-1/2 z-2 -translate-x-1/2 size-3 bg-base-100 rotate-45"></div>
				<div className="absolute left-1/2 z-1 translate-y-1/5 -translate-x-1/2 size-3 bg-base-content/5 rotate-45"></div>
			</span>
		</Component>
	);
};

export default Tooltip;

interface Props {
	className?: string;
}

const AbstractGradientShape = ({ className }: Props) => {
	return (
		<div className={`relative overflow-hidden ${className}`}>
			<div className="from-secondary/20 to-primary/20 absolute -top-20 -left-18 h-full w-[75%] -rotate-45 rounded-full bg-gradient-to-br p-8">
				<div className="from-secondary to-primary h-full w-full rounded-full bg-gradient-to-br"></div>
			</div>
			<div className="from-secondary to-primary absolute bottom-0 -left-8 h-1/3 w-1/6 -rotate-45 rounded-full bg-gradient-to-b"></div>
			<div className="from-secondary to-primary absolute -top-34 left-60 h-1/2 w-2/7 -rotate-45 rounded-full bg-gradient-to-b"></div>
			<div className="from-secondary to-primary absolute -bottom-36 left-60 h-1/2 w-2/7 -rotate-45 rounded-full bg-gradient-to-tr"></div>
		</div>
	);
};

export default AbstractGradientShape;

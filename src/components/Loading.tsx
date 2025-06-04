const Loading = () => {
	return (
		<>
			<div className="loading">
				<svg width="32px" height="24px">
					<polyline id="back" points="2 12 8 12 12 22 20 2 24 12 30 12"></polyline>
					<polyline id="front" points="2 12 8 12 12 22 20 2 24 12 30 12"></polyline>
				</svg>
			</div>
		</>
	);
};

export default Loading;

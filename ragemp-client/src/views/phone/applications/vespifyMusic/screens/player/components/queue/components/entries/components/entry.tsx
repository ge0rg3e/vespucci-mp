import React from 'react';

// Dependencies
import { formatSecondsToTimeElapsed, truncateString } from '@/utils/helpers';

const Component = (props: ExpectedAny) => {
	return (
		<React.Fragment>
			<div className={`entry ${props.isCurrentSong && 'selected'} `} onClick={props.onClick}>
				<div className="thumbnail" style={{ backgroundImage: `url("${props.data.thumbnail}")` }}></div>
				<div className="details">
					<div className="title">{truncateString(props.data.title, 40, true)}</div>
					<div className="information">
						<div className="artists">{truncateString(props.data.artist, 25, true)}</div>
						<div className="dot"></div>
						<div className="duration">{formatSecondsToTimeElapsed(props.data.duration)}</div>
					</div>
					{/* A nice loading effect for UX */}
					{props.isLoading && (
						<div className="loading">
							<div className="icon loading-icon">
								<i className="elm fa-thin fa-spinner-third fa-spin"></i>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;

import React from 'react';

// Dependencies
import { formatSecondsToTimeElapsed, truncateString } from '@/utils/helpers';

const Component = (props: Props) => {
	return (
		<React.Fragment>
			<div className="entry-song">
				<div
					className="thumbnail"
					style={{ backgroundImage: `url("${props.thumbnail}")` }}
				/>
				<div className="content">
					<div className="title">{truncateString(props.title, 40, true)}</div>
					<div className="bottom">
						<span className="artist">{props.artists}</span>
						<div className="dot"></div>
						<span className="duration">
							{formatSecondsToTimeElapsed(props.duration)}
						</span>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	title: 'string';
	artists: string;
	duration: number;
	thumbnail: string;
};

export default Component;

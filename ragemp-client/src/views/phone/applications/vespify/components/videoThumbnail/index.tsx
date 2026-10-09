import React from 'react';

// Context
import { AppState } from '../..';
import moment from 'moment';

const Component = (props: Props) => {
	const { setScreen, setSearch } = AppState();

	const openVideo = () => {
		// Go to video..
		setScreen({
			id: 'video',
			payload: {
				id: props.data.id
			}
		});

		// Close search bar
		setSearch((currentState: ExpectedAny) => ({ ...currentState, expanded: false }));
	};

	const goToChannel = (id: string) => {
		// Go to channel
		setScreen({
			id: 'channel',
			payload: { id }
		});

		// Close search bar
		setSearch((currentState: ExpectedAny) => ({ ...currentState, expanded: false }));
	};

	const onClickFunc = props.onClick ? props.onClick : openVideo;

	return (
		<div className={`component-videoThumbnail ${props.className || ''}`}>
			<div
				className="thumbnail"
				style={{
					backgroundImage: `url("${props.data.thumbnail}")`
				}}
				onClick={onClickFunc}
			>
				<div className="duration">{props.data.duration}</div>
			</div>
			<div className="details">
				<div
					className="avatar"
					style={{ backgroundImage: `url("${props.data.author.avatar}")` }}
					onClick={() => goToChannel(props.data.author.id)}
				/>
				<div className="information" onClick={onClickFunc}>
					<div className="heading">{props.data.title}</div>
					<div className="additionals">
						<div className="author">{props.data.author.name}</div>
						<div className="spacing">
							<i className="icon fa-solid fa-circle"></i>
						</div>
						<div className="views">
							{props.data.views} {window.language === 'EN' ? 'views' : 'vizualizări'}
						</div>
						{props.data.relativeDate !== null && (
							<React.Fragment>
								<div className="spacing">
									<i className="icon fa-solid fa-circle"></i>
								</div>
								<div className="published">{moment(props.data.relativeDate).fromNow()}</div>
							</React.Fragment>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

type Props = {
	className?: string;
	data: VideoCard;
	onClick?: ExpectedAny;
};

export default Component;

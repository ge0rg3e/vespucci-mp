import React from 'react';
import { ChatContext } from '..';
import { Button } from '@mui/material';

const Component = () => {
	const { inputVisible, setInputVisible } = ChatContext();
	const { chatVisible, setChatVisible } = ChatContext();
	if (window.mp.fake !== true) return null;

	return (
		<React.Fragment>
			<div className="chatbox-dev-controls">
				<h4>Chat Dev Controls</h4>

				<Button variant="contained" onClick={() => setChatVisible(!chatVisible)}>
					Chat visible: {chatVisible ? 'Yes' : 'no'}{' '}
				</Button>

				{chatVisible && (
					<React.Fragment>
						<Button
							variant="contained"
							style={{ marginTop: 8 }}
							onClick={() => setInputVisible(!inputVisible)}
						>
							Input visible: {inputVisible ? 'Yes' : 'no'}{' '}
						</Button>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;

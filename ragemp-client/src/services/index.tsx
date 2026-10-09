import React from 'react';

// Background Services
import VespifyServices from './vespify';
import Audio from './audio';
import SocketIo from './socket.io';

const BackgroundServices = (props: ExpectedAny) => {
	return (
		<React.Fragment>
			<SocketIo>
				<Audio>
					<VespifyServices> {props.children}</VespifyServices>
				</Audio>
			</SocketIo>
		</React.Fragment>
	);
};

export default BackgroundServices;

import { Button } from '@mui/material';

const Component = () => {
	const leave = () => {
		window.rpc.triggerServer('buyClothes:leaveSystem');
	};

	return (
		<div className="comp-leave-btn">
			<Button variant="text" size="small" className="button" color="primary" onClick={leave}>
				{window.language === 'RO' ? 'Ieși din magazin' : 'Leave the store'}
			</Button>
		</div>
	);
};

export default Component;

import { AppContext } from '@/utils/context';

const Component = () => {
	const { account } = AppContext();

	return (
		<div className="profile-card">
			<div className="avatar">
				<i className="icon fas fa-user"></i>
			</div>
			<div className="details">
				<div className="username">{account.username}</div>
				<div className="description">Lorem ipsum dolor sit amet consectetur</div>
			</div>
		</div>
	);
};

export default Component;

import { Fragment } from 'react';

interface Props {
	items?: ExpectedAny[];
	item?: ExpectedAny;
	onClick: (item: ExpectedAny) => void;
}

const Redirect = (item: ExpectedAny) => (
	<Fragment>
		<div className="left">
			{item.icon && (
				<div className="icon" style={{ backgroundColor: item.color }}>
					<i className={item.icon}></i>
				</div>
			)}

			<div className="label">{item.label}</div>
		</div>

		<div className="right">
			<i className="fat fa-angle-right"></i>
		</div>
	</Fragment>
);

const Select = (item: ExpectedAny) => (
	<Fragment>
		<div className="left">
			<div className="label">{item.label}</div>
		</div>

		<div className="right">
			<span>{item.right}</span>
			<i className="fat fa-angle-right"></i>
		</div>
	</Fragment>
);

const Component = (props: Props) => (
	<div className="component-subMenus">
		{(props.items || [props.item]).map((entry: ExpectedAny, i: number) =>
			!entry.space ? (
				<div className="subMenu" key={i} onClick={() => props.onClick(entry)}>
					{entry.type === 'redirect' && <Redirect {...entry} />}
					{entry.type === 'select' && <Select {...entry} />}

					<div className="divider"></div>
				</div>
			) : (
				<div style={{ height: '30px', width: '100%' }}></div>
			)
		)}
	</div>
);

export default Component;

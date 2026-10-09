import React from 'react';

const Component = (props: Props) => {
	// Cum sa functioneze: Dai click pe el si sa apara un text langa el care sa zica "Apasa tasta care doresti sa o inlocuiasca"
	// Daca de ex alegi 2, dar 2 mai e in alta parte, sa fie cu rosu cand 2 taste sunt aceleasi.
	// Sa dea si eroare cand se intampl asta.
	// Oh and also cand da click incepi sa "capturezi"orice tasta folosita, dar sa nu le permiti decat anumite taste, ex: daca apsa F1 sa nu
	// ii lasi, sa ii lasi doar tastele "care le-ar putea folosii"din joc. intra in joc si afla "ce taste" ar putea fi folosite.

	return (
		<React.Fragment>
			<div className={`component-keybind`}>
				<div className="key">{props.currentKey}</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	currentKey: string;
	onChange: ExpectedAny;
};

export default Component;

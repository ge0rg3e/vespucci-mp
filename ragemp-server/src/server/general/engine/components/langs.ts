import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('vehiclesEngine', {
	EngineToggleMessage: {
		EN: ({ state }) => `Press <key>2</key> to ${state === true ? 'stop' : 'start'} the engine of this vehicle.`,
		RO: ({ state }) => `Apasă <key>2</key> pentru a ${state === true ? 'opri' : 'porni'} motorul acestui vehicul.`
	},
	EngineToggleMessageHeading: {
		EN: ({ state }) => `The engine is ${state === false ? 'stopped' : 'running'}`,
		RO: ({ state }) => `Motorul este ${state === false ? 'oprit' : 'pornit'}`
	},
	VehicleOwner: {
		EN: ({ owner }) => `The owner of this vehicle is ${owner}`,
		RO: ({ owner }) => `Propietarul acestui vehicul este ${owner}`
	},
	EngineSwitchMessage: {
		EN: ({ player, engineState }) => `${player} ${engineState === true ? `turns the key in ignition and starts the engine` : `turns the key in ignition and stops the engine`}.`,
		RO: ({ player, engineState }) => `${player} ${engineState === true ? `bagă cheia în contact și pornește motorul` : `întoarce cheia din contact și oprește motorul`}.`
	},
	EngineFaultyWarningHeading: {
		EN: `The engine is damaged`,
		RO: `Motorul este distrus`
	},
	EngineFaultyWarning: {
		EN: `This vehicle has a faulty engine. It cannot run anymore.`,
		RO: `Acest vehicul are un motor distrus. Nu mai poate porni din loc.`
	},
	NoFuelHeading: {
		EN: `Ran out of fuel`,
		RO: `Fara combustibil`
	},
	NoFuel: {
		EN: `This vehicle is out of fuel. You need to call a mechanic.`,
		RO: `Acest vehicul nu mai are combustibil. Trebuie sa chemi un mecanic.`
	}
});

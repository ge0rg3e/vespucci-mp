import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Vehicles', {
	'Spawn/De:Title': {
		EN: ({ type }) => (type === 1 ? 'Vehicle spawned' : 'Vehicle despawned'),
		RO: ({ type }) => (type === 1 ? `Vehicul despawned` : `Vehicul despawned`)
	},
	'Spawn:Message': {
		EN: ({ firstTime }) => (!firstTime ? `This vehicle has been spawned. You can find it at its last location in-game.` : `This vehicle has been parked here for the first time.`),
		RO: ({ firstTime }) => (!firstTime ? `Acest vehicul a primit spawn. Îl poți găsi la ultima locație din joc.` : `Acest vehicul a fost parcat aici pentru prima oară.`)
	},
	'CantSpawnHere:Message': {
		EN: "You can't spawn a vehicle here. Please move to a different location",
		RO: 'Nu poti spawna un vehicul aici. Te rog du-te in alta locatie.'
	},
	'CantSpawnHere:InVehicleMessage': {
		EN: "You can't spawn a vehicle now. Get out of the current vehicle first.",
		RO: 'Nu poti spawna un vehicul acum. Ieși din mașină întai.'
	},
	'Despawn:Message': {
		EN: `This vehicle has been despawned.`,
		RO: `Acest vehicul a primit despawn.`
	},
	'Confirmation:Title': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'Error:Title': {
		EN: 'Error',
		RO: 'Eroare'
	},
	'Locked:Title': {
		EN: ({ state }) => `Vehicle ${state === true ? `locked` : `unlocked`}`,
		RO: ({ state }) => `Vehicul ${state === true ? `încuiat` : `descuiat`}`
	},
	'Locked:Message': {
		EN: ({ state }) => `This doors are now ${state === true ? 'locked' : 'unlocked'}.`,
		RO: ({ state }) => `Usile sunt acum ${state === true ? 'blocate' : 'deblocate'}.`
	},
	'NotInParkedVehicle:Message': {
		EN: `You must be inside the vehicle to park it.`,
		RO: `Trebuie sa fi in vehicul pentru a-l parca.`
	},
	'ParkingSafezone:Message': {
		EN: `You can't park in a safezone.`,
		RO: `Nu poți parca intr-o zonă pașnică.`
	},
	'ParkedSuccessful:Message': {
		EN: `You've parked the vehicle here. On respawn you will find it here.`,
		RO: `Ai parcat vehiculul aici. La respawn vei găsi vehiculul aici.`
	},
	'WaypointSet:Message': {
		EN: `Waypoint set to the location of this vehicle. Open your map to see it.`,
		RO: `Ai setat un waypoint la locatia vehiculului. Deschise mapa pentru a-l vedea.`
	},
	'WaypointTooClose:Message': {
		EN: "You're very close to the vehicle. No waypoint needed to find it.",
		RO: 'Esti deja aproape de vehicul. Nu e nevoie de waypoint sa il gasesti.'
	},
	'VehicleRespawned:Message': {
		EN: `This vehicle has been respawned. You can now find it at the parking location.`,
		RO: `Acest vehicul a primit respawn. Îl poți gosi acolo unde a fost parcat.`
	},
	'WaitUntilRespawn:Message': {
		EN: ({ timeLeft }) => `Wait ${timeLeft} minutes before respawning again.`,
		RO: ({ timeLeft }) => `Așteaptă ${timeLeft} minute înainte să respawnezi iar.`
	},
	'WaitUntilSpawn:Title': {
		EN: 'Please wait',
		RO: 'Te rugăm așteaptă'
	},
	'WaitUntilSpawn:Message': {
		EN: ({ timeLeft }) => `Wait ${timeLeft} minutes before spawning again.`,
		RO: ({ timeLeft }) => `Așteaptă ${timeLeft} minute înainte să spawnezi iar.`
	},
	'AutoSpawnConfirmation:Message': {
		EN: ({ boolean }) => {
			if (boolean === true) {
				return `This vehicle will now automatically spawn`;
			} else {
				return `This vehicle will no longer spawn automatically.`;
			}
		},
		RO: ({ boolean }) => {
			if (boolean === true) {
				return `Acest vehicul se va spawna automat la logare.`;
			} else {
				return `Acest vehicul nu se va mai spawna automat.`;
			}
		}
	},
	'AlreadyHasAutoSpawn:Message': {
		EN: ({ max }) => `You can't have more than ${max} vehicle(s) that automatically spawns.`,
		RO: ({ max }) => `Nu poti avea decât ${max} vehicul(e) care se spawnează automat.`
	},
	'AutoSpawnOptionAlreadySet:Message': {
		EN: ({ boolean }) => `You already have this option ${boolean ? `enabled` : `disabled`}`,
		RO: ({ boolean }) => `Ai deja aceasta optiune ${boolean ? `activata` : `dezactivata`}`
	},
	'AbandonConfirmation:Message': {
		EN: ({ displayName }) => `Vehicle ${displayName} has been abandoned.`,
		RO: ({ displayName }) => `Vehiculul ${displayName} a fost abandonat.`
	},
	'Toast:VehicleExpired': {
		EN: ({ displayName }) => `Vehicle ${displayName} has expired.`,
		RO: ({ displayName }) => `Vehiculul ${displayName} a expirat.`
	},
	'Toast:VehicleDespawnedInactivity': {
		EN: ({ displayName }) => `Vehicle ${displayName} got despawned automatically.`,
		RO: ({ displayName }) => `Vehiculul ${displayName} a primit despawn automat.`
	},
	'Annoucement:ChangeOwner': {
		EN: ({ admin, targetId, ownerName }) => `${admin} set the owner of personal vehicle ${targetId} to ${ownerName}`,
		RO: ({ admin, targetId, ownerName }) => `${admin} a setat propietarul mașinii personale ${targetId} la  ${ownerName}`
	},
	'Annoucement:ChangeOdometer': {
		EN: ({ admin, targetId, value }) => `${admin} set the odometer of personal vehicle ${targetId} to ${value} KM`,
		RO: ({ admin, targetId, value }) => `${admin} a setat propietarul mașinii personale ${targetId} la  ${value} KM`
	},
	'Annoucement:ResetSpecific': {
		EN: ({ admin, targetId, value }) => `${admin} reset specific data about ${value} for personal vehicle ${targetId}`,
		RO: ({ admin, targetId, value }) => `${admin} a resetat detalii specifice despre ${value} la mașina personala ${targetId}`
	},
	'Annoucement:AbandonVehicle': {
		EN: ({ admin, targetId, ownerName }) => `${admin} deleted personal vehicle ${targetId} owned by ${ownerName}.`,
		RO: ({ admin, targetId, ownerName }) => `${admin} a șters mașina personală ${targetId} deținută de ${ownerName}.`
	}
});

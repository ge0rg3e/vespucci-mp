mp.events.add(`onDialogResponse@gasStationPump:use`, function (player: PlayerMp, response: DialogResponse) {
	// If they pressed F and hold a petrol can item
	if (response.responseKey === 'F' && player.vars.petrolCan.status) {
		// Call the event so the other event handler will take care of this.
		mp.events.call(`petrolCan:showRefillDialog`, player, response.payload);
	}

	// If they pressed F and they seem to want to refill car
	if (response.responseKey === 'F' && !player.vars.petrolCan.status) {
		const isUsingPump = player.vars.gasStationPump.gasStationId;

		mp.events.call(`gasStation:${!isUsingPump ? 'pickNozzle' : 'leaveNozzle'}`, player, response.payload);
	}
});

import { createColshape, deleteColshape } from '@server/natives/colshapes/components/functions';
import { EditTypes, EditValues, Light, Pickup } from './types';

export class Pickups {
	private pickups: Pickup[] = [];

	public create(id: string, model: string, pos: Vector3, light: Light, dimension: number) {
		if (this.get(id)) return false;
		const object = mp.objects.new(mp.joaat(model), pos, {
			dimension
		});
		object.setVariables({
			_isPickup: true,
			_light: light,
			_id: id
		});
		createColshape({
			identifier: `pickup:${id}`,
			position: pos,
			range: 1.5,
			dimension,
			payload: { id }
		});

		this.pickups.push({ id, object });
		return true;
	}

	public get(id: string) {
		const find = this.pickups.find((x) => x.id === id);
		if (!find) return null;
		return find;
	}

	public delete(id: string) {
		const pickup = this.get(id);
		if (!pickup) return false;
		deleteColshape(`pickup:${id}`);
		pickup.object.destroy();
		this.pickups = this.pickups.filter((x) => x.id !== id);
		return true;
	}

	public edit(id: string, type: EditTypes, value: EditValues) {
		const pickup = this.get(id);
		if (!pickup) return false;

		if (type === 'pos') {
			pickup.object.position = value as Vector3;
			deleteColshape(`pickup:${id}`);
			createColshape({
				identifier: `pickup:${id}`,
				position: value as Vector3,
				range: 1.5,
				dimension: pickup.object.dimension,
				payload: { id }
			});
		}
		if (type === 'model') {
			pickup.object.model = mp.joaat(value as string);
		}
		if (type === 'color') {
			pickup.object.setVariables({
				_light: value as Light,
				_isPickup: true,
				_id: id
			});
		}

		return true;
	}
}

mp.pickups = new Pickups();

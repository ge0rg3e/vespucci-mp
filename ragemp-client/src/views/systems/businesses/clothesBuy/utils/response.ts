import { Clothes, PlayerClothing, lastDefaultGameClothingIds } from '../../clothesManage/response';

const PlayerResponse = {
	clothing: PlayerClothing,
	clothes: [],
	balance: {
		cash: 5000,
		beachCoins: 4000
	},
	lastDefaultGameClothingIds
};

const ClothesResponse = [...Clothes].map((c) => ({ ...c, isAvailable: true }));

export default {
	PlayerResponse,
	ClothesResponse
};

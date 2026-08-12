import {
	getCars,
	getCurrentUser,
	STORE_EVENT,
} from '../db/ecommerceStore.js';
import { bindFavoriteButtons, createVehicleCardElement } from './vehicleCard.js';

const featuredVehicles = () => {
	document.querySelectorAll('[data-featured-root]').forEach((root) => {
		const render = () => {
			const grid = root.querySelector('.featured-vehicles__grid');
			if (!grid) return;
			const user = getCurrentUser();
			const favorites = user?.favorites || [];
			const premium = getCars()
				.filter((car) => car.isPremium)
				.slice(0, 6);

			grid.innerHTML = '';
			premium.forEach((car) => {
				grid.append(
					createVehicleCardElement(car, {
						favorited: favorites.includes(car.id),
					})
				);
			});
			bindFavoriteButtons(grid);
		};

		if (root.dataset.featuredVehiclesReady === 'true') {
			render();
			return;
		}

		render();
		document.addEventListener(STORE_EVENT, render);
		root.dataset.featuredVehiclesReady = 'true';
	});
};

export default featuredVehicles;

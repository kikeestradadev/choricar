import {
	conditionLabel,
	formatMileage,
	formatPrice,
	getCurrentUser,
	toggleFavorite,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';

export const createVehicleCardElement = (car, { favorited = false } = {}) => {
	const article = document.createElement('article');
	article.className = 'vehicle-card';
	article.dataset.vehicleId = car.id;

	const href = `./vehiculo.html?id=${encodeURIComponent(car.id)}`;
	const image = car.images?.[0] || 'https://picsum.photos/seed/fallback/800/600';
	const title = `${car.brand} ${car.model}`;

	article.innerHTML = `
		<a class="vehicle-card__media" href="${href}">
			<img class="vehicle-card__image" src="${image}" alt="${title}" loading="lazy" />
			<span class="vehicle-card__badge vehicle-card__badge--condition">${conditionLabel(car.condition)}</span>
			${car.isPremium ? '<span class="vehicle-card__badge vehicle-card__badge--premium">Premium</span>' : ''}
		</a>
		<div class="vehicle-card__body">
			<div class="vehicle-card__top">
				<h3 class="vehicle-card__title">
					<a class="vehicle-card__title-link" href="${href}">${title}</a>
				</h3>
				<button class="vehicle-card__fav${favorited ? ' is-active' : ''}" type="button" aria-label="Favorito" data-card-fav data-car-id="${car.id}" aria-pressed="${favorited}">
					<span aria-hidden="true">♥</span>
				</button>
			</div>
			<p class="vehicle-card__price">${formatPrice(car.price, car.currency)}</p>
			<ul class="vehicle-card__meta">
				<li class="vehicle-card__meta-item">${car.year}</li>
				<li class="vehicle-card__meta-item">${formatMileage(car.mileage)}</li>
				<li class="vehicle-card__meta-item">${car.location}</li>
			</ul>
		</div>
	`;

	return article;
};

export const bindFavoriteButtons = (root) => {
	root.querySelectorAll('[data-card-fav]').forEach((btn) => {
		if (btn.dataset.favBound === 'true') return;
		btn.dataset.favBound = 'true';
		btn.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			const user = getCurrentUser();
			if (!user) {
				window.location.href = './login.html';
				return;
			}
			const carId = btn.dataset.carId;
			try {
				const favorites = toggleFavorite(user.id, carId);
				const active = favorites.includes(carId);
				btn.classList.toggle('is-active', active);
				btn.setAttribute('aria-pressed', String(active));
				showToast(active ? 'Agregado a favoritos' : 'Eliminado de favoritos', 'success');
			} catch (error) {
				showToast(error.message || 'No se pudo actualizar favorito', 'error');
			}
		});
	});
};

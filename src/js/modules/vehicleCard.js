import {
	conditionLabel,
	formatMileage,
	formatPrice,
	fuelLabel,
	getCurrentUser,
	getUserById,
	toggleFavorite,
	transmissionLabel,
	whatsappUrl,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';

const WHATSAPP_ICON = `<svg class="vehicle-card__whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.6.7-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5zm5.2-6.8c-.3-.1-1.7-.8-1.9-.9s-.5-.1-.6.1-.7.9-.9 1.1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.4.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.5-.9-2s-.5-.5-.6-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 6 6 0 0 0 1.2 3.2 13.6 13.6 0 0 0 5.2 4.6 4.4 4.4 0 0 0 2.7.6 3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>`;

export const createVehicleCardElement = (car, { favorited = false } = {}) => {
	const article = document.createElement('article');
	const isPremium = Boolean(car.isPremium);
	article.className = `vehicle-card${isPremium ? ' vehicle-card--premium' : ''}`;
	article.dataset.vehicleId = car.id;

	const href = `./vehiculo.html?id=${encodeURIComponent(car.id)}`;
	const image = car.images?.[0] || '';
	const title = `${car.brand} ${car.model}`;
	const seller = getUserById(car.sellerId);
	const waHref = seller?.phone
		? whatsappUrl(seller.phone, `Hola, me interesa el ${title} ${car.year} publicado en Choricar.`)
		: '';

	if (isPremium) {
		article.setAttribute(
			'title',
			'Vendedor Premium — mayor confianza y visibilidad'
		);
	}

	const planBadge = isPremium
		? `<span class="vehicle-card__badge vehicle-card__badge--premium">★ Destacado</span>`
		: `<span class="vehicle-card__badge vehicle-card__badge--free">Gratis</span>`;

	const whatsappControl = waHref
		? `<a class="vehicle-card__whatsapp" href="${waHref}" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">${WHATSAPP_ICON}<span>WhatsApp</span></a>`
		: '';

	article.innerHTML = `
		<a class="vehicle-card__media" href="${href}">
			<img class="vehicle-card__image" src="${image}" alt="${title}" loading="lazy" />
			<span class="vehicle-card__badge vehicle-card__badge--condition">${conditionLabel(car.condition)}</span>
			${planBadge}
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
			<ul class="vehicle-card__pills">
				<li class="vehicle-card__pill">${car.year}</li>
				<li class="vehicle-card__pill">${formatMileage(car.mileage)}</li>
				<li class="vehicle-card__pill">${fuelLabel(car.fuel)}</li>
				<li class="vehicle-card__pill">${transmissionLabel(car.transmission)}</li>
			</ul>
			<p class="vehicle-card__location">${car.location || ''}</p>
			<div class="vehicle-card__actions">
				<a class="vehicle-card__details" href="${href}">Ver detalles</a>
				${whatsappControl}
			</div>
		</div>
		${isPremium ? '<span class="vehicle-card__tooltip">Vendedor Premium — mayor confianza y visibilidad</span>' : ''}
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

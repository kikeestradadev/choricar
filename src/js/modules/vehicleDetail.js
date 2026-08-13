import {
	bodyTypeLabel,
	conditionLabel,
	formatMileage,
	formatPrice,
	fuelLabel,
	getCarById,
	getCars,
	getCarsBySellerId,
	getCurrentUser,
	getUserById,
	STORE_EVENT,
	toggleFavorite,
	transmissionLabel,
	whatsappUrl,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';
import { bindFavoriteButtons, createVehicleCardElement } from './vehicleCard.js';
import vehicleGallerySlider from './vehicleGallerySlider.js';
import similarCarsSlider from './similarCarsSlider.js';

const SIMILAR_LIMIT = 8;
const PRICE_RANGE = 0.2;

const renderMaintenance = (root, maintenance = []) => {
	const empty = root.querySelector('[data-maintenance-empty]');
	const list = root.querySelector('[data-maintenance-items]');
	if (!list) return;

	list.innerHTML = '';
	if (!maintenance.length) {
		if (empty) empty.hidden = false;
		return;
	}
	if (empty) empty.hidden = true;

	maintenance
		.slice()
		.sort((a, b) => String(b.date).localeCompare(String(a.date)))
		.forEach((item) => {
			const li = document.createElement('li');
			li.className = 'maintenance-list__item';
			li.innerHTML = `
				<div class="maintenance-list__head">
					<strong class="maintenance-list__type">${item.type}</strong>
					<span class="maintenance-list__date">${item.date}</span>
				</div>
				<p class="maintenance-list__desc">${item.description || ''}</p>
				<p class="maintenance-list__cost">${formatPrice(item.cost, 'CRC')}</p>
			`;
			list.append(li);
		});
};

const getSimilarCars = (car) => {
	const others = getCars().filter((item) => item.id !== car.id);
	const sameBrand = others.filter((item) => item.brand === car.brand);
	const min = car.price * (1 - PRICE_RANGE);
	const max = car.price * (1 + PRICE_RANGE);
	const closePrice = others.filter(
		(item) => item.brand !== car.brand && item.price >= min && item.price <= max
	);

	const seen = new Set();
	const result = [];
	[...sameBrand, ...closePrice].forEach((item) => {
		if (seen.has(item.id) || result.length >= SIMILAR_LIMIT) return;
		seen.add(item.id);
		result.push(item);
	});
	return result;
};

const vehicleDetail = () => {
	document.querySelectorAll('[data-vehicle-detail]').forEach((root) => {
		if (root.dataset.vehicleDetailReady === 'true') return;

		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');

		const loading = root.querySelector('[data-detail-loading]');
		const empty = root.querySelector('[data-detail-empty]');
		const content = root.querySelector('[data-detail-content]');

		const render = () => {
			const car = id ? getCarById(id) : null;
			if (loading) loading.hidden = true;

			if (!car) {
				if (empty) empty.hidden = false;
				if (content) content.hidden = true;
				const stickyMissing = root.querySelector('[data-detail-sticky-wa]');
				if (stickyMissing) stickyMissing.hidden = true;
				return;
			}

			if (empty) empty.hidden = true;
			if (content) content.hidden = false;

			const setText = (selector, value) => {
				const el = root.querySelector(selector);
				if (el) el.textContent = value;
			};

			setText('[data-detail-title]', `${car.brand} ${car.model}`);
			setText('[data-detail-price]', formatPrice(car.price, car.currency));
			setText('[data-detail-condition]', conditionLabel(car.condition));
			setText('[data-detail-year]', String(car.year));
			setText('[data-detail-mileage]', formatMileage(car.mileage));
			setText('[data-detail-transmission]', transmissionLabel(car.transmission));
			setText('[data-detail-fuel]', fuelLabel(car.fuel));
			setText('[data-detail-color]', car.color || '—');
			setText('[data-detail-body]', bodyTypeLabel(car.bodyType));
			setText('[data-detail-location]', car.location);
			setText('[data-detail-description]', car.description || '');

			const premium = root.querySelector('[data-detail-premium]');
			if (premium) premium.hidden = !car.isPremium;

			const fillGallery = (selector) => {
				const gallery = root.querySelector(selector);
				if (!gallery) return;
				gallery.innerHTML = '';
				const images = car.images?.length ? car.images : [];
				images.forEach((src) => {
					const slide = document.createElement('div');
					slide.className = 'swiper-slide';
					slide.innerHTML = `<img class="vehicle-detail__image" src="${src}" alt="${car.brand} ${car.model}" />`;
					gallery.append(slide);
				});
			};

			fillGallery('[data-detail-gallery]');
			fillGallery('[data-detail-thumbs]');
			const sliderRoot = root.querySelector('.vehicle-gallery-slider');
			if (sliderRoot) sliderRoot.dataset.vehicleGallerySliderReady = 'false';
			vehicleGallerySlider();

			renderMaintenance(root, car.maintenance);

			const seller = getUserById(car.sellerId);
			const listingCount = seller ? getCarsBySellerId(seller.id).length : 0;
			const inquiry = `Hola, me interesa el ${car.brand} ${car.model} ${car.year} publicado en Choricar.`;
			const waHref = seller?.phone ? whatsappUrl(seller.phone, inquiry) : '';

			const sellerEl = root.querySelector('[data-detail-seller]');
			if (sellerEl) {
				sellerEl.innerHTML = seller
					? `
						<img class="vehicle-detail__seller-avatar" src="${seller.avatar}" alt="" width="64" height="64" />
						<div class="vehicle-detail__seller-copy">
							<p class="vehicle-detail__seller-name">${seller.name}</p>
							<p class="vehicle-detail__seller-plan">Plan: ${seller.plan === 'premium' ? 'Premium' : 'Gratis'}${seller.verified ? ' · Verificado' : ''}</p>
							<p class="vehicle-detail__seller-meta">${listingCount} anuncio${listingCount === 1 ? '' : 's'} activo${listingCount === 1 ? '' : 's'}</p>
							${waHref ? `<a class="vehicle-detail__seller-wa" href="${waHref}" target="_blank" rel="noopener noreferrer">WhatsApp ${seller.phone}</a>` : `<p class="vehicle-detail__seller-meta">${seller.phone || seller.email || ''}</p>`}
						</div>
					`
					: '<p>Vendedor no disponible</p>';
			}

			const contact = root.querySelector('[data-detail-contact]');
			const sticky = root.querySelector('[data-detail-sticky-wa]');
			if (contact) {
				if (waHref) {
					contact.href = waHref;
					contact.hidden = false;
				} else if (seller?.email) {
					contact.href = `mailto:${seller.email}?subject=${encodeURIComponent(`Consulta: ${car.brand} ${car.model}`)}`;
					contact.textContent = 'Contactar vendedor';
					contact.removeAttribute('target');
				} else {
					contact.hidden = true;
				}
			}
			if (sticky) {
				if (waHref) {
					sticky.href = waHref;
					sticky.hidden = false;
				} else {
					sticky.hidden = true;
				}
			}

			const similarRoot = root.querySelector('.similar-cars-slider');
			const similarList = root.querySelector('[data-similar-list]');
			if (similarList) {
				similarList.innerHTML = '';
				const similar = getSimilarCars(car);
				if (similar.length) {
					const user = getCurrentUser();
					const favorites = user?.favorites || [];
					similar.forEach((item) => {
						const slide = document.createElement('div');
						slide.className = 'swiper-slide';
						slide.append(
							createVehicleCardElement(item, {
								favorited: favorites.includes(item.id),
							})
						);
						similarList.append(slide);
					});
					bindFavoriteButtons(similarList);
				}
				if (similarRoot) similarRoot.dataset.similarCarsSliderReady = 'false';
				similarCarsSlider();
			}

			const favBtn = root.querySelector('[data-detail-fav]');
			const user = getCurrentUser();
			const isFav = Boolean(user?.favorites?.includes(car.id));
			favBtn?.classList.toggle('is-active', isFav);
			favBtn?.setAttribute('aria-pressed', String(isFav));
		};

		root.querySelectorAll('[data-tab]').forEach((tab) => {
			tab.addEventListener('click', () => {
				const name = tab.dataset.tab;
				root.querySelectorAll('[data-tab]').forEach((t) => {
					const active = t === tab;
					t.classList.toggle('is-active', active);
					t.setAttribute('aria-selected', String(active));
				});
				root.querySelectorAll('[data-panel]').forEach((panel) => {
					const active = panel.dataset.panel === name;
					panel.classList.toggle('is-active', active);
					panel.hidden = !active;
				});
			});
		});

		root.querySelector('[data-detail-fav]')?.addEventListener('click', () => {
			const user = getCurrentUser();
			if (!user) {
				window.location.href = './login.html';
				return;
			}
			try {
				const favorites = toggleFavorite(user.id, id);
				const active = favorites.includes(id);
				const favBtn = root.querySelector('[data-detail-fav]');
				favBtn?.classList.toggle('is-active', active);
				showToast(active ? 'Agregado a favoritos' : 'Eliminado de favoritos', 'success');
			} catch (error) {
				showToast(error.message || 'Error', 'error');
			}
		});

		render();
		document.addEventListener(STORE_EVENT, render);
		root.dataset.vehicleDetailReady = 'true';
	});
};

export default vehicleDetail;

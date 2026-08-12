import {
	conditionLabel,
	formatMileage,
	formatPrice,
	fuelLabel,
	getCarById,
	getCurrentUser,
	getUserById,
	STORE_EVENT,
	toggleFavorite,
	transmissionLabel,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';
import vehicleGallerySlider from './vehicleGallerySlider.js';

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
			setText('[data-detail-location]', car.location);
			setText('[data-detail-description]', car.description || '');

			const premium = root.querySelector('[data-detail-premium]');
			if (premium) premium.hidden = !car.isPremium;

			const gallery = root.querySelector('[data-detail-gallery]');
			if (gallery) {
				gallery.innerHTML = '';
				(car.images || []).forEach((src) => {
					const slide = document.createElement('div');
					slide.className = 'swiper-slide';
					slide.innerHTML = `<img class="vehicle-detail__image" src="${src}" alt="${car.brand} ${car.model}" />`;
					gallery.append(slide);
				});
				root.querySelector('.vehicle-gallery-slider').dataset.vehicleGallerySliderReady = 'false';
				vehicleGallerySlider();
			}

			renderMaintenance(root, car.maintenance);

			const seller = getUserById(car.sellerId);
			const sellerEl = root.querySelector('[data-detail-seller]');
			if (sellerEl) {
				sellerEl.innerHTML = seller
					? `
						<img class="vehicle-detail__seller-avatar" src="${seller.avatar}" alt="" width="64" height="64" />
						<div>
							<p class="vehicle-detail__seller-name">${seller.name}</p>
							<p class="vehicle-detail__seller-meta">${seller.phone || ''}</p>
							<p class="vehicle-detail__seller-meta">${seller.email || ''}</p>
							<p class="vehicle-detail__seller-plan">Plan: ${seller.plan === 'premium' ? 'Premium' : 'Gratis'}</p>
						</div>
					`
					: '<p>Vendedor no disponible</p>';
			}

			const contact = root.querySelector('[data-detail-contact]');
			if (contact && seller?.email) {
				contact.href = `mailto:${seller.email}?subject=${encodeURIComponent(`Consulta: ${car.brand} ${car.model}`)}`;
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

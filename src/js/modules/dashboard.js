import {
	deleteCar,
	formatPrice,
	getCars,
	getCarById,
	getCurrentUser,
	logout,
	STORE_EVENT,
	updateUser,
} from '../db/ecommerceStore.js';
import { bindFavoriteButtons, createVehicleCardElement } from './vehicleCard.js';
import { showToast } from './toast.js';

const renderUserVehicles = (root, user) => {
	const list = root.querySelector('[data-user-vehicles-list]');
	const empty = root.querySelector('[data-user-vehicles-empty]');
	if (!list) return;

	const cars = getCars().filter((car) => car.sellerId === user.id);
	list.innerHTML = '';

	if (!cars.length) {
		if (empty) empty.hidden = false;
		return;
	}
	if (empty) empty.hidden = true;

	cars.forEach((car) => {
		const row = document.createElement('article');
		row.className = 'user-vehicles__item';
		row.innerHTML = `
			<img class="user-vehicles__thumb" src="${car.images?.[0] || ''}" alt="" width="96" height="72" />
			<div class="user-vehicles__info">
				<h3 class="user-vehicles__name">${car.brand} ${car.model} ${car.year}</h3>
				<p class="user-vehicles__price">${formatPrice(car.price, car.currency)}</p>
			</div>
			<div class="user-vehicles__actions">
				<a class="user-vehicles__edit" href="./agregar-vehiculo.html?edit=${encodeURIComponent(car.id)}">Editar</a>
				<button class="user-vehicles__delete" type="button" data-delete-car="${car.id}">Eliminar</button>
			</div>
		`;
		list.append(row);
	});

	list.querySelectorAll('[data-delete-car]').forEach((btn) => {
		btn.addEventListener('click', () => {
			if (!window.confirm('¿Eliminar este vehículo?')) return;
			try {
				deleteCar(btn.dataset.deleteCar);
				showToast('Vehículo eliminado', 'success');
			} catch (error) {
				showToast(error.message || 'No se pudo eliminar', 'error');
			}
		});
	});
};

const renderFavorites = (root, user) => {
	const list = root.querySelector('[data-favorites-list]');
	const empty = root.querySelector('[data-favorites-empty]');
	if (!list) return;

	const cars = (user.favorites || [])
		.map((id) => getCarById(id))
		.filter(Boolean);

	list.innerHTML = '';
	if (!cars.length) {
		if (empty) empty.hidden = false;
		return;
	}
	if (empty) empty.hidden = true;

	cars.forEach((car) => {
		list.append(createVehicleCardElement(car, { favorited: true }));
	});
	bindFavoriteButtons(list);
};

const renderProfile = (root, user) => {
	const form = root.querySelector('.dashboard-profile__form');
	if (!form) return;
	form.elements.namedItem('name').value = user.name || '';
	form.elements.namedItem('email').value = user.email || '';
	form.elements.namedItem('phone').value = user.phone || '';
};

const renderSubscription = (root, user) => {
	const planEl = root.querySelector('[data-dash-plan]');
	if (planEl) {
		planEl.textContent =
			user.plan === 'premium'
				? 'Plan actual: Premium (vehículos ilimitados + destacados)'
				: 'Plan actual: Gratis (1 vehículo activo)';
	}
};

const showPanel = (root, panelId) => {
	root.querySelectorAll('[data-dash-tab]').forEach((btn) => {
		btn.classList.toggle('is-active', btn.dataset.dashTab === panelId);
	});
	root.querySelectorAll('[data-panel]').forEach((panel) => {
		const active = panel.dataset.panel === panelId;
		panel.classList.toggle('is-active', active);
		panel.hidden = !active;
	});
};

const dashboard = () => {
	document.querySelectorAll('[data-dashboard]').forEach((root) => {
		if (root.dataset.dashboardReady === 'true') return;

		const guest = root.querySelector('[data-dashboard-guest]');
		const content = root.querySelector('[data-dashboard-content]');

		const render = () => {
			const user = getCurrentUser();
			if (!user) {
				if (guest) guest.hidden = false;
				if (content) content.hidden = true;
				return;
			}
			if (guest) guest.hidden = true;
			if (content) content.hidden = false;

			renderUserVehicles(root, user);
			renderFavorites(root, user);
			renderProfile(root, user);
			renderSubscription(root, user);
		};

		root.querySelectorAll('[data-dash-tab]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const tab = btn.dataset.dashTab;
				if (tab === 'logout') {
					logout();
					window.location.href = './index.html';
					return;
				}
				showPanel(root, tab);
			});
		});

		root.querySelector('.dashboard-profile__form')?.addEventListener('submit', (event) => {
			event.preventDefault();
			const user = getCurrentUser();
			if (!user) return;
			const data = new FormData(event.currentTarget);
			try {
				updateUser(user.id, {
					name: data.get('name'),
					email: data.get('email'),
					phone: data.get('phone'),
				});
				showToast('Perfil actualizado', 'success');
			} catch (error) {
				showToast(error.message || 'Error al guardar', 'error');
			}
		});

		render();
		document.addEventListener(STORE_EVENT, render);
		root.dataset.dashboardReady = 'true';
	});
};

export default dashboard;

import {
	getCars,
	getCurrentUser,
	STORE_EVENT,
} from '../db/ecommerceStore.js';
import { bindFavoriteButtons, createVehicleCardElement } from './vehicleCard.js';

const PAGE_SIZE = 12;

const readFiltersFromUrl = () => {
	const params = new URLSearchParams(window.location.search);
	return {
		q: params.get('q') || '',
		brand: params.get('brand') || '',
		model: params.get('model') || '',
		yearMin: params.get('yearMin') || '',
		yearMax: params.get('yearMax') || '',
		priceMin: params.get('priceMin') || '',
		priceMax: params.get('priceMax') || '',
		condition: params.get('condition') || '',
		transmission: params.get('transmission') || '',
		fuel: params.get('fuel') || '',
		location: params.get('location') || '',
		sort: params.get('sort') || 'price-asc',
		page: Number(params.get('page') || 1),
	};
};

const writeFiltersToUrl = (filters) => {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (
			value !== '' &&
			value != null &&
			!(key === 'page' && Number(value) === 1) &&
			!(key === 'sort' && value === 'price-asc')
		) {
			params.set(key, String(value));
		}
	});
	const query = params.toString();
	const next = `${window.location.pathname}${query ? `?${query}` : ''}`;
	window.history.replaceState({}, '', next);
};

const normalize = (value) =>
	String(value || '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '');

const applyFilters = (cars, filters) => {
	let list = cars.slice();

	if (filters.q) {
		const q = normalize(filters.q);
		list = list.filter((car) =>
			normalize(`${car.brand} ${car.model} ${car.location} ${car.year}`).includes(q)
		);
	}
	if (filters.brand) {
		const brand = normalize(filters.brand);
		list = list.filter((c) => normalize(c.brand) === brand);
	}
	if (filters.model) {
		const model = normalize(filters.model);
		list = list.filter((c) => normalize(c.model) === model);
	}
	if (filters.yearMin) list = list.filter((c) => c.year >= Number(filters.yearMin));
	if (filters.yearMax) list = list.filter((c) => c.year <= Number(filters.yearMax));
	if (filters.priceMin) list = list.filter((c) => c.price >= Number(filters.priceMin));
	if (filters.priceMax) list = list.filter((c) => c.price <= Number(filters.priceMax));
	if (filters.condition) list = list.filter((c) => c.condition === filters.condition);
	if (filters.transmission) list = list.filter((c) => c.transmission === filters.transmission);
	if (filters.fuel) list = list.filter((c) => c.fuel === filters.fuel);
	if (filters.location) list = list.filter((c) => c.location === filters.location);

	switch (filters.sort) {
		case 'price-desc':
			list.sort((a, b) => b.price - a.price);
			break;
		case 'year-desc':
			list.sort((a, b) => b.year - a.year);
			break;
		case 'year-asc':
			list.sort((a, b) => a.year - b.year);
			break;
		case 'mileage-asc':
			list.sort((a, b) => a.mileage - b.mileage);
			break;
		default:
			list.sort((a, b) => a.price - b.price);
	}

	return list;
};

const buildOptionsFromCars = (cars, fallbackModelsByBrand = {}) => {
	const brands = new Set();
	const years = new Set();
	const modelsByBrand = {};

	cars.forEach((car) => {
		if (!car?.brand) return;
		brands.add(car.brand);
		if (car.year != null) years.add(Number(car.year));
		if (!modelsByBrand[car.brand]) modelsByBrand[car.brand] = new Set();
		if (car.model) modelsByBrand[car.brand].add(car.model);
	});

	Object.entries(fallbackModelsByBrand).forEach(([brand, models]) => {
		brands.add(brand);
		if (!modelsByBrand[brand]) modelsByBrand[brand] = new Set();
		(models || []).forEach((model) => modelsByBrand[brand].add(model));
	});

	const normalizedModels = {};
	Object.keys(modelsByBrand)
		.sort((a, b) => a.localeCompare(b, 'es'))
		.forEach((brand) => {
			normalizedModels[brand] = [...modelsByBrand[brand]].sort((a, b) =>
				a.localeCompare(b, 'es')
			);
		});

	return {
		brands: [...brands].sort((a, b) => a.localeCompare(b, 'es')),
		years: [...years].sort((a, b) => a - b),
		modelsByBrand: normalizedModels,
	};
};

const fillSelect = (select, values, { allLabel = 'Todas', selected = '' } = {}) => {
	if (!select) return;
	select.innerHTML = '';
	const placeholder = document.createElement('option');
	placeholder.value = '';
	placeholder.textContent = allLabel;
	select.append(placeholder);
	values.forEach((value) => {
		const option = document.createElement('option');
		option.value = String(value);
		option.textContent = String(value);
		if (String(value) === String(selected)) option.selected = true;
		select.append(option);
	});
};

const vehicleGrid = () => {
	const filterRoot = document.querySelector('[data-filters-root]');
	const gridRoot = document.querySelector('[data-vehicle-grid]');
	if (!gridRoot) return;
	if (gridRoot.dataset.vehicleGridReady === 'true') return;

	let fallbackModelsByBrand = {};
	const modelsDataEl =
		document.getElementById('filters-models-data-list') ||
		document.getElementById('filters-models-data');
	try {
		fallbackModelsByBrand = modelsDataEl ? JSON.parse(modelsDataEl.textContent) : {};
	} catch {
		fallbackModelsByBrand = {};
	}

	const form = filterRoot?.querySelector('.vehicle-filters__form');
	const brandSelect = form?.querySelector('[name="brand"]');
	const modelSelect = form?.querySelector('[name="model"]');
	const yearMinSelect = form?.querySelector('[name="yearMin"]');
	const yearMaxSelect = form?.querySelector('[name="yearMax"]');
	const listEl = gridRoot.querySelector('[data-grid-list]');
	const countEl = gridRoot.querySelector('[data-grid-count]');
	const pageInfo = gridRoot.querySelector('[data-page-info]');
	const prevBtn = gridRoot.querySelector('[data-page-prev]');
	const nextBtn = gridRoot.querySelector('[data-page-next]');

	let modelsByBrand = { ...fallbackModelsByBrand };

	const syncFilterOptions = (filters = {}) => {
		const options = buildOptionsFromCars(getCars(), fallbackModelsByBrand);
		modelsByBrand = options.modelsByBrand;

		const currentBrand = filters.brand || brandSelect?.value || '';
		const currentModel = filters.model || modelSelect?.value || '';
		const currentYearMin = filters.yearMin || yearMinSelect?.value || '';
		const currentYearMax = filters.yearMax || yearMaxSelect?.value || '';

		fillSelect(brandSelect, options.brands, {
			allLabel: 'Todas',
			selected: currentBrand,
		});
		fillSelect(modelSelect, modelsByBrand[currentBrand] || [], {
			allLabel: 'Todas',
			selected: currentModel,
		});
		fillSelect(yearMinSelect, options.years, {
			allLabel: 'Todas',
			selected: currentYearMin,
		});
		fillSelect(yearMaxSelect, options.years, {
			allLabel: 'Todas',
			selected: currentYearMax,
		});
	};

	const getFiltersFromForm = () => {
		const base = readFiltersFromUrl();
		if (!form) return base;
		const data = new FormData(form);
		return {
			...base,
			brand: data.get('brand') || '',
			model: data.get('model') || '',
			yearMin: data.get('yearMin') || '',
			yearMax: data.get('yearMax') || '',
			priceMin: data.get('priceMin') || '',
			priceMax: data.get('priceMax') || '',
			condition: data.get('condition') || '',
			transmission: data.get('transmission') || '',
			fuel: data.get('fuel') || '',
			location: data.get('location') || '',
			sort: data.get('sort') || 'price-asc',
			page: base.page || 1,
		};
	};

	const render = (filters = getFiltersFromForm()) => {
		syncFilterOptions(filters);

		// If selected model no longer exists for brand, drop it.
		if (filters.brand && filters.model) {
			const allowed = modelsByBrand[filters.brand] || [];
			if (!allowed.includes(filters.model)) {
				filters = { ...filters, model: '' };
				if (modelSelect) modelSelect.value = '';
			}
		}

		const user = getCurrentUser();
		const favorites = user?.favorites || [];
		const filtered = applyFilters(getCars(), filters);
		const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
		const page = Math.min(Math.max(1, Number(filters.page) || 1), totalPages);
		const start = (page - 1) * PAGE_SIZE;
		const pageItems = filtered.slice(start, start + PAGE_SIZE);

		if (countEl) {
			countEl.textContent = `${filtered.length} vehículo${filtered.length === 1 ? '' : 's'} encontrados`;
		}

		if (listEl) {
			listEl.innerHTML = '';
			if (!pageItems.length) {
				listEl.innerHTML =
					'<p class="vehicle-grid__empty">No hay resultados con esos filtros.</p>';
			} else {
				pageItems.forEach((car) => {
					listEl.append(
						createVehicleCardElement(car, {
							favorited: favorites.includes(car.id),
						})
					);
				});
				bindFavoriteButtons(listEl);
			}
		}

		if (pageInfo) pageInfo.textContent = `${page} / ${totalPages}`;
		if (prevBtn) prevBtn.disabled = page <= 1;
		if (nextBtn) nextBtn.disabled = page >= totalPages;

		const nextFilters = { ...filters, page };
		writeFiltersToUrl(nextFilters);
		gridRoot._filters = nextFilters;
	};

	const initial = readFiltersFromUrl();
	render(initial);

	brandSelect?.addEventListener('change', () => {
		const filters = { ...getFiltersFromForm(), model: '', page: 1 };
		render(filters);
	});

	form?.addEventListener('change', (event) => {
		if (event.target === brandSelect) return;
		const filters = { ...getFiltersFromForm(), page: 1 };
		render(filters);
	});

	form?.addEventListener('reset', () => {
		window.setTimeout(() => {
			render({
				q: '',
				brand: '',
				model: '',
				yearMin: '',
				yearMax: '',
				priceMin: '',
				priceMax: '',
				condition: '',
				transmission: '',
				fuel: '',
				location: '',
				sort: 'price-asc',
				page: 1,
			});
		}, 0);
	});

	prevBtn?.addEventListener('click', () => {
		const filters = { ...(gridRoot._filters || getFiltersFromForm()) };
		filters.page = Math.max(1, (filters.page || 1) - 1);
		render(filters);
	});

	nextBtn?.addEventListener('click', () => {
		const filters = { ...(gridRoot._filters || getFiltersFromForm()) };
		filters.page = (filters.page || 1) + 1;
		render(filters);
	});

	document.addEventListener(STORE_EVENT, () =>
		render(gridRoot._filters || getFiltersFromForm())
	);

	gridRoot.dataset.vehicleGridReady = 'true';
};

export default vehicleGrid;

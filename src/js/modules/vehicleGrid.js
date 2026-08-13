import {
	getCars,
	getCurrentUser,
	getUserById,
	STORE_EVENT,
} from '../db/ecommerceStore.js';
import { bindFavoriteButtons, createVehicleCardElement } from './vehicleCard.js';

const PAGE_SIZE = 12;

const EMPTY_FILTERS = {
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
	bodyType: '',
	mileageMin: '',
	mileageMax: '',
	hasPhotos: '',
	verifiedOnly: '',
	location: '',
	sort: 'price-asc',
	page: 1,
};

const CONDITION_ALIASES = {
	usado: 'used',
	used: 'used',
	nuevo: 'new',
	new: 'new',
};

const FUEL_ALIASES = {
	electrico: 'electric',
	electric: 'electric',
	hibrido: 'hybrid',
	hybrid: 'hybrid',
	gasolina: 'gasoline',
	gasoline: 'gasoline',
	diesel: 'diesel',
};

const BODY_ALIASES = {
	sedan: 'sedan',
	suv: 'suv',
	pickup: 'pickup',
	'pick-up': 'pickup',
	hatchback: 'hatchback',
	van: 'van',
	convertible: 'convertible',
};

const isTruthyParam = (value) => value === '1' || value === 'true' || value === true;

const aliasKey = (value, map) => {
	if (!value) return '';
	const normalized = String(value)
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '');
	return map[normalized] || '';
};

const readFiltersFromUrl = () => {
	const params = new URLSearchParams(window.location.search);
	const fuelFromTipo = aliasKey(params.get('tipo'), FUEL_ALIASES);
	const bodyFromTipo = aliasKey(params.get('tipo'), BODY_ALIASES);

	return {
		q: params.get('q') || '',
		brand: params.get('brand') || params.get('marca') || '',
		model: params.get('model') || params.get('modelo') || '',
		yearMin: params.get('yearMin') || '',
		yearMax: params.get('yearMax') || '',
		priceMin: params.get('priceMin') || params.get('precioMin') || '',
		priceMax: params.get('priceMax') || params.get('precioMax') || params.get('precio') || '',
		condition:
			aliasKey(params.get('condition') || params.get('condicion'), CONDITION_ALIASES) ||
			params.get('condition') ||
			'',
		transmission: params.get('transmission') || '',
		fuel:
			aliasKey(params.get('fuel') || params.get('combustible'), FUEL_ALIASES) ||
			fuelFromTipo ||
			params.get('fuel') ||
			'',
		bodyType:
			aliasKey(params.get('bodyType') || params.get('carroceria'), BODY_ALIASES) ||
			(!fuelFromTipo && bodyFromTipo ? bodyFromTipo : '') ||
			params.get('bodyType') ||
			'',
		mileageMin: params.get('mileageMin') || params.get('kmMin') || '',
		mileageMax: params.get('mileageMax') || params.get('kmMax') || '',
		hasPhotos: isTruthyParam(params.get('hasPhotos')) ? '1' : '',
		verifiedOnly: isTruthyParam(params.get('verifiedOnly')) ? '1' : '',
		location: params.get('location') || params.get('ubicacion') || '',
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

const compareBySort = (a, b, sort) => {
	switch (sort) {
		case 'price-desc':
			return b.price - a.price;
		case 'year-desc':
			return b.year - a.year;
		case 'year-asc':
			return a.year - b.year;
		case 'mileage-asc':
			return a.mileage - b.mileage;
		default:
			return a.price - b.price;
	}
};

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
	if (filters.bodyType) list = list.filter((c) => c.bodyType === filters.bodyType);
	if (filters.mileageMin) list = list.filter((c) => c.mileage >= Number(filters.mileageMin));
	if (filters.mileageMax) list = list.filter((c) => c.mileage <= Number(filters.mileageMax));
	if (isTruthyParam(filters.hasPhotos)) {
		list = list.filter((c) => Array.isArray(c.images) && c.images.length > 0);
	}
	if (isTruthyParam(filters.verifiedOnly)) {
		list = list.filter((c) => Boolean(getUserById(c.sellerId)?.verified));
	}
	if (filters.location) list = list.filter((c) => c.location === filters.location);

	list.sort((a, b) => {
		if (Boolean(a.isPremium) !== Boolean(b.isPremium)) {
			return a.isPremium ? -1 : 1;
		}
		return compareBySort(a, b, filters.sort);
	});

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

const applyFiltersToForm = (form, filters) => {
	if (!form) return;
	Object.entries(filters).forEach(([key, value]) => {
		const field = form.elements.namedItem(key);
		if (!field) return;
		if (field.type === 'checkbox') {
			field.checked = isTruthyParam(value);
		} else if ('value' in field) {
			field.value = value ?? '';
		}
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
			...EMPTY_FILTERS,
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
			bodyType: data.get('bodyType') || '',
			mileageMin: data.get('mileageMin') || '',
			mileageMax: data.get('mileageMax') || '',
			hasPhotos: form.querySelector('[name="hasPhotos"]')?.checked ? '1' : '',
			verifiedOnly: form.querySelector('[name="verifiedOnly"]')?.checked ? '1' : '',
			location: data.get('location') || '',
			sort: data.get('sort') || 'price-asc',
			page: base.page || 1,
		};
	};

	const render = (filters = getFiltersFromForm()) => {
		syncFilterOptions(filters);
		applyFiltersToForm(form, filters);

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

	const initial = { ...EMPTY_FILTERS, ...readFiltersFromUrl() };
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
			render({ ...EMPTY_FILTERS });
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

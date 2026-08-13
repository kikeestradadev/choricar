import { isPlaceholderImage, resolveCarImages } from './carImages.js';

export { isPlaceholderImage, resolveCarImages, buildCarImageUrl, buildCarImageUrls } from './carImages.js';

export const STORAGE_KEY = 'choricar-ecommerce-store-v4';
export const LEGACY_STORAGE_KEY = 'choricar-ecommerce-store-v3';
export const LEGACY_STORAGE_KEYS = [
	'choricar-ecommerce-store-v3',
	'choricar-ecommerce-store-v2',
];
export const STORE_EVENT = 'ecommerce-store-updated';

export const CARS_URL = './data/db/cars.json';
export const USERS_URL = './data/db/users.json';
export const SUBSCRIPTIONS_URL = './data/db/subscriptions.json';

export const createId = (prefix = 'id') => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
	}
	return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

const emptyStore = () => ({
	cars: [],
	users: [],
	subscriptions: [],
	session: null,
});

const BODY_TYPE_BY_MODEL = {
	Corolla: 'sedan',
	Civic: 'sedan',
	Accord: 'sedan',
	Sentra: 'sedan',
	Versa: 'sedan',
	Elantra: 'sedan',
	Accent: 'sedan',
	Forte: 'sedan',
	Mazda6: 'sedan',
	RAV4: 'suv',
	Fortuner: 'suv',
	'CR-V': 'suv',
	'HR-V': 'suv',
	Pilot: 'suv',
	'X-Trail': 'suv',
	Kicks: 'suv',
	Tucson: 'suv',
	'Santa Fe': 'suv',
	Creta: 'suv',
	Sportage: 'suv',
	Sorento: 'suv',
	Seltos: 'suv',
	Vitara: 'suv',
	Jimny: 'suv',
	Outlander: 'suv',
	Montero: 'suv',
	ASX: 'suv',
	'CX-5': 'suv',
	'CX-30': 'suv',
	'CX-9': 'suv',
	Escape: 'suv',
	Explorer: 'suv',
	Tracker: 'suv',
	Tahoe: 'suv',
	Equinox: 'suv',
	Hilux: 'pickup',
	Frontier: 'pickup',
	L200: 'pickup',
	Ranger: 'pickup',
	'F-150': 'pickup',
	Silverado: 'pickup',
	Yaris: 'hatchback',
	Rio: 'hatchback',
	Swift: 'hatchback',
	Baleno: 'hatchback',
	SX4: 'hatchback',
	Mirage: 'hatchback',
	Mazda3: 'hatchback',
	Spark: 'hatchback',
	Mustang: 'convertible',
};

const inferBodyType = (car) => {
	if (car?.bodyType) return car.bodyType;
	return BODY_TYPE_BY_MODEL[car?.model] || 'sedan';
};

const normalizeCar = (car) => ({
	...car,
	bodyType: inferBodyType(car),
	color: car?.color || 'Gris',
	images: resolveCarImages(car),
	maintenance: Array.isArray(car?.maintenance) ? car.maintenance : [],
	isPremium: Boolean(car?.isPremium),
});

const normalizeUser = (user) => ({
	...user,
	verified: Boolean(user?.verified),
	favorites: Array.isArray(user?.favorites) ? user.favorites : [],
	plan: user?.plan === 'premium' ? 'premium' : 'free',
});

const normalizeStoreShape = (parsed) => ({
	cars: (parsed.cars || []).map(normalizeCar),
	users: (parsed.users || []).map(normalizeUser),
	subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
	session: parsed.session || null,
});

export const readStore = (storageKey = STORAGE_KEY) => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed?.cars) || !Array.isArray(parsed?.users)) {
			return null;
		}
		return normalizeStoreShape(parsed);
	} catch {
		return null;
	}
};

export const writeStore = (storageKey, store) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(store));
		return true;
	} catch {
		return false;
	}
};

export const ensureIds = (list, prefix) =>
	list.map((item) =>
		item?.id
			? item
			: {
					...item,
					id: createId(prefix),
				}
	);

export const dispatchStoreUpdate = () => {
	document.dispatchEvent(new CustomEvent(STORE_EVENT));
};

let memoryStore = null;

export const getStore = () => memoryStore || readStore() || emptyStore();

export const persistStore = (store = getStore()) => {
	memoryStore = {
		cars: store.cars || [],
		users: store.users || [],
		subscriptions: store.subscriptions || [],
		session: store.session || null,
	};
	if (!writeStore(STORAGE_KEY, memoryStore)) return false;
	dispatchStoreUpdate();
	return true;
};

const readLegacyStore = () => {
	for (const key of LEGACY_STORAGE_KEYS) {
		const stored = readStore(key);
		if (stored) return stored;
	}
	return null;
};

const overlaySeedImages = (store, seedCars = []) => {
	const byId = Object.fromEntries(seedCars.map((car) => [car.id, car]));
	store.cars = store.cars.map((car) => {
		const seed = byId[car.id];
		if (!seed) return car;
		const current = Array.isArray(car.images) ? car.images : [];
		const stale =
			current.some(isPlaceholderImage) ||
			(current.length > 0 &&
				current.every((src) => isPlaceholderImage(src)));
		if (!stale) return car;
		return { ...car, images: Array.isArray(seed.images) ? seed.images : [] };
	});
	return store;
};

export const loadEcommerceStore = async ({
	carsUrl = CARS_URL,
	usersUrl = USERS_URL,
	subscriptionsUrl = SUBSCRIPTIONS_URL,
} = {}) => {
	const stored = readStore() || readLegacyStore();
	if (stored) {
		memoryStore = {
			cars: ensureIds(stored.cars, 'car').map(normalizeCar),
			users: ensureIds(stored.users, 'user').map(normalizeUser),
			subscriptions: ensureIds(stored.subscriptions, 'sub'),
			session: stored.session || null,
		};
		const premiumSellers = new Set(
			memoryStore.users.filter((user) => user.plan === 'premium').map((user) => user.id)
		);
		memoryStore.cars = memoryStore.cars.map((car) => ({
			...car,
			isPremium: premiumSellers.has(car.sellerId),
		}));
		try {
			const seedRes = await fetch(carsUrl);
			if (seedRes.ok) {
				const seedData = await seedRes.json();
				overlaySeedImages(
					memoryStore,
					Array.isArray(seedData.cars) ? seedData.cars : []
				);
			}
		} catch {
			/* keep stored images if seed overlay fails */
		}
		writeStore(STORAGE_KEY, memoryStore);
		return { ...memoryStore, source: 'localStorage' };
	}

	const [carsRes, usersRes, subsRes] = await Promise.all([
		fetch(carsUrl),
		fetch(usersUrl),
		fetch(subscriptionsUrl).catch(() => null),
	]);

	if (!carsRes.ok) throw new Error(`GET ${carsUrl} failed`);
	if (!usersRes.ok) throw new Error(`GET ${usersUrl} failed`);

	const [carsData, usersData] = await Promise.all([carsRes.json(), usersRes.json()]);
	let subscriptions = [];
	if (subsRes && subsRes.ok) {
		const subsData = await subsRes.json();
		subscriptions = Array.isArray(subsData.subscriptions) ? subsData.subscriptions : [];
	}

	memoryStore = {
		cars: ensureIds(Array.isArray(carsData.cars) ? carsData.cars : [], 'car').map(
			normalizeCar
		),
		users: ensureIds(Array.isArray(usersData.users) ? usersData.users : [], 'user').map(
			normalizeUser
		),
		subscriptions: ensureIds(subscriptions, 'sub'),
		session: null,
	};

	writeStore(STORAGE_KEY, memoryStore);
	return { ...memoryStore, source: carsUrl };
};

export const getCars = () => getStore().cars.slice();

export const getCarById = (id) => getStore().cars.find((car) => car.id === id) || null;

export const addCar = (carData) => {
	const store = getStore();
	const user = getCurrentUser();
	if (!user) throw new Error('Debes iniciar sesión para publicar');

	const userCars = store.cars.filter((c) => c.sellerId === user.id);
	if (user.plan !== 'premium' && userCars.length >= 1) {
		throw new Error('LIMIT_FREE');
	}

	const car = normalizeCar({
		...carData,
		id: carData.id || createId('car'),
		sellerId: user.id,
		isPremium: user.plan === 'premium',
		bodyType: carData.bodyType || 'sedan',
		color: carData.color || 'Gris',
		maintenance: Array.isArray(carData.maintenance) ? carData.maintenance : [],
		images: Array.isArray(carData.images) ? carData.images : [],
		createdAt: carData.createdAt || new Date().toISOString(),
	});

	store.cars = [car, ...store.cars];
	persistStore(store);
	return car;
};

export const updateCar = (id, data) => {
	const store = getStore();
	const index = store.cars.findIndex((car) => car.id === id);
	if (index < 0) throw new Error('Vehículo no encontrado');

	const user = getCurrentUser();
	if (!user || store.cars[index].sellerId !== user.id) {
		throw new Error('No tienes permiso para editar este vehículo');
	}

	store.cars[index] = normalizeCar({
		...store.cars[index],
		...data,
		id,
		sellerId: store.cars[index].sellerId,
	});
	persistStore(store);
	return store.cars[index];
};

export const deleteCar = (id) => {
	const store = getStore();
	const car = store.cars.find((c) => c.id === id);
	if (!car) throw new Error('Vehículo no encontrado');

	const user = getCurrentUser();
	if (!user || car.sellerId !== user.id) {
		throw new Error('No tienes permiso para eliminar este vehículo');
	}

	store.cars = store.cars.filter((c) => c.id !== id);
	store.users = store.users.map((u) => ({
		...u,
		favorites: (u.favorites || []).filter((favId) => favId !== id),
	}));
	persistStore(store);
	return true;
};

export const registerUser = (userData) => {
	const store = getStore();
	const email = String(userData.email || '')
		.trim()
		.toLowerCase();
	if (!email || !userData.password) {
		throw new Error('Email y contraseña son obligatorios');
	}
	if (store.users.some((u) => u.email.toLowerCase() === email)) {
		throw new Error('Este correo ya está registrado');
	}

	const user = {
		id: createId('user'),
		name: userData.name || 'Usuario',
		email,
		password: String(userData.password),
		avatar: userData.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
		phone: userData.phone || '',
		plan: 'free',
		verified: false,
		favorites: [],
		createdAt: new Date().toISOString(),
	};

	store.users = [...store.users, user];
	store.session = { userId: user.id };
	persistStore(store);
	return { ...user, password: undefined };
};

export const loginUser = (email, password) => {
	const store = getStore();
	const normalized = String(email || '')
		.trim()
		.toLowerCase();
	const user = store.users.find(
		(u) => u.email.toLowerCase() === normalized && u.password === String(password)
	);
	if (!user) throw new Error('Correo o contraseña incorrectos');

	store.session = { userId: user.id };
	persistStore(store);
	return { ...user, password: undefined };
};

export const loginWithSocial = (provider, profile = {}) => {
	const store = getStore();
	const email =
		profile.email ||
		`${provider}-${Date.now()}@choricar.social`;
	let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

	if (!user) {
		user = {
			id: createId('user'),
			name: profile.name || `Usuario ${provider}`,
			email: email.toLowerCase(),
			password: createId('social'),
			avatar: profile.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
			phone: '',
			plan: 'free',
			verified: false,
			favorites: [],
			provider,
			createdAt: new Date().toISOString(),
		};
		store.users = [...store.users, user];
	}

	store.session = { userId: user.id, provider };
	persistStore(store);
	return { ...user, password: undefined };
};

export const logout = () => {
	const store = getStore();
	store.session = null;
	persistStore(store);
};

export const getCurrentUser = () => {
	const store = getStore();
	if (!store.session?.userId) return null;
	const user = store.users.find((u) => u.id === store.session.userId);
	if (!user) return null;
	const { password, ...safe } = user;
	return safe;
};

export const updateUser = (id, data) => {
	const store = getStore();
	const index = store.users.findIndex((u) => u.id === id);
	if (index < 0) throw new Error('Usuario no encontrado');

	const current = getCurrentUser();
	if (!current || current.id !== id) {
		throw new Error('No tienes permiso para editar este perfil');
	}

	const next = { ...store.users[index], ...data, id };
	if (data.password === '' || data.password == null) {
		next.password = store.users[index].password;
	}
	store.users[index] = next;
	persistStore(store);
	const { password, ...safe } = next;
	return safe;
};

export const toggleFavorite = (userId, carId) => {
	const store = getStore();
	const index = store.users.findIndex((u) => u.id === userId);
	if (index < 0) throw new Error('Usuario no encontrado');

	const favorites = Array.isArray(store.users[index].favorites)
		? [...store.users[index].favorites]
		: [];
	const favIndex = favorites.indexOf(carId);
	if (favIndex >= 0) {
		favorites.splice(favIndex, 1);
	} else {
		favorites.push(carId);
	}
	store.users[index] = { ...store.users[index], favorites };
	persistStore(store);
	return favorites;
};

export const subscribe = (userId, plan = 'premium') => {
	const store = getStore();
	const index = store.users.findIndex((u) => u.id === userId);
	if (index < 0) throw new Error('Usuario no encontrado');

	store.users[index] = { ...store.users[index], plan };
	store.cars = store.cars.map((car) =>
		car.sellerId === userId ? { ...car, isPremium: plan === 'premium' } : car
	);

	const start = new Date();
	const end = new Date(start);
	end.setFullYear(end.getFullYear() + 1);

	store.subscriptions = [
		{
			id: createId('sub'),
			userId,
			plan,
			startDate: start.toISOString().slice(0, 10),
			endDate: end.toISOString().slice(0, 10),
		},
		...store.subscriptions.filter((s) => s.userId !== userId),
	];

	persistStore(store);
	return getCurrentUser();
};

export const cancelSubscription = (userId) => {
	const store = getStore();
	const index = store.users.findIndex((u) => u.id === userId);
	if (index < 0) throw new Error('Usuario no encontrado');

	store.users[index] = { ...store.users[index], plan: 'free' };
	store.cars = store.cars.map((car) =>
		car.sellerId === userId ? { ...car, isPremium: false } : car
	);
	persistStore(store);
	return getCurrentUser();
};

export const getUserById = (id) => {
	const user = getStore().users.find((u) => u.id === id);
	if (!user) return null;
	const { password, ...safe } = user;
	return safe;
};

export const getCarsBySellerId = (sellerId) =>
	getStore().cars.filter((car) => car.sellerId === sellerId);

export const whatsappUrl = (phone, text = '') => {
	const digits = String(phone || '').replace(/\D/g, '');
	if (!digits) return '';
	const query = text ? `?text=${encodeURIComponent(text)}` : '';
	return `https://wa.me/${digits}${query}`;
};

export const formatPrice = (price, currency = 'CRC') => {
	const value = Number(price) || 0;
	if (currency === 'USD') {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(value);
	}
	return new Intl.NumberFormat('es-CR', {
		style: 'currency',
		currency: 'CRC',
		maximumFractionDigits: 0,
	}).format(value);
};

export const formatMileage = (km) =>
	`${new Intl.NumberFormat('es-CR').format(Number(km) || 0)} km`;

export const conditionLabel = (condition) =>
	condition === 'new' ? 'Nuevo' : 'Usado';

export const transmissionLabel = (value) =>
	value === 'automatic' ? 'Automática' : 'Manual';

export const fuelLabel = (value) => {
	const map = {
		gasoline: 'Gasolina',
		diesel: 'Diésel',
		electric: 'Eléctrico',
		hybrid: 'Híbrido',
	};
	return map[value] || value;
};

export const bodyTypeLabel = (value) => {
	const map = {
		sedan: 'Sedán',
		suv: 'SUV',
		pickup: 'Pick-up',
		hatchback: 'Hatchback',
		van: 'Van',
		convertible: 'Convertible',
	};
	return map[value] || value || '—';
};

const IMAGE_ANGLES = ['01', '23', '29'];
const CDN = 'https://cdn.imagin.studio/getImage';
const CUSTOMER = 'img';

const MODEL_FAMILY = {
	Mazda3: '3',
	Mazda6: '6',
	'CR-V': 'cr-v',
	'HR-V': 'hr-v',
	'X-Trail': 'x-trail',
	'Santa Fe': 'santa-fe',
	'CX-5': 'cx-5',
	'CX-30': 'cx-30',
	'CX-9': 'cx-9',
	'F-150': 'f-150',
	L200: 'l200',
	ASX: 'asx',
	SX4: 'sx4',
};

const PAINT = {
	Blanco: 'white',
	Negro: 'black',
	Gris: 'grey',
	Plata: 'silver',
	Rojo: 'red',
	Azul: 'blue',
	Verde: 'green',
	Beige: 'beige',
};

const POWERTRAIN = {
	gasoline: 'petrol',
	diesel: 'diesel',
	electric: 'electric',
	hybrid: 'hybrid',
};

export const isPlaceholderImage = (url) =>
	/picsum\.photos|cdn\.imagin\.studio/i.test(String(url || ''));

export const modelFamilyFromCar = (car) => {
	if (MODEL_FAMILY[car?.model]) return MODEL_FAMILY[car.model];
	return String(car?.model || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-');
};

export const buildCarImageUrl = (car, angle = '01', width = 800) => {
	const params = new URLSearchParams({
		customer: CUSTOMER,
		make: String(car?.brand || 'toyota').toLowerCase(),
		modelFamily: modelFamilyFromCar(car) || 'corolla',
		zoomType: 'fullscreen',
		angle: String(angle),
		width: String(width),
	});
	if (car?.year) params.set('modelYear', String(car.year));
	const paint = PAINT[car?.color];
	if (paint) params.set('paintDescription', paint);
	const powerTrain = POWERTRAIN[car?.fuel];
	if (powerTrain) params.set('powerTrain', powerTrain);
	return `${CDN}?${params.toString()}`;
};

export const buildCarImageUrls = (car, { count = 3, width = 800 } = {}) =>
	IMAGE_ANGLES.slice(0, count).map((angle) => buildCarImageUrl(car, angle, width));

export const resolveCarImages = (car) => {
	const images = Array.isArray(car?.images) ? car.images : [];
	if (!images.length) return [];
	if (images.some((src) => String(src).startsWith('data:'))) return images.filter(Boolean);
	return images.filter(Boolean);
};

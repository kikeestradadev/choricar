import {
	addCar,
	bodyTypeLabel,
	conditionLabel,
	formatMileage,
	formatPrice,
	fuelLabel,
	getCarById,
	getCars,
	getCurrentUser,
	transmissionLabel,
	updateCar,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';

const DEFAULT_IMAGE_COPY = {
	remove: 'Quitar',
	empty: 'Aún no hay imágenes adjuntas.',
	minFiles: 3,
	maxFiles: 10,
	maxSizeMb: 2,
};

const readFileAsDataUrl = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result || ''));
		reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
		reader.readAsDataURL(file);
	});

const compressImage = (dataUrl, maxWidth = 1200, quality = 0.82) =>
	new Promise((resolve) => {
		const image = new Image();
		image.onload = () => {
			const scale = Math.min(1, maxWidth / image.width);
			const width = Math.round(image.width * scale);
			const height = Math.round(image.height * scale);
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(dataUrl);
				return;
			}
			ctx.drawImage(image, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', quality));
		};
		image.onerror = () => resolve(dataUrl);
		image.src = dataUrl;
	});

const optionLabel = (field, value) => {
	if (!value) return '—';
	if (field?.name === 'condition') return conditionLabel(value);
	if (field?.name === 'fuel') return fuelLabel(value);
	if (field?.name === 'transmission') return transmissionLabel(value);
	if (field?.name === 'bodyType') return bodyTypeLabel(value);
	const match = field?.options?.find((opt) => String(opt.value) === String(value));
	return match?.label || String(value);
};

const vehicleForm = () => {
	document.querySelectorAll('[data-vehicle-form]').forEach((root) => {
		if (root.dataset.vehicleFormReady === 'true') return;

		const form = root.querySelector('.vehicle-form__form');
		const titleEl = root.querySelector('[data-form-title]');
		const submitEl = root.querySelector('[data-form-submit]');
		const nextEl = root.querySelector('[data-step-next]');
		const prevEl = root.querySelector('[data-step-prev]');
		const errorEl = root.querySelector('[data-form-error]');
		const limitEl = root.querySelector('[data-form-limit]');
		const idInput = root.querySelector('[data-form-id]');
		const fileInput = root.querySelector('[data-image-input]');
		const previewsEl = root.querySelector('[data-image-previews]');
		const emptyEl = root.querySelector('[data-images-empty]');
		const summaryEl = root.querySelector('[data-form-summary]');

		let copy = {
			editTitle: 'Editar vehículo',
			submitUpdate: 'Guardar cambios',
			submitCreate: 'Publicar',
			images: DEFAULT_IMAGE_COPY,
			fields: [],
			summary: { emptyPhotos: 'Sin fotos' },
		};
		try {
			const copyEl = document.getElementById('vehicle-form-copy');
			if (copyEl) copy = { ...copy, ...JSON.parse(copyEl.textContent) };
		} catch {
			/* ignore */
		}

		const imageCopy = { ...DEFAULT_IMAGE_COPY, ...(copy.images || {}) };
		const minFiles = Number(imageCopy.minFiles) || 3;
		const maxFiles = Number(imageCopy.maxFiles) || 10;
		const maxBytes = (Number(imageCopy.maxSizeMb) || 2) * 1024 * 1024;
		let images = [];
		let currentStep = 1;

		const setError = (message = '') => {
			if (!errorEl) return;
			errorEl.hidden = !message;
			errorEl.textContent = message;
		};

		const showStep = (step) => {
			currentStep = step;
			root.querySelectorAll('[data-step-panel]').forEach((panel) => {
				panel.hidden = Number(panel.dataset.stepPanel) !== step;
			});
			root.querySelectorAll('[data-step-indicator]').forEach((item) => {
				const index = Number(item.dataset.stepIndicator);
				item.classList.toggle('is-active', index === step);
				item.classList.toggle('is-done', index < step);
			});
			if (prevEl) prevEl.hidden = step === 1;
			if (nextEl) nextEl.hidden = step === 3;
			if (submitEl) submitEl.hidden = step !== 3;
			if (step === 3) renderSummary();
			setError('');
		};

		const renderPreviews = () => {
			if (!previewsEl) return;
			previewsEl.innerHTML = '';

			if (emptyEl) emptyEl.hidden = images.length > 0;

			images.forEach((src, index) => {
				const item = document.createElement('li');
				item.className = 'vehicle-form__preview';
				item.innerHTML = `
					<img class="vehicle-form__preview-image" src="${src}" alt="Vista previa ${index + 1}" />
					<button class="vehicle-form__preview-remove" type="button" data-remove-image="${index}">
						${imageCopy.remove}
					</button>
				`;
				previewsEl.append(item);
			});

			previewsEl.querySelectorAll('[data-remove-image]').forEach((btn) => {
				btn.addEventListener('click', () => {
					const index = Number(btn.dataset.removeImage);
					images = images.filter((_, i) => i !== index);
					renderPreviews();
				});
			});
		};

		const renderSummary = () => {
			if (!summaryEl || !form) return;
			const data = new FormData(form);
			const rows = (copy.fields || [])
				.filter((field) => field.name !== 'description')
				.map((field) => {
					const raw = data.get(field.name);
					let display = optionLabel(field, raw);
					if (field.name === 'price') {
						display = formatPrice(raw, data.get('currency') || 'CRC');
					}
					if (field.name === 'mileage') display = formatMileage(raw);
					if (field.name === 'currency') return '';
					return `<div class="vehicle-form__summary-row"><dt>${field.label}</dt><dd>${display || '—'}</dd></div>`;
				})
				.join('');

			const description = data.get('description') || '—';
			summaryEl.innerHTML = `
				<dl class="vehicle-form__summary-list">${rows}</dl>
				<p class="vehicle-form__summary-desc">${description}</p>
				<div class="vehicle-form__summary-photos">
					${
						images.length
							? images
									.map(
										(src, index) =>
											`<img class="vehicle-form__summary-image" src="${src}" alt="Foto ${index + 1}" />`
									)
									.join('')
							: `<p>${copy.summary?.emptyPhotos || 'Sin fotos'}</p>`
					}
				</div>
			`;
		};

		const validateStep = (step) => {
			if (step === 1) {
				const panel = root.querySelector('[data-step-panel="1"]');
				const fields = panel?.querySelectorAll('input, select, textarea') || [];
				for (const field of fields) {
					if (!field.checkValidity()) {
						field.reportValidity();
						return false;
					}
				}
				return true;
			}
			if (step === 2) {
				if (images.length < minFiles) {
					const message = `Adjunta al menos ${minFiles} fotos del vehículo`;
					setError(message);
					showToast(message, 'error');
					return false;
				}
				return true;
			}
			return true;
		};

		const params = new URLSearchParams(window.location.search);
		const editId = params.get('edit');
		const user = getCurrentUser();

		if (!user) {
			window.location.href = './login.html';
			return;
		}

		if (editId) {
			const car = getCarById(editId);
			if (!car || car.sellerId !== user.id) {
				showToast('No puedes editar este vehículo', 'error');
				window.location.href = './dashboard.html';
				return;
			}
			if (titleEl) titleEl.textContent = copy.editTitle;
			if (submitEl) submitEl.textContent = copy.submitUpdate;
			if (idInput) idInput.value = car.id;

			Object.entries(car).forEach(([key, value]) => {
				if (key === 'images') return;
				const field = form?.elements.namedItem(key);
				if (!field || !('value' in field)) return;
				field.value = value ?? '';
			});

			images = Array.isArray(car.images) ? [...car.images] : [];
		} else {
			const userCars = getCars().filter((c) => c.sellerId === user.id);
			if (user.plan !== 'premium' && userCars.length >= 1) {
				if (limitEl) limitEl.hidden = false;
				if (form) form.hidden = true;
				const stepper = root.querySelector('[data-form-stepper]');
				if (stepper) stepper.hidden = true;
			}
		}

		renderPreviews();
		showStep(1);

		fileInput?.addEventListener('change', async () => {
			const files = [...(fileInput.files || [])];
			fileInput.value = '';

			if (!files.length) return;

			const available = maxFiles - images.length;
			if (available <= 0) {
				showToast(`Máximo ${maxFiles} imágenes`, 'error');
				return;
			}

			const selected = files.slice(0, available);
			if (files.length > available) {
				showToast(`Solo se agregaron ${available} imagen(es)`, 'error');
			}

			try {
				for (const file of selected) {
					if (!file.type.startsWith('image/')) {
						showToast(`Archivo no válido: ${file.name}`, 'error');
						continue;
					}
					if (file.size > maxBytes) {
						showToast(`${file.name} supera ${imageCopy.maxSizeMb} MB`, 'error');
						continue;
					}
					const raw = await readFileAsDataUrl(file);
					const compressed = await compressImage(raw);
					images.push(compressed);
				}
				renderPreviews();
			} catch (error) {
				showToast(error.message || 'Error al adjuntar imágenes', 'error');
			}
		});

		nextEl?.addEventListener('click', () => {
			if (!validateStep(currentStep)) return;
			showStep(Math.min(3, currentStep + 1));
		});

		prevEl?.addEventListener('click', () => {
			showStep(Math.max(1, currentStep - 1));
		});

		form?.addEventListener('submit', async (event) => {
			event.preventDefault();
			if (currentStep !== 3) {
				if (!validateStep(currentStep)) return;
				showStep(Math.min(3, currentStep + 1));
				return;
			}
			if (!validateStep(1)) {
				showStep(1);
				return;
			}
			if (!validateStep(2)) {
				showStep(2);
				return;
			}

			const data = new FormData(form);
			const payload = {
				brand: data.get('brand'),
				model: data.get('model'),
				year: Number(data.get('year')),
				price: Number(data.get('price')),
				currency: data.get('currency') || 'CRC',
				mileage: Number(data.get('mileage')),
				condition: data.get('condition'),
				transmission: data.get('transmission'),
				fuel: data.get('fuel'),
				bodyType: data.get('bodyType') || 'sedan',
				color: data.get('color') || 'Gris',
				location: data.get('location'),
				description: data.get('description'),
				images: [...images],
			};

			try {
				const id = data.get('id');
				if (id) {
					updateCar(String(id), payload);
					showToast('Vehículo actualizado', 'success');
				} else {
					addCar(payload);
					showToast('Vehículo publicado', 'success');
				}
				window.setTimeout(() => {
					window.location.href = './dashboard.html';
				}, 500);
			} catch (error) {
				const message =
					error.message === 'LIMIT_FREE'
						? 'Límite del plan Gratis alcanzado. Mejora a Premium.'
						: error.message || 'No se pudo guardar';
				setError(message);
				showToast(message, 'error');
			}
		});

		root.dataset.vehicleFormReady = 'true';
	});
};

export default vehicleForm;

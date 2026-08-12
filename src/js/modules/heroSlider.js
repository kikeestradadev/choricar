const heroSlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.hero-banner').forEach((root) => {
		if (root.dataset.heroSliderReady === 'true') return;

		const el = root.querySelector('.hero-banner__slider');
		if (!el) return;

		new Swiper(el, {
			slidesPerView: 1,
			loop: true,
			autoplay: { delay: 5500, disableOnInteraction: false },
			pagination: {
				el: root.querySelector('.hero-banner__pagination'),
				clickable: true,
			},
		});

		const modelsDataEl = document.getElementById('filters-models-data');
		let modelsByBrand = {};
		try {
			modelsByBrand = modelsDataEl ? JSON.parse(modelsDataEl.textContent) : {};
		} catch {
			modelsByBrand = {};
		}

		const brandSelect = root.querySelector('#hero-brand');
		const modelSelect = root.querySelector('#hero-model');

		const fillModels = (brand) => {
			if (!modelSelect) return;
			modelSelect.innerHTML = '<option value="">Todas</option>';
			(modelsByBrand[brand] || []).forEach((model) => {
				const option = document.createElement('option');
				option.value = model;
				option.textContent = model;
				modelSelect.append(option);
			});
		};

		brandSelect?.addEventListener('change', () => fillModels(brandSelect.value));

		root.dataset.heroSliderReady = 'true';
	});
};

export default heroSlider;

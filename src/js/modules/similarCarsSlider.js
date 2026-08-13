const destroySwiper = (instance) => {
	if (instance && typeof instance.destroy === 'function') {
		instance.destroy(true, true);
	}
};

const similarCarsSlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.similar-cars-slider').forEach((root) => {
		if (root.dataset.similarCarsSliderReady === 'true') return;

		const el = root.querySelector('.swiper');
		const wrapper = root.querySelector('.swiper-wrapper');
		const empty = root.querySelector('[data-similar-empty]');
		if (!el || !wrapper) return;

		destroySwiper(root._swiper);
		root._swiper = null;

		const slideCount = wrapper.querySelectorAll('.swiper-slide').length;

		if (!slideCount) {
			if (empty) empty.hidden = false;
			el.hidden = true;
			root.dataset.similarCarsSliderReady = 'true';
			return;
		}

		if (empty) empty.hidden = true;
		el.hidden = false;

		root._swiper = new Swiper(el, {
			slidesPerView: 1.15,
			spaceBetween: 16,
			grabCursor: true,
			watchOverflow: true,
			threshold: 8,
			pagination: {
				el: root.querySelector('.swiper-pagination'),
				clickable: true,
			},
			navigation: {
				nextEl: root.querySelector('.swiper-button-next'),
				prevEl: root.querySelector('.swiper-button-prev'),
			},
			breakpoints: {
				765: {
					slidesPerView: 1.5,
					spaceBetween: 16,
				},
				960: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				1280: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
		});

		root.dataset.similarCarsSliderReady = 'true';
	});
};

export default similarCarsSlider;

const destroySwiper = (instance) => {
	if (instance && typeof instance.destroy === 'function') {
		instance.destroy(true, true);
	}
};

const vehicleGallerySlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.vehicle-gallery-slider').forEach((root) => {
		if (root.dataset.vehicleGallerySliderReady === 'true') return;

		const el = root.querySelector('.vehicle-detail__swiper') || root.querySelector('.swiper');
		if (!el) return;

		destroySwiper(root._thumbsSwiper);
		destroySwiper(root._swiper);
		root._thumbsSwiper = null;
		root._swiper = null;

		const thumbsEl = root.querySelector('.vehicle-detail__thumbs');
		const thumbsSlides = thumbsEl?.querySelectorAll('.swiper-slide').length || 0;

		if (thumbsEl && thumbsSlides > 1) {
			root._thumbsSwiper = new Swiper(thumbsEl, {
				slidesPerView: Math.min(4, thumbsSlides),
				spaceBetween: 8,
				watchSlidesProgress: true,
				freeMode: true,
			});
		}

		root._swiper = new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 8,
			navigation: {
				nextEl: root.querySelector('.swiper-button-next'),
				prevEl: root.querySelector('.swiper-button-prev'),
			},
			pagination: {
				el: root.querySelector('.swiper-pagination'),
				clickable: true,
			},
			thumbs: root._thumbsSwiper ? { swiper: root._thumbsSwiper } : undefined,
		});

		root.dataset.vehicleGallerySliderReady = 'true';
	});
};

export default vehicleGallerySlider;

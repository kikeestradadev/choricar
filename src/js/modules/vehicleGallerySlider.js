const vehicleGallerySlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.vehicle-gallery-slider').forEach((root) => {
		if (root.dataset.vehicleGallerySliderReady === 'true') return;

		const el = root.querySelector('.swiper');
		if (!el) return;

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
		});

		root.dataset.vehicleGallerySliderReady = 'true';
	});
};

export default vehicleGallerySlider;

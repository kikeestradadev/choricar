const vehicleFilters = () => {
	document.querySelectorAll('[data-filters-root]').forEach((root) => {
		if (root.dataset.vehicleFiltersReady === 'true') return;

		const toggle = root.querySelector('.vehicle-filters__toggle');
		const form = root.querySelector('.vehicle-filters__form');

		toggle?.addEventListener('click', () => {
			const open = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!open));
			form?.classList.toggle('is-open', !open);
		});

		root.dataset.vehicleFiltersReady = 'true';
	});
};

export default vehicleFilters;

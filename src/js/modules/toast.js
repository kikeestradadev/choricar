const toast = () => {
	document.querySelectorAll('.toast').forEach((root) => {
		if (root.dataset.toastReady === 'true') return;

		const closeBtn = root.querySelector('[data-toast-close]');
		closeBtn?.addEventListener('click', () => {
			root.hidden = true;
		});

		root.dataset.toastReady = 'true';
	});
};

export const showToast = (message, type = 'success') => {
	let root = document.querySelector('.toast');
	if (!root) {
		root = document.createElement('div');
		root.className = 'toast';
		root.innerHTML =
			'<p class="toast__message" data-toast-message></p><button class="toast__close" type="button" aria-label="Cerrar" data-toast-close>×</button>';
		document.body.append(root);
		toast();
	}

	const messageEl = root.querySelector('[data-toast-message]');
	if (messageEl) messageEl.textContent = message;
	root.classList.toggle('toast--error', type === 'error');
	root.classList.toggle('toast--success', type !== 'error');
	root.hidden = false;

	window.clearTimeout(root._toastTimer);
	root._toastTimer = window.setTimeout(() => {
		root.hidden = true;
	}, 3200);
};

export default toast;

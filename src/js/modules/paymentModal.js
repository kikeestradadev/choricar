import { getCurrentUser, subscribe } from '../db/ecommerceStore.js';
import { showToast } from './toast.js';

const paymentModal = () => {
	document.querySelectorAll('[data-payment-modal]').forEach((root) => {
		if (root.dataset.paymentModalReady === 'true') return;

		const form = root.querySelector('.payment-modal__form');
		const errorEl = root.querySelector('[data-modal-error]');

		const close = () => {
			root.hidden = true;
			document.body.classList.remove('has-modal');
		};

		const open = () => {
			root.hidden = false;
			document.body.classList.add('has-modal');
		};

		root.querySelectorAll('[data-modal-close]').forEach((el) => {
			el.addEventListener('click', close);
		});

		form?.addEventListener('submit', (event) => {
			event.preventDefault();
			const user = getCurrentUser();
			if (!user) {
				window.location.href = './login.html';
				return;
			}

			const data = new FormData(form);
			const number = String(data.get('cardNumber') || '').replace(/\s/g, '');
			if (number.length < 12) {
				if (errorEl) {
					errorEl.hidden = false;
					errorEl.textContent = 'Ingresa un número de tarjeta válido (simulado)';
				}
				return;
			}

			try {
				subscribe(user.id, 'premium');
				showToast('¡Bienvenido a Premium!', 'success');
				close();
				window.setTimeout(() => {
					window.location.href = './dashboard.html';
				}, 600);
			} catch (error) {
				showToast(error.message || 'No se pudo activar Premium', 'error');
			}
		});

		root._openPaymentModal = open;
		root.dataset.paymentModalReady = 'true';
	});
};

export const openPaymentModal = () => {
	const modal = document.querySelector('[data-payment-modal]');
	if (modal?._openPaymentModal) {
		modal._openPaymentModal();
		return;
	}
	paymentModal();
	document.querySelector('[data-payment-modal]')?._openPaymentModal?.();
};

export default paymentModal;

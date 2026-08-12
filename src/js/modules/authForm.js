import {
	loginUser,
	loginWithSocial,
	registerUser,
} from '../db/ecommerceStore.js';
import { showToast } from './toast.js';

const authForm = () => {
	document.querySelectorAll('[data-auth-form]').forEach((root) => {
		if (root.dataset.authFormReady === 'true') return;

		const mode = root.dataset.authMode || 'login';
		const form = root.querySelector('.auth-form__form');
		const errorEl = root.querySelector('[data-auth-error]');

		form?.addEventListener('submit', (event) => {
			event.preventDefault();
			if (errorEl) {
				errorEl.hidden = true;
				errorEl.textContent = '';
			}

			const data = new FormData(form);
			try {
				if (mode === 'register') {
					registerUser({
						name: data.get('name'),
						email: data.get('email'),
						password: data.get('password'),
						phone: data.get('phone'),
					});
					showToast('Cuenta creada correctamente', 'success');
				} else {
					loginUser(data.get('email'), data.get('password'));
					showToast('Sesión iniciada', 'success');
				}
				window.setTimeout(() => {
					window.location.href = './dashboard.html';
				}, 400);
			} catch (error) {
				if (errorEl) {
					errorEl.hidden = false;
					errorEl.textContent = error.message || 'Error de autenticación';
				}
				showToast(error.message || 'Error', 'error');
			}
		});

		root.querySelectorAll('[data-social]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const provider = btn.dataset.social;
				try {
					loginWithSocial(provider, {
						name: provider === 'google' ? 'Cuenta Google' : 'Cuenta Facebook',
						email: `${provider}.demo@choricar.social`,
						avatar: `https://i.pravatar.cc/150?u=${provider}`,
					});
					showToast(`Sesión con ${provider}`, 'success');
					window.setTimeout(() => {
						window.location.href = './dashboard.html';
					}, 400);
				} catch (error) {
					showToast(error.message || 'Error social login', 'error');
				}
			});
		});

		root.dataset.authFormReady = 'true';
	});
};

export default authForm;

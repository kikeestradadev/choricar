import { getCurrentUser } from '../db/ecommerceStore.js';
import { openPaymentModal } from './paymentModal.js';
import { showToast } from './toast.js';

const subscriptionPlans = () => {
	document.querySelectorAll('[data-subscription-plans]').forEach((root) => {
		if (root.dataset.subscriptionPlansReady === 'true') return;

		root.querySelectorAll('[data-plan-premium]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const user = getCurrentUser();
				if (!user) {
					window.location.href = './login.html';
					return;
				}
				if (user.plan === 'premium') {
					showToast('Ya tienes el plan Premium', 'success');
					return;
				}
				openPaymentModal();
			});
		});

		root.dataset.subscriptionPlansReady = 'true';
	});
};

export default subscriptionPlans;

import {
	getCurrentUser,
	loadEcommerceStore,
	logout,
} from '../db/ecommerceStore.js';
import { STORE_EVENT } from '../db/ecommerceStore.js';

const closeUserMenus = (except = null) => {
	document.querySelectorAll('[data-user-menu].is-open').forEach((menu) => {
		if (except && menu === except) return;
		menu.classList.remove('is-open');
		const trigger = menu.querySelector('[data-user-menu-trigger]');
		const panel = menu.querySelector('[data-user-menu-panel]');
		trigger?.setAttribute('aria-expanded', 'false');
		if (panel) panel.hidden = true;
	});
};

const setMobileNavOpen = (root, open) => {
	const toggle = root.querySelector('[data-nav-toggle]');
	const nav = root.querySelector('[data-nav-panel]');
	const backdrop = root.querySelector('[data-nav-backdrop]');

	toggle?.setAttribute('aria-expanded', String(open));
	toggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
	nav?.classList.toggle('is-open', open);
	backdrop?.classList.toggle('is-open', open);
	if (backdrop) backdrop.hidden = !open;
	document.body.classList.toggle('has-mobile-nav', open);
};

const renderAuthSlot = (root) => {
	const slot = root.querySelector('[data-auth-slot]');
	if (!slot) return;
	const user = getCurrentUser();

	if (!user) {
		slot.innerHTML = `
			<a class="main-header__btn main-header__btn--ghost" href="./login.html">Iniciar sesión</a>
			<a class="main-header__btn main-header__btn--accent" href="./registro.html">Registrarse</a>
		`;
		return;
	}

	slot.innerHTML = `
		<div class="main-header__user-menu" data-user-menu>
			<button
				class="main-header__avatar-btn"
				type="button"
				data-user-menu-trigger
				aria-expanded="false"
				aria-haspopup="true"
				aria-controls="main-header-user-panel"
				aria-label="Menú de cuenta"
			>
				<img class="main-header__avatar" src="${user.avatar}" alt="" width="32" height="32" />
			</button>
			<div class="main-header__user-tip" id="main-header-user-panel" role="menu" hidden data-user-menu-panel>
				<button class="main-header__user-tip-btn" type="button" role="menuitem" data-logout>Cerrar sesión</button>
			</div>
		</div>
	`;

	const menu = slot.querySelector('[data-user-menu]');
	const trigger = slot.querySelector('[data-user-menu-trigger]');
	const panel = slot.querySelector('[data-user-menu-panel]');

	const setOpen = (open) => {
		menu?.classList.toggle('is-open', open);
		trigger?.setAttribute('aria-expanded', String(open));
		if (panel) panel.hidden = !open;
	};

	trigger?.addEventListener('click', (event) => {
		event.stopPropagation();
		const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
		closeUserMenus(menu);
		setOpen(willOpen);
	});

	panel?.addEventListener('click', (event) => {
		event.stopPropagation();
	});

	slot.querySelector('[data-logout]')?.addEventListener('click', () => {
		logout();
		window.location.href = './index.html';
	});
};

const mainHeader = () => {
	document.querySelectorAll('.main-header').forEach((root) => {
		if (root.dataset.mainHeaderReady === 'true') {
			renderAuthSlot(root);
			return;
		}

		const toggle = root.querySelector('[data-nav-toggle]');
		const backdrop = root.querySelector('[data-nav-backdrop]');
		const nav = root.querySelector('[data-nav-panel]');

		const openNav = () => setMobileNavOpen(root, true);
		const closeNav = () => setMobileNavOpen(root, false);

		toggle?.addEventListener('click', () => {
			const open = toggle.getAttribute('aria-expanded') === 'true';
			if (open) closeNav();
			else openNav();
		});

		backdrop?.addEventListener('click', closeNav);

		nav?.querySelectorAll('.main-header__link').forEach((link) => {
			link.addEventListener('click', closeNav);
		});

		document.addEventListener('click', () => closeUserMenus());
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeUserMenus();
				closeNav();
			}
		});

		window.addEventListener('resize', () => {
			if (window.matchMedia(`(min-width: 960px)`).matches) {
				closeNav();
			}
		});

		renderAuthSlot(root);
		document.addEventListener(STORE_EVENT, () => renderAuthSlot(root));

		root.dataset.mainHeaderReady = 'true';
	});
};

export const ensureStore = async () => {
	try {
		await loadEcommerceStore();
	} catch (error) {
		console.error(error);
	}
};

export default mainHeader;

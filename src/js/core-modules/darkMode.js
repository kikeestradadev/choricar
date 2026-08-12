export default function darkMode() {
	const themeToggle = document.getElementById('theme-toggle');
	const htmlElement = document.documentElement;
	
	// Check for saved theme preference or default to system preference
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
	
	// Apply the theme on page load
	if (currentTheme === 'dark') {
		htmlElement.classList.add('dark');
	}
	
	// Toggle theme when button is clicked
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			htmlElement.classList.toggle('dark');
			
			// Save the user's preference
			const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
			localStorage.setItem('theme', theme);
		});
	}
}

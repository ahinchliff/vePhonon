module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'phonon-wave': "url('../public/images/background.webp')",
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};

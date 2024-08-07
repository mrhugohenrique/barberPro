/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554'
				},
				btnColor: '#2D3748',
				secondary: '#FBB231',

				/*  bg: '#12131B',
        details: '#2D3748',
        green: '#31FB6A',
        red: '#FF3E3E',
        gray: '#585858',
        bgModal: 'rgba(0, 0, 0, 0.5)', */
				customColor: 'rgb(36, 54, 83)',

				headerColor: '#0C0C0E',
				textColor: '#FFFBFF',
				effectsColor: '#F24C00',
				hoverOrange: '#FF6A25',
				cardsColor: 'rgba(255, 255, 255, 0.2)'
			},
			backgroundImage: {
				backgroundImage: "url('../src/assets/bg-image.jpg')"
			},
			height: {
				heightFull: 'calc(100vh - 4.7em)'
			}
		},
		fontFamily: {
			body: [
				'Roboto',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'system-ui',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			]
		}
	},
	plugins: []
};

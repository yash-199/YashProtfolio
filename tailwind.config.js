/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				ink: {
					DEFAULT: "#07070b",
					900: "#0b0b11",
					800: "#111119",
					700: "#191922",
				},
				paper: "#f4f2ee",
				muted: "#9b99a6",
				ember: {
					DEFAULT: "#ff5a1f",
					soft: "#ff8a5c",
				},
				iris: {
					DEFAULT: "#7c5cff",
					soft: "#a593ff",
				},
			},
			fontFamily: {
				sans: ['"Outfit"', "system-ui", "sans-serif"],
				serif: ['"Instrument Serif"', "Georgia", "serif"],
				mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
			},
			letterSpacing: {
				tightest: "-0.055em",
			},
			keyframes: {
				fadeUp: {
					"0%": { opacity: 0, transform: "translateY(40px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				aurora: {
					"0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
					"33%": { transform: "translate3d(6%,-8%,0) scale(1.12)" },
					"66%": { transform: "translate3d(-6%,6%,0) scale(0.94)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				pulseRing: {
					"0%": { transform: "scale(1)", opacity: 0.7 },
					"100%": { transform: "scale(2.6)", opacity: 0 },
				},
				blink: {
					"0%, 49%": { opacity: 1 },
					"50%, 100%": { opacity: 0 },
				},
			},
			animation: {
				fadeUp: "fadeUp 1s ease-out forwards",
				aurora: "aurora 18s ease-in-out infinite",
				"aurora-slow": "aurora 26s ease-in-out infinite reverse",
				float: "float 6s ease-in-out infinite",
				pulseRing: "pulseRing 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite",
				blink: "blink 1s step-end infinite",
			},
		},
	},
	plugins: [],
};

const defaultTheme = require("tailwindcss/defaultTheme");

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        primary: [
          '"Oracle"',
          '"Noto Sans JP"',
          '"Noto Sans KR"',
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        secondary: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
        tertiary: [
          "Lucida Sans Typewriter",
          "Lucida Console",
          "monaco",
          "Bitstream Vera Sans Mono",
          "monospace",
        ],
      },
      border: {
        white: `hsla(0, 0%, 100%, .1);`,
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
        yellow: "var(--color-yellow)",
        red: "var(--color-red)",
        green: "var(--color-green)",
        lightGrey: "var(--color-lightGrey)",
        neutral: {
          0: "var(--color-neutral-0)",
          10: "var(--color-neutral-10)",
          20: "var(--color-neutral-20)",
          30: "var(--color-neutral-30)",
          40: "var(--color-neutral-40)",
          50: "var(--color-neutral-50)",
          60: "var(--color-neutral-60)",
          70: "var(--color-neutral-70)",
          80: "var(--color-neutral-80)",
          90: "var(--color-neutral-90)",
          100: "var(--color-neutral-100)",
        },
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        action: {
          DEFAULT: "var(--color-action)",
          light: "var(--color-action-light)",
          contrast: "var(--color-action-contrast)",
          inverse: "var(--color-action-inverse)",
          highlight: "var(--color-action-highlight)",
          muted: "var(--color-action-muted)",
        },
        highlight: {
          DEFAULT: "var(--color-highlight)",
          light: "var(--color-highlight-light)",
          contrast: "var(--color-highlight-contrast)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          light: "var(--color-success-light)",
          contrast: "var(--color-success-contrast)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          light: "var(--color-warning-light)",
          contrast: "var(--color-warning-contrast)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          light: "var(--color-error-light)",
          contrast: "var(--color-error-contrast)",
        },
        viewportBackground: "var(--color-viewport-background)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          body: "var(--color-text-body)",
          bodySecondary: "var(--color-text-body-secondary)",
          light: "var(--color-text-light)",
        },
        nav: {
          light: "var(--color-nav-light)",
          dark: "var(--color-nav-dark)",
        },
        nprogress: "var(--color-nprogress)",
      },
      fontSize: {
        base: "clamp(12px, 2rem, 24px)",
        display: "4.8rem",
        h1: "25rem",
        h2: "17rem",
        h3: "7.2rem",
        h4: "5.2rem",
        h5: "4rem",
        h6: "3rem",
        body: "clamp(12px, 2rem, 24px)",
        bodySm: "clamp(10px, calc(2rem*0.75), 18px)",
        bodyLg: "clamp(22px, 2.2rem, 28px)",
      },
      lineHeight: {
        reset: 1,
        text: 1.5,
        h1: "90%",
        h2: "87%",
        h3: "120%",
        h4: "87%",
        h5: "140%",
        h6: "87%",
      },
      spacing: {
        base: "3.6rem",
        xs: "calc(3.6rem * 0.25)",
        sm: "calc(3.6rem * 0.5)",
        md: "3.6rem",
        lg: "calc(3.6rem * 1.3)",
        xl: "calc(3.6rem * 2)",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "star-movement-bottom": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(-100%, 0%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(100%, 0%)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.8)" },
        },
        rotate360: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        gradient: "gradient 8s linear infinite",
        shine: "shine 5s linear infinite",
        "fade-in": "fadeIn 1s ease-out-sine forwards",
        "fade-out": "fadeOut 1s ease-in-sine forwards",
        "scale-in": "scaleIn 0.5s ease-in-out-cubic forwards",
        "scale-out": "scaleOut 0.5s ease-in-out-cubic forwards",
        rotate: "rotate360 1s ease-out-quint infinite linear",
        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
      },
      // Custom timing functions (you can use them with Tailwind utilities)
      transitionTimingFunction: {
        "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
        "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
        "ease-in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
        "ease-in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
        "ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
      },
      // Custom animation durations (make sure to modify as per needs)
      animationDuration: {
        duration: "0.5s",
        "duration-slow": "1s", // For longer animations
        "duration-fast": "0.25s", // For quicker animations
      },
    },
  },
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" fill=\"none\" stroke=\"${value}\"><path d=\"M0 .5H31.5V32\"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"${value}\"><path d=\"M0 .5H31.5V32\"/></svg>`
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"16\" height=\"16\" fill=\"none\"><circle fill=\"${value}\" id=\"pattern-circle\" cx=\"10\" cy=\"10\" r=\"1.6257413380501518\"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

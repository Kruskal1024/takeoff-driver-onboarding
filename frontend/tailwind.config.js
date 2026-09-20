/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core neutrals
        ink: {
          DEFAULT: "#101B2E", // primary text, dark surfaces
          900: "#0B1422",
          800: "#101B2E",
          700: "#1B2A42",
          600: "#2C3C57",
        },
        paper: "#F6F6F4", // app background — cool, quiet off-white (not cream)
        cloud: "#FFFFFF", // card / surface white
        mist: {
          100: "#F1F2F4",
          200: "#E4E6EB",
          300: "#D2D6DE",
          400: "#AEB4C2",
          500: "#7A8194",
          600: "#5B6274",
        },
        // Brand
        beacon: {
          DEFAULT: "#1B3A6B", // deep navy-blue — primary actions, links
          600: "#15294D",
          500: "#1B3A6B",
          400: "#2C5290",
          100: "#E6ECF5",
        },
        signal: {
          DEFAULT: "#E2A63B", // runway-light amber — sparing accent
          600: "#C98A22",
          500: "#E2A63B",
          100: "#FBF0DA",
        },
        success: {
          DEFAULT: "#1F9D6C",
          100: "#E2F5ED",
        },
        danger: {
          DEFAULT: "#C7402E",
          100: "#FBEAE7",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 27, 46, 0.04), 0 8px 24px -12px rgba(16, 27, 46, 0.18)",
        focus: "0 0 0 3px rgba(226, 166, 59, 0.35)",
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

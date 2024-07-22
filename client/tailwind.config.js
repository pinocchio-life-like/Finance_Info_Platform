/* eslint-env node */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "nav-bg": "#d9d9d9",
        comment: "#0c0d0e",
        userName: "#008dda",
        ansBg: "#F0F3F4",
      },
      fontSize: {
        commentText: "13px",
      },
    },
  },
  plugins: [],
};

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
      },
    },
  },
//   plugins: [
//     require('flowbite/plugin')
//   ],
//   content: [
//     'node_modules/flowbite-react/lib/esm/**/*.js'
// ]
};

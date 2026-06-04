import linted from "linted";

export default linted(
  {
    js: {
      ignores: ["vite.config.js"],
      rules: {
        "no-undef": 0,
      },
    },
  },
);

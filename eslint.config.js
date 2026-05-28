import linted from "linted";

export default linted(
  {
    js: {
      ignores: ["vite.config.js"],
    },
    css: {
      rules: {
        "css/no-invalid-at-rules": 0,
      },
    },
  },
);
